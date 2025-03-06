
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is logged in - temporary mock
  const isLoggedIn = localStorage.getItem('user') !== null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <BlurContainer
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 px-4 md:px-8',
        scrolled ? 'shadow-md' : ''
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-semibold text-interview-blue-dark hover:text-interview-blue transition-colors flex items-center gap-2"
          >
            <span className="text-2xl">MockMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={cn(
              "text-sm font-medium transition-colors hover:text-interview-blue",
              location.pathname === '/' ? 'text-interview-blue' : 'text-slate-600'
            )}>
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={cn(
                  "text-sm font-medium transition-colors hover:text-interview-blue",
                  location.pathname.startsWith('/dashboard') ? 'text-interview-blue' : 'text-slate-600'
                )}>
                  Dashboard
                </Link>
                <Link to="/interviews" className={cn(
                  "text-sm font-medium transition-colors hover:text-interview-blue",
                  location.pathname.startsWith('/interviews') ? 'text-interview-blue' : 'text-slate-600'
                )}>
                  Interviews
                </Link>
                <Button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  variant="ghost" 
                  className="text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?type=login">
                  <Button variant="ghost" className="text-sm font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?type=register">
                  <Button className="text-sm font-medium bg-interview-blue hover:bg-interview-blue-dark">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className={cn(
                "px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === '/' ? 'bg-interview-blue-light text-interview-blue' : 'text-slate-600'
              )}>
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors",
                    location.pathname.startsWith('/dashboard') ? 'bg-interview-blue-light text-interview-blue' : 'text-slate-600'
                  )}>
                    Dashboard
                  </Link>
                  <Link to="/interviews" className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors",
                    location.pathname.startsWith('/interviews') ? 'bg-interview-blue-light text-interview-blue' : 'text-slate-600'
                  )}>
                    Interviews
                  </Link>
                  <Button 
                    onClick={() => {
                      localStorage.removeItem('user');
                      window.location.href = '/';
                    }}
                    variant="ghost" 
                    className="justify-start px-3 py-2 h-auto font-medium"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?type=login" className="w-full">
                    <Button variant="ghost" className="w-full justify-start px-3 py-2 h-auto font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth?type=register" className="w-full">
                    <Button className="w-full justify-start px-3 py-2 h-auto font-medium bg-interview-blue hover:bg-interview-blue-dark">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </BlurContainer>
  );
};

// Helper function
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export default Navbar;
