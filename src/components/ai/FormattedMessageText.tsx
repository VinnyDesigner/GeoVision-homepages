import React from 'react';
import { MapPin, Database } from 'lucide-react';

interface FormattedMessageTextProps {
  content: string;
  isArabic?: boolean;
  className?: string;
}

interface ParsedNumberedItem {
  num: string;
  name?: string;
  distance?: string;
  text?: string;
}

interface ParsedKvItem {
  key: string;
  value: string;
}

interface ParsedBulletItem {
  text: string;
}

type ParsedSection =
  | { type: 'subtitle'; title: string }
  | { type: 'numbered'; items: ParsedNumberedItem[] }
  | { type: 'kv'; items: ParsedKvItem[] }
  | { type: 'bullet'; items: ParsedBulletItem[] }
  | { type: 'datasource'; label: string; value: string }
  | { type: 'paragraph'; lines: string[] };

/**
 * Parses inline formatting like **bold**, `code/metric`, and *italic*
 */
const renderInlineFormatting = (text: string): React.ReactNode => {
  if (!text) return null;
  // Regex to match **bold**, `code`, *italic*
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {inner}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      const inner = token.slice(1, -1);
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md text-[11.5px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-geovision-blue dark:text-sky-300 border border-slate-200/80 dark:border-slate-700 select-all"
        >
          {inner}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      const inner = token.slice(1, -1);
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-100">
          {inner}
        </em>
      );
    }
    return token;
  });
};

/**
 * Converts structured multi-line AI responses into formatted visual sections:
 * - Subtitles ("Nearest hospitals:", "أقرب المستشفيات:", markdown headers)
 * - Numbered lists with distance pills and circular numbers
 * - Key-value / indented spatial accessibility points
 * - Data source provenance badges
 * - Standard paragraphs with natural breathing room
 */
const parseMessageToSections = (content: string): ParsedSection[] => {
  const lines = content.split('\n');
  const sections: ParsedSection[] = [];
  let currentNumberedList: { type: 'numbered'; items: ParsedNumberedItem[] } | null = null;
  let currentKvList: { type: 'kv'; items: ParsedKvItem[] } | null = null;
  let currentBulletList: { type: 'bullet'; items: ParsedBulletItem[] } | null = null;
  let currentParagraph: { type: 'paragraph'; lines: string[] } | null = null;

  const flushLists = () => {
    if (currentNumberedList) {
      sections.push(currentNumberedList);
      currentNumberedList = null;
    }
    if (currentKvList) {
      sections.push(currentKvList);
      currentKvList = null;
    }
    if (currentBulletList) {
      sections.push(currentBulletList);
      currentBulletList = null;
    }
  };

  const flushParagraph = () => {
    if (currentParagraph) {
      sections.push(currentParagraph);
      currentParagraph = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushLists();
      flushParagraph();
      continue;
    }

    // 1. Data Source block ("Data Source: ...", "مصدر البيانات: ...")
    const dsMatch = trimmed.match(/^(Data Source|مصدر البيانات):?\s*(.*)$/i);
    if (dsMatch) {
      flushLists();
      flushParagraph();
      let sourceName = dsMatch[2].trim();
      if (!sourceName && i + 1 < lines.length && lines[i + 1].trim()) {
        sourceName = lines[i + 1].trim();
        i++; // consume next line
      }
      sections.push({
        type: 'datasource',
        label: dsMatch[1],
        value: sourceName,
      });
      continue;
    }

    // 2. Subtitle / Section Header
    // e.g. "Nearest hospitals:", "أقرب المستشفيات:", "### Title", "**Title:**", "Boundary Analysis:"
    const isHeadingMarkdown = /^#+\s+(.*)$/.test(trimmed);
    const isBoldHeader = /^\*\*(.*?)\*\*:?$/.test(trimmed);
    const isColonSubtitle = /^([A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-_—()]+)[:：]$/.test(trimmed) && trimmed.length < 75;

    if (isHeadingMarkdown || isBoldHeader || isColonSubtitle) {
      flushLists();
      flushParagraph();
      let title = trimmed;
      if (isHeadingMarkdown) {
        title = trimmed.replace(/^#+\s*/, '');
      } else if (isBoldHeader) {
        title = trimmed.replace(/^\*\*|\*\*:?$/g, '');
      }
      sections.push({
        type: 'subtitle',
        title,
      });
      continue;
    }

    // 3. Numbered List item
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      if (currentKvList || currentBulletList) flushLists();
      if (!currentNumberedList) {
        currentNumberedList = { type: 'numbered', items: [] };
      }

      const itemContent = numMatch[2];
      // Check for distance metric like "(Distance: 1.2 km)" or "(المسافة: 1.2 كم)"
      const distMatch = itemContent.match(/^(.*?)\s*\((Distance|المسافة):\s*([0-9.]+\s*(?:km|كم|m|م))\)$/i);
      if (distMatch) {
        currentNumberedList.items.push({
          num: numMatch[1],
          name: distMatch[1].trim(),
          distance: distMatch[3].trim(),
        });
      } else {
        currentNumberedList.items.push({
          num: numMatch[1],
          text: itemContent,
        });
      }
      continue;
    }

    // 4. Bullet item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      const content = bulletMatch[1];
      // Check if bullet has Key: Value structure e.g. "• Education: 23 schools..."
      const kvInBullet = content.match(/^([^:\n]+):\s*(.+)$/);
      if (kvInBullet) {
        if (currentNumberedList || currentBulletList) flushLists();
        if (!currentKvList) {
          currentKvList = { type: 'kv', items: [] };
        }
        currentKvList.items.push({
          key: kvInBullet[1].trim(),
          value: kvInBullet[2].trim(),
        });
      } else {
        if (currentNumberedList || currentKvList) flushLists();
        if (!currentBulletList) {
          currentBulletList = { type: 'bullet', items: [] };
        }
        currentBulletList.items.push({
          text: content,
        });
      }
      continue;
    }

    // 5. Indented Key-Value item (e.g. "  Choueifat International School: 350 m...")
    const indentedKv = rawLine.match(/^(\s{2,})([^:\n]+):\s*(.+)$/);
    if (indentedKv) {
      flushParagraph();
      if (currentNumberedList || currentBulletList) flushLists();
      if (!currentKvList) {
        currentKvList = { type: 'kv', items: [] };
      }
      currentKvList.items.push({
        key: indentedKv[2].trim(),
        value: indentedKv[3].trim(),
      });
      continue;
    }

    // 6. Otherwise standard paragraph line
    flushLists();
    if (!currentParagraph) {
      currentParagraph = { type: 'paragraph', lines: [] };
    }
    currentParagraph.lines.push(trimmed);
  }

  flushLists();
  flushParagraph();
  return sections;
};

