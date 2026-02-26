import React, { useEffect, useState } from 'react';
import TestimonialsAPI from '../Api/Testimonials/testimonials.api';

import case2 from '../assets/case2.jpg';
import case7 from '../assets/case7.jpg';
import case3 from '../assets/case3.webp';
import case8 from '../assets/case8.jpg';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);

  // Fallback static data if backend is empty
  const fallbackTestimonials = [
    {
      id: 'f1',
      name: 'محمد محمود',
      text: 'بعد سنوات من المعاناة مع الأرق، وجدت في SARMAD الحل المناسب. البرنامج العلاجي المخصص والمتابعة المستمرة ساعدوني على استعادة نومي الطبيعي. الآن أنام 7 ساعات متواصلة كل ليلة وأشعر بطاقة وحيوية لم أشعر بها منذ سنوات.',
      image: case2,
      video: null
    },
    {
      id: 'f2',
      name: 'سلمى أمين',
      text: 'تجربتي مع سرمد كانت نقطة تحول في حياتي. التقييم الدقيق ساعدني على فهم جذور مشكلة النوم عندي، والحلول كانت عملية جداً وتناسب يومي المزدحم. شكراً لفريق الخبراء على الدعم المستمر.',
      image: case7,
      video: null
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await TestimonialsAPI.getActiveTestimonials();

        if (response.status === 'success' && response.data && response.data.length > 0) {
          const mappedData = response.data.map(item => ({
            id: item.id,
            name: item.name_ar || item.name_en,
            text: item.content_ar || item.content_en,
            image: item.image_url || case2,
            video: item.video
          }));
          setTestimonials(mappedData);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Helper to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  if (isLoading) {
    return null;
  }

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-head">
          <h2>قصص نجاح حقيقية</h2>
          <p>آلاف المستفيدين حسّنوا نومهم معنا</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => {
            const embedUrl = getYouTubeEmbedUrl(t.video);

            return (
              <div className={`testimonial-card ${playingId === t.id ? 'is-playing' : ''}`} key={t.id}>
                <div className="card-image-container">
                  {playingId === t.id && t.video ? (
                    <div className="video-player-wrapper">
                      <button
                        className="inline-video-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingId(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>

                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          className="testimonial-video-inline"
                          style={{ width: '100%', height: '100%', border: 0 }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={t.video}
                          className="testimonial-video-inline"
                          autoPlay
                          controls
                          onEnded={() => setPlayingId(null)}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className={`card-image ${t.video ? 'has-video' : ''}`}
                      onClick={() => t.video && setPlayingId(t.id)}
                    >
                      <img src={t.image} alt={t.name} />
                      {t.video && (
                        <div className="play-overlay">
                          <div className="play-btn-pulse">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{t.name}</h3>
                  <p>{t.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
