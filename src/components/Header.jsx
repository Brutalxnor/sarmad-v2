import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuOpen && !event.target.closest('.desktop-burger-container')) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopMenuOpen]);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    navigate('/services');
  };

  const handleEducationClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    navigate('/education');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-text">سرمد</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          <ul className="nav-links">
            <li><NavLink to="/" end>الرئيسية</NavLink></li>
            <li><NavLink to="/education">مركز التثقيف</NavLink></li>
            <li className="nav-item-dropdown has-dropdown">
              <NavLink to="/services">الخدمات</NavLink>
              <ul className="services-dropdown">
                <li>
                  <button
                    className="dropdown-link"
                    onClick={() => navigate('/services', { state: { activeService: 'home-test' } })}
                  >
                    <span className="service-name">دراسة النوم المنزلية</span>
                    <span className="service-desc">تحليل شامل لنومك من منزلك</span>
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-link"
                    onClick={() => navigate('/services', { state: { activeService: 'expert' } })}
                  >
                    <span className="service-name">الاستشارات والتوجية</span>
                    <span className="service-desc">جلسات مع خبراء متخصصين</span>
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-link"
                    onClick={() => navigate('/services', { state: { activeService: 'program' } })}
                  >
                    <span className="service-name">البرامج التدريبية</span>
                    <span className="service-desc">برامج سلوكية مثبتة علمياً</span>
                  </button>
                </li>
              </ul>
            </li>
            <li><NavLink to="/webinars">الندوات</NavLink></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <>
                <div className="icon-box light-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="19.78"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>
                </div>
              </>
            ) : (
              <>
                <div className="icon-box dark-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </div>
              </>
            )}
          </button>

          {/* Desktop Burger Menu */}
          <div className="desktop-burger-container">
            <button
              className="desktop-burger-toggle"
              onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
              aria-label="Toggle Desktop Menu"
            >
              <div className={`burger-icon ${desktopMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            <div className={`desktop-dropdown ${desktopMenuOpen ? 'open' : ''}`}>
              <div className="desktop-dropdown-content">
                <button
                  className="btn-primary dropdown-cta"
                  onClick={() => {
                    setDesktopMenuOpen(false);
                    navigate('/assessment');
                  }}
                >
                  ابدأ بالتقييم المجاني
                </button>

                {user ? (
                  <>
                    <button
                      className="btn-primary-ghost dropdown-cta"
                      onClick={() => {
                        setDesktopMenuOpen(false);
                        navigate('/profile');
                      }}
                    >
                      الملف الشخصي
                    </button>
                    <button
                      className="btn-primary-ghost dropdown-cta"
                      onClick={() => {
                        setDesktopMenuOpen(false);
                        logout();
                      }}
                      style={{ marginTop: '10px' }}
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary-ghost dropdown-cta"
                    onClick={() => {
                      setDesktopMenuOpen(false);
                      navigate('/login');
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    تسجيل الدخول
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-links">
            <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>الرئيسية</a></li>
            <li><a href="/education" onClick={handleEducationClick}>مركز التثقيف</a></li>
            <li>
              <a href="/services" onClick={handleServicesClick}>الخدمات</a>
              <ul className="mobile-services-sub">
                <li><a href="/services" className="mobile-service-item" onClick={(e) => { e.preventDefault(); navigate('/services', { state: { activeService: 'home-test' } }); setMobileMenuOpen(false); }}>دراسة النوم المنزلية</a></li>
                <li><a href="/services" className="mobile-service-item" onClick={(e) => { e.preventDefault(); navigate('/services', { state: { activeService: 'expert' } }); setMobileMenuOpen(false); }}>الاستشارات والتوجية</a></li>
                <li><a href="/services" className="mobile-service-item" onClick={(e) => { e.preventDefault(); navigate('/services', { state: { activeService: 'program' } }); setMobileMenuOpen(false); }}>البرامج التدريبية</a></li>
              </ul>
            </li>
            <li><a href="/webinars" onClick={(e) => { e.preventDefault(); navigate('/webinars'); setMobileMenuOpen(false); }}>الندوات</a></li>
          </ul>
          <button
            className="btn-primary mobile-cta"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/assessment');
            }}
          >
            ابدأ بالتقييم المجاني
          </button>

          {user ? (
            <>
              <button
                className="btn-primary mobile-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profile');
                }}
                style={{ marginTop: '20px' }}
              >
                الملف الشخصي
              </button>
              <button
                className="btn-primary mobile-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{ marginTop: '10px', backgroundColor: 'var(--error-color, #ff4d4f)' }}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <button
              className="btn-primary mobile-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              style={{ marginTop: '10px' }}
            >
              تسجيل الدخول
            </button>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

    </header>
  );
};

export default Header;
