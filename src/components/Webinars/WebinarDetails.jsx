import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebinarsAPI from '../../Api/Webinars/Webinars.api';
import ProfilesAPI from '../../Api/Profiles/profiles.api';
import LoadingModal from '../shared/LoadingModal';
import SpeakerCard from '../shared/SpeakerCard';
import WebinarRegistrationModal from './WebinarRegistrationModal';
import './WebinarDetails.css';

const WebinarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);
  const [speakerData, setSpeakerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Default placeholder for missing images (WhatsApp style generic user)
  const defaultProfileImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      try {
        const response = await WebinarsAPI.GetWebinarById(id);
        if (response.status === 'success') {
          const webinarData = response.data;
          setWebinar(webinarData);

          // Check if speaker_id exists and fetch profile
          if (webinarData.speaker_id) {
            try {
              const profileResponse = await ProfilesAPI.getProfile(webinarData.speaker_id);
              if (profileResponse.status === 'success' || profileResponse.data) {
                setSpeakerData(profileResponse.data || profileResponse);
              }
            } catch (profileError) {
              console.error("Error fetching speaker profile:", profileError);
              // Fallback to webinar.speaker if profile fetch fails is handled in render
            }
          }
        }
      } catch (error) {
        console.error("Error fetching webinar details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinarDetails();
  }, [id]);

  const cleanDescription = (html) => {
    if (!html) return '';

    // Normalize space-like characters for easier regex matching
    let cleaned = html.replace(/&nbsp;|\u00A0/g, ' ');

    // Remove the admin note about HTML editor (more robust pattern)
    // Matches the paragraph containing "ملاحظة: ... بطاقة الويبنار" or "بشكل جميل"
    const adminNotePattern = /<p[^>]*><strong>ملاحظة:<\/strong>.*?(بطاقة الويبنار|بشكل جميل).*?<\/p>/g;
    cleaned = cleaned.replace(adminNotePattern, '');

    // Fix typo: "لجميع" -> "للجميع"
    cleaned = cleaned.replace(/لضمان أقصى استفادة لجميع/g, 'لضمان أقصى استفادة للجميع');

    return cleaned.trim();
  };

  if (loading) {
    return <LoadingModal isOpen={loading} />;
  }

  if (!webinar) {
    return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>لم يتم العثور على الندوة.</div>;
  }

  const dateObj = new Date(webinar.date_time);
  const formattedDate = dateObj.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  // Determine speaker details to display
  // Priority: Fetched Profile -> Webinar Specific Instructor Info -> Fallback Defaults
  const speakerName = speakerData?.name || webinar.speaker || webinar.instructor?.name || 'د. أحمد سالم';
  const speakerSpecialization = speakerData?.specialization || webinar.instructor?.specialization || 'خبير ومحاضر';
  const speakerEmail = speakerData?.email || 'خبير متخصص في الدورة.';
  const speakerImage = speakerData?.profile_picture || speakerData?.avatar_url || webinar.instructor?.image || defaultProfileImage;
  const speakerbio = speakerData?.bio || webinar.instructor?.bio;

  return (
    <div className="webinar-details-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          العودة للندوات
        </button>

        {/* Hero Section */}
        <section className="details-hero">
          <div className="hero-image-container">
            <img src={webinar.thumbnail_image || webinar.image} alt={webinar.title} className="hero-main-img" />
            <div className="hero-overlay">
              <div className="hero-meta-top">
                <span className="live-tag">ندوة مباشرة</span>
              </div>
              <h1>ندوة: {webinar.title}</h1>
              <div className="hero-meta-bottom">
                <div className="meta-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{formattedDate}</span>
                </div>
                <div className="meta-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{formattedTime} </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="details-grid">
          {/* Main Content (Right) */}
          <div className="details-main">
            <section className="content-section">
              <h2 className="section-title-alt">عن هذه الندوة</h2>
              <div
                className="description-text webinar-html"
                dangerouslySetInnerHTML={{ __html: cleanDescription(webinar.description) }}
              />

            </section>

            <section className="content-section">
              <h2 className="section-title-alt">مين يقدر يستفيد ويحضر؟</h2>
              <div className="audience-grid">
                {webinar.audience?.map((item, index) => (
                  <div className="audience-item" key={index}>
                    <div className="audience-icon">
                      {index % 2 === 0 ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      )}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Left) */}
          <aside className="details-sidebar">
            <SpeakerCard
              name={speakerName}
              specialization={speakerSpecialization}
              subText={speakerEmail}
              badgeText={speakerbio}
              image={speakerImage}
              bio={speakerbio}
            />

            <div className="sticky-card">
              <div className="price-badge">
                <span className="label">رسوم التسجيل</span>
                <div className="price-info">
                  <span className="current-price">{webinar.price}</span>
                  <span className="old-price">{webinar.originalPrice}</span>
                </div>
              </div>

              <button
                className="btn-primary-large"
                onClick={() => setIsRegistrationOpen(true)}
              >
                سجل الآن مجاناً
              </button>

              {/* <div className="features-list">
                <div className="feature-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span>لغة الندوة: {webinar.language}</span>
                </div>
                <div className="feature-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>{webinar.certificate}</span>
                </div>
                <div className="feature-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>{webinar.type}</span>
                </div>
              </div> */}

              <div className="inquiry-card">
                <h4>هل لديك استفسار؟</h4>
                <p>Support@Saudisleep.com</p>
                <div className="mail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <WebinarRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        webinar={webinar}
      />
    </div>
  );
};

export default WebinarDetails;
