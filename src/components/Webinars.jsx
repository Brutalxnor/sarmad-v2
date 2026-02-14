import React from 'react';
import { useNavigate } from 'react-router-dom';
import elipse from '../assets/Ellipse 3.svg';
import elipse2 from '../assets/Ellipse 2.svg';

const Webinars = () => {
  const navigate = useNavigate();
  const sessions = [
    {
      title: 'أسرار النوم ومشاكله الأكثر شيوعاً',
      expert: 'د. أحمد سالم',
      role: 'أخصائي طب النوم - 12 سنة خبرة',
      date: 'قريباً - 15-2-2026 8:00 مساءً',
      participants: '345 مسجل',
      duration: '60 دقيقة',
      image: elipse2,
      isLive: true
    },
    {
      title: 'علاج الأرق بدون أدوية',
      expert: 'د. فاطمة أمين',
      role: 'أخصائية طب النوم - 12 سنة خبرة',
      date: '20-2-2026 8:00 مساءً',
      participants: '345 مسجل',
      duration: '60 دقيقة',
      image: elipse
    },
    {
      title: 'علاج الأرق بدون أدوية',
      expert: 'د. فاطمة أمين',
      role: 'أخصائية طب النوم - 12 سنة خبرة',
      date: '20-2-2026 8:00 مساءً',
      participants: '345 مسجل',
      duration: '60 دقيقة',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="webinars" id="webinars">
      <div className="container">
        <div className="section-head-webinar">
          <h2>تعلم من الخبراء مباشرة</h2>
          <p>خذ نصايح موثوقة من خبراء نوم معتمدين على طول، من خلال ويبينارات تفاعلية. كل شي مصمّم عشان<br /> يحوّل المعلومات العلمية لخطوات سهلة توّرك فرق حقيقي في نومك.</p>
        </div>

        <div className="webinar-layout">
          <div className="main-webinar">
            <div className="webinar-card featured">
              <div className="webinar-visual">
                <img src={sessions[0].image} alt={sessions[0].expert} />
                <div className="live-pill">LIVE</div>
              </div>
              <div className="webinar-info">
                <h3>{sessions[0].title}</h3>
                <div className="expert-info">
                  <span className="name">{sessions[0].expert}</span>
                  <p className="role">{sessions[0].role}</p>
                </div>
                <div className="webinar-meta">
                  <div className="date-badge">🗓️ {sessions[0].date}</div>
                  <span>⏱️ {sessions[0].duration}</span>
                  <span>👥 {sessions[0].participants}</span>
                </div>
                <button className="btn-register" onClick={() => navigate('/webinars')}>سجل الآن <span>←</span></button>
              </div>
            </div>
          </div>

          <div className="side-webinars">
            {sessions.slice(1).map((session, idx) => (
              <div className="webinar-card small" key={idx}>
                <div className="side-visual">
                  <img src={session.image} alt={session.expert} />
                </div>
                <div className="side-info">
                  <h4>{session.title}</h4>
                  <div className="side-expert">
                    <p>{session.expert}</p>
                    <p className="role-small">{session.role}</p>
                  </div>
                  <div className="mini-meta">
                    <div className="mini-date">{session.date}</div>
                    <span>⏱️ {session.duration}</span>
                    <span>👥 {session.participants}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Webinars;
