import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import SideNav from '../sidenav/SideNav';
import { useState, useEffect } from 'react';

export const Container = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderPage = () => {
    return <Outlet />;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <SideNav
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Header onMobileMenuToggle={handleMobileMenuToggle} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-5">{renderPage()}</main>
        </div>
      </div>
    </div>
  );
};
