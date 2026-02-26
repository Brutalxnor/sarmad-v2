import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Assessment from './components/Assessment';
import Results from './components/Results';
import Services from './components/Services';
import EducationCenter from './components/EducationCenter';
import ArticleDetails from './components/ArticleDetails';
import VideoDetails from './components/VideoDetails';
import ContentArchive from './components/ContentArchive';
import CourseDetails from './components/CourseDetails';
import LessonDetails from './components/LessonDetails';
import Login from './components/auth/Login';
import Profile from './components/Profile';
import ProfileCompletion from './components/auth/ProfileCompletion';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import WebinarsPage from './components/Webinars/WebinarsPage';
import WebinarDetails from './components/Webinars/WebinarDetails';
import FAQPage from './components/FAQPage';
import WhatsAppButton from './components/shared/WhatsAppButton';
import LegalPage from './components/LegalPage';
import AboutEducation from './components/AboutEducation';

function App() {
  // Function to detect theme based on time of day
  const getThemeByTime = () => {
    const hour = new Date().getHours();
    // Light mode: 6 AM (6) to 6 PM (18)
    // Dark mode: 6 PM (18) to 6 AM (6)
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  };

  const [theme, setTheme] = useState(getThemeByTime());

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <div className="app">
        <div className="glow-bg"></div>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/services" element={<Services />} />
            <Route path="/checkout" element={<Checkout />} />



            <Route path="/education" element={<EducationCenter />} />
            <Route path="/about-education" element={<AboutEducation />} />
            <Route path="/education/article/:id" element={<ArticleDetails />} />
            <Route path="/education/video/:id" element={<VideoDetails />} />
            <Route path="/education/course/:id" element={<CourseDetails />} />
            <Route path="/education/lesson/:id" element={<LessonDetails />} />
            <Route path="/education/see-more/:category" element={<ContentArchive />} />
            <Route path="/webinars" element={<WebinarsPage />} />
            <Route path="/webinars/:id" element={<WebinarDetails />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/complete-profile" element={<ProfileCompletion />} />
            <Route path="/legal/:policyId" element={<LegalPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}

export default App;
