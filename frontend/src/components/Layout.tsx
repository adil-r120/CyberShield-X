import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  return (
    <div className={`h-screen w-screen flex overflow-hidden transition-colors duration-200 ${darkMode ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
      {/* Sidebar - Fixed vertical anchor */}
      <Sidebar darkMode={darkMode} />

      {/* Main Content Hub */}
      <div className={`flex-1 h-full flex flex-col overflow-hidden transition-colors duration-200 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Adjusted padding: Reduced horizontal and vertical spacing for better data density */}
        <main className="flex-1 px-6 lg:px-10 pt-4 pb-10 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1800px] mx-auto w-full animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
