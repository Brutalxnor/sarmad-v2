import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebinarCard = ({ webinar, type }) => {
  const navigate = useNavigate();
  const isPrevious = type === 'previous';
  
  const handleNavigate = () => {
    navigate(`/webinars/${webinar.id}`);
  };

  return (
    <div className="webinar-card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={webinar.thumbnail_image || webinar.image || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800'} alt={webinar.title} />
        {isPrevious && (
          <div className="play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <div className="badge-tag">
          {isPrevious ? 'مسجل' : (webinar.tag || 'قريباً')}
        </div>
      </div>
      
      <div className="card-content">
        <h3>{webinar.title}</h3>
        
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>{webinar.speaker || 'د. فهد القحطاني'}</span>
        </div>
        
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>{webinar.date_time || '2 نوفمبر 2026 - 9:00 صباحاً'}</span>
        </div>
        
        {isPrevious && (
          <div className="info-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>45 دقيقة | 185 مشاهدة</span>
          </div>
        )}
        
        <div className="card-actions">
          <button className={`btn-card-action ${isPrevious ? 'btn-previous' : 'btn-upcoming'}`}>
            {isPrevious ? 'احجز مقعدك الآن' : 'احجز مقعدك الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarCard;