export const FormattedMessageText: React.FC<FormattedMessageTextProps> = ({
  content,
  isArabic = false,
  className = '',
}) => {
  if (!content) return null;

  const sections = parseMessageToSections(content);

  return (
    <div
      className={`space-y-3 text-[13.5px] sm:text-[14px] leading-[1.65] font-normal text-slate-700 dark:text-slate-200 select-text ${
        isArabic ? 'text-right font-arabic' : 'text-left'
      } ${className}`}
    >
      {sections.map((section, idx) => {
        // Subtitle / Heading
        if (section.type === 'subtitle') {
          return (
            <h4
              key={idx}
              className="text-[13px] sm:text-[13.5px] font-bold text-slate-900 dark:text-white tracking-tight pt-2 pb-0.5 first:pt-0 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-geovision-blue dark:bg-sky-400 shrink-0" />
              <span>{renderInlineFormatting(section.title)}</span>
            </h4>
          );
        }

        // Numbered List
        if (section.type === 'numbered') {
          return (
            <ol key={idx} className="space-y-2.5 sm:space-y-3 my-2">
              {section.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start justify-between gap-2.5 p-2.5 px-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-700 text-[11px] font-bold text-geovision-blue dark:text-sky-300 mt-0.5 shrink-0 border border-blue-200/80 dark:border-slate-600">
                      {item.num}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-[13px] sm:text-[13.5px] leading-snug break-words">
                      {renderInlineFormatting(item.name || item.text || '')}
                    </span>
                  </div>
                  {item.distance && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200/90 dark:border-slate-700 shrink-0 shadow-2xs whitespace-nowrap mt-0.5">
                      <MapPin className="w-3 h-3 text-geovision-blue dark:text-sky-400 shrink-0" />
                      {item.distance}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          );
        }

        // Key-Value List
        if (section.type === 'kv') {
          return (
            <div key={idx} className="space-y-2 my-2">
              {section.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex items-start gap-2 p-2 px-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-[13px] sm:text-[13.5px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-geovision-blue dark:bg-sky-400 mt-2 shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {item.key}:
                  </span>
                  <span className="flex-1 text-slate-700 dark:text-slate-200">
                    {renderInlineFormatting(item.value)}
                  </span>
                </div>
              ))}
            </div>
          );
        }

        // Bullet List
        if (section.type === 'bullet') {
          return (
            <ul key={idx} className="space-y-2 my-2 pl-1 rtl:pl-0 rtl:pr-1">
              {section.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-geovision-blue dark:bg-sky-400 mt-2 shrink-0" />
                  <span className="flex-1 leading-relaxed text-slate-800 dark:text-slate-200">
                    {renderInlineFormatting(item.text)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // Data Source Provenance Card
        if (section.type === 'datasource') {
          return (
            <div
              key={idx}
              className="mt-3.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
            >
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-geovision-blue dark:text-sky-400 shrink-0" />
                {section.label}:
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300 text-right rtl:text-left bg-slate-100/90 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-[11px] sm:text-[11.5px]">
                {section.value}
              </span>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-200">
            {section.lines.map((line, lIdx) => {
              // Check if line starts with a title/label prefix like "Accessibility Index: ..."
              const matchLabel = line.match(/^([A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-_—()]{1,40}):\s+(.+)$/);
              return (
                <React.Fragment key={lIdx}>
                  {matchLabel ? (
                    <>
                      <strong className="font-bold text-slate-900 dark:text-white">
                        {matchLabel[1]}:
                      </strong>{' '}
                      {renderInlineFormatting(matchLabel[2])}
                    </>
                  ) : (
                    renderInlineFormatting(line)
                  )}
                  {lIdx < section.lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedMessageText;
