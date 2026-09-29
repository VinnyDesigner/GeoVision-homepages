const testCases = [
  {
    name: 'Hospital search with Distance',
    text: `Found 8 hospitals within 5 km of your location.

Nearest hospitals:
1. Sheikh Khalifa Medical City (SKMC) (Distance: 1.2 km)
2. Burjeel Hospital Abu Dhabi (Distance: 2.1 km)
3. Al Bateen Healthcare Center (Distance: 2.6 km)

Data Source:
Abu Dhabi SDI Healthcare Layer`
  },
  {
    name: 'Arabic Hospital search',
    text: `عثرت على 8 مستشفيات ضمن نطاق 5 كم من موقعك.

أقرب المستشفيات:
1. مدينة الشيخ خليفة الطبية (المسافة: 1.2 كم)
2. مستشفى برجيل أبوظبي (المسافة: 2.1 كم)
3. مركز البطين للرعاية الصحية (المسافة: 2.6 كم)

مصدر البيانات:
البنية التحتية للبيانات المكانية لأبوظبي (SDI)`
  },
  {
    name: 'Schools and bus accessibility with indentation',
    text: `Identified 24 schools within 2 km of bus stations in Khalifa City.

Nearby bus accessibility:
  Choueifat International School: 350 m from bus station
  Raha International School: 600 m from bus station
  GEMS American Academy: 820 m from bus station

Data Source:
Abu Dhabi SDI Education & Transport Layers`
  },
  {
    name: 'Multi-line paragraph and bullets',
    text: `Comprehensive GeoAI Spatial Analysis Report:

• Education: 23 schools & 14 nurseries active.
• Healthcare: 12 hospitals including Level-1 Trauma SSMC.
• Transport: 42 bus stops with 88% 500m buffer coverage.
• Public Safety: 4 Police & Civil Defence stations (< 4 min response).
• Recreation: 18 public parks & family playgrounds.`
  },
  {
    name: 'Welcome message',
    text: `Hello! I am **GeoVision**, your AI spatial assistant for Abu Dhabi. Ask me anything about location services, healthcare, schools, or spatial planning.`
  }
];

function parseMessageToSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentList = null; // { type: 'numbered' | 'bullet' | 'kv', items: [] }
  let currentParagraph = null; // { type: 'paragraph', lines: [] }

  function flushList() {
    if (currentList) {
      sections.push(currentList);
      currentList = null;
    }
  }

  function flushParagraph() {
    if (currentParagraph) {
      sections.push(currentParagraph);
      currentParagraph = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    // 1. Check if line is a Data Source block
    const dsMatch = trimmed.match(/^(Data Source|مصدر البيانات):?\s*(.*)$/i);
    if (dsMatch) {
      flushList();
      flushParagraph();
      let sourceName = dsMatch[2].trim();
      if (!sourceName && i + 1 < lines.length && lines[i + 1].trim()) {
        sourceName = lines[i + 1].trim();
        i++; // consume next line
      }
      sections.push({
        type: 'datasource',
        label: dsMatch[1],
        value: sourceName
      });
      continue;
    }

    // 2. Check if line is a Subtitle / Section Header
    // e.g. "Nearest hospitals:", "أقرب المستشفيات:", "### Title", "**Title:**", "Boundary Analysis:"
    const isHeadingMarkdown = /^#+\s+(.*)$/.test(trimmed);
    const isBoldHeader = /^\*\*(.*?)\*\*:?$/.test(trimmed);
    // Subtitle ending with colon (English or Arabic or Arabic colon U+061B / standard colon)
    const isColonSubtitle = /^([A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-_—()]+)[:：]$/.test(trimmed) && trimmed.length < 65;

    if (isHeadingMarkdown || isBoldHeader || isColonSubtitle) {
      flushList();
      flushParagraph();
      let title = trimmed;
      if (isHeadingMarkdown) {
        title = trimmed.replace(/^#+\s*/, '');
      } else if (isBoldHeader) {
        title = trimmed.replace(/^\*\*|\*\*:?$/g, '');
      }
      sections.push({
        type: 'subtitle',
        title: title
      });
      continue;
    }

    // 3. Check if line is a Numbered List item
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'numbered') {
        flushList();
        currentList = { type: 'numbered', items: [] };
      }

      const itemContent = numMatch[2];
      // Check for distance metric like "(Distance: 1.2 km)" or "(المسافة: 1.2 كم)"
      const distMatch = itemContent.match(/^(.*?)\s*\((Distance|المسافة):\s*([0-9.]+\s*(?:km|كم|m|م))\)$/i);
      if (distMatch) {
        currentList.items.push({
          num: numMatch[1],
          name: distMatch[1].trim(),
          distance: distMatch[3].trim()
        });
      } else {
        currentList.items.push({
          num: numMatch[1],
          text: itemContent
        });
      }
      continue;
    }

    // 4. Check if line is a Bullet item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      const content = bulletMatch[1];
      // Check if bullet has Key: Value structure e.g. "• Education: 23 schools..."
      const kvInBullet = content.match(/^([^:\n]+):\s*(.+)$/);
      if (kvInBullet) {
        if (!currentList || currentList.type !== 'kv') {
          flushList();
          currentList = { type: 'kv', items: [] };
        }
        currentList.items.push({
          key: kvInBullet[1].trim(),
          value: kvInBullet[2].trim()
        });
      } else {
        if (!currentList || currentList.type !== 'bullet') {
          flushList();
          currentList = { type: 'bullet', items: [] };
        }
        currentList.items.push({
          text: content
        });
      }
      continue;
    }

    // 5. Check if line is an Indented Key-Value item (e.g. "  Choueifat International School: 350 m...")
    const indentedKv = rawLine.match(/^(\s{2,})([^:\n]+):\s*(.+)$/);
    if (indentedKv) {
      flushParagraph();
      if (!currentList || currentList.type !== 'kv') {
        flushList();
        currentList = { type: 'kv', items: [] };
      }
      currentList.items.push({
        key: indentedKv[2].trim(),
        value: indentedKv[3].trim()
      });
      continue;
    }

    // 6. Otherwise standard paragraph line
    flushList();
    if (!currentParagraph) {
      currentParagraph = { type: 'paragraph', lines: [] };
    }
    currentParagraph.lines.push(trimmed);
  }

  flushList();
  flushParagraph();
  return sections;
}

testCases.forEach((tc) => {
  console.log(`\n================== ${tc.name} ==================`);
  console.log(JSON.stringify(parseMessageToSections(tc.text), null, 2));
});
