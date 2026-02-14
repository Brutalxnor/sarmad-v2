import React, { useState, useEffect } from 'react';
import WebinarHero from './WebinarHero';
import WebinarCard from './WebinarCard';
import WebinarsAPI from '../../Api/Webinars/Webinars.api';
import './Webinars.css';
import LoadingModal from '../shared/LoadingModal';

const WebinarsPage = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await WebinarsAPI.GetAllWebinars();
        if (response.status === 'success') {
          setWebinars(response.data);
        }
      } catch (error) {
        console.error("Error fetching webinars:", error);
        // Fallback to mock data if API fails or for initial development
        setWebinars([
          { id: 1, title: 'التعامل مع الأرق المزمن', speaker: 'د. فهد القحطاني', date_time: '2026-11-02T09:00:00' },
          { id: 2, title: 'التعامل مع الأرق المزمن', speaker: 'د. فهد القحطاني', date_time: '2026-11-02T09:00:00' },
          { id: 3, title: 'التعامل مع الأرق المزمن', speaker: 'د. فهد القحطاني', date_time: '2026-11-02T09:00:00' },
          { id: 4, title: 'إدارة التوتر لنوم أفضل', speaker: 'د. نورة القحطاني', date_time: '2025-01-10T00:00:00' },
          { id: 5, title: 'إدارة التوتر لنوم أفضل', speaker: 'د. نورة القحطاني', date_time: '2025-01-10T00:00:00' },
          { id: 6, title: 'إدارة التوتر لنوم أفضل', speaker: 'د. نورة القحطاني', date_time: '2025-01-10T00:00:00' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  const now = new Date();
  const upcomingWebinars = webinars.filter(w => new Date(w.date_time) >= now);
  const previousWebinars = webinars.filter(w => new Date(w.date_time) < now);

  if (loading) {
    return <LoadingModal isOpen={loading} />;
  }

  return (
    <div className="webinars-page">
      <div className="container">
        <WebinarHero />

        {/* Upcoming Webinars Section */}
        <section className="webinars-section">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            الندوات القادمة
          </h2>
          <div className="webinar-grid">
            {upcomingWebinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} type="upcoming" />
            ))}
          </div>
        </section>

        {/* Previous Webinars Section */}
        <section className="webinars-section">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            الندوات السابقة
          </h2>
          <div className="webinar-grid">
            {previousWebinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} type="previous" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WebinarsPage;
