import React from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { AppHeader } from './components/layout/AppHeader';
import { LandingPage } from './components/pages/LandingPage';
import { LandingPage2 } from './components/pages/LandingPage2';
import { LandingPage3 } from './components/pages/LandingPage3';
import { LandingPage4 } from './components/pages/LandingPage4';
import { MapWorkspace } from './components/map/MapWorkspace';
import { CategoryExplorer } from './components/categories/CategoryExplorer';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { HelpPage } from './components/pages/HelpPage';
import { FavoritesPage } from './components/pages/FavoritesPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AuthModal } from './components/auth/AuthModal';
import { GuestPromptModal } from './components/auth/GuestPromptModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { Toast } from './components/common/Toast';
import { LocationPermissionPopup } from './components/common/LocationPermissionPopup';
import { SearchResultDetailsModal } from './components/common/SearchResultDetailsModal';

const MainAppShell: React.FC = () => {
  const { currentView, pureMapMode } = useAppState();
  const isPureMap = currentView === 'map' && pureMapMode;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {!isPureMap && <AppHeader />}
      <main className={isPureMap || currentView === 'home' || currentView === 'home2' || currentView === 'home3' || currentView === 'home4' ? 'w-full h-screen overflow-hidden' : 'w-full min-h-[calc(100vh-4rem)]'}>
        {currentView === 'home' && <LandingPage />}
        {currentView === 'home2' && <LandingPage2 />}
        {currentView === 'home3' && <LandingPage3 />}
        {currentView === 'home4' && <LandingPage4 />}
        {currentView === 'map' && <MapWorkspace />}
        {currentView === 'categories' && <CategoryExplorer />}
        {currentView === 'about' && <AboutUsPage />}
        {currentView === 'help' && <HelpPage />}
        {currentView === 'favorites' && <FavoritesPage />}
        {currentView === 'history' && <HistoryPage />}
        {currentView === 'profile' && <ProfilePage />}
      </main>
      <AuthModal />
      <GuestPromptModal />
      <FeedbackModal />
      <Toast />
      <LocationPermissionPopup />
      <SearchResultDetailsModal />
    </div>
  );
};

export function App() {
  return (
    <AppStateProvider>
      <MainAppShell />
    </AppStateProvider>
  );
}

export default App;
