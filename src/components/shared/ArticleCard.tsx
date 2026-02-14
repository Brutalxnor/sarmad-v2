import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import ArticleAPI from '../../Api/Articles/article.api';
import SavedCoursesAPI from '../../Api/Courses/savedCourses.api';
import ProfilesAPI from '../../Api/Profiles/profiles.api';
import ShareModal from './ShareModal';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const AuthorInfo = ({ authorId }: { authorId: string }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authorId) {
        setLoading(false);
        return;
      }
      try {
        const response = await ProfilesAPI.getProfile(authorId);
        // The API returns { status: "success", data: { ... } }
        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch author:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authorId]);

  if (loading) return <div className="author-info-loading">...</div>;
  if (!profile) return null;

  return (
    <div className="article-author" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <img
        src={profile.profile_picture || "https://placehold.co/40x40?text=User"}
        alt={profile.name || "Author"}
        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#555' }}>
        {profile.name || "Unknown Author"}
      </span>
    </div>
  );
};

const ArticleCard = ({ articles, layout = 'vertical', appendCard }: { articles: any[], layout?: 'vertical' | 'horizontal', appendCard?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  // Custom Share Modal State
  const [shareData, setShareData] = useState<{ isOpen: boolean; title: string; url: string; text: string }>({
    isOpen: false,
    title: '',
    url: '',
    text: ''
  });

  // Helper to get first two tags
  const getTags = (tags: string[] | string) => {
    if (Array.isArray(tags)) {
      return tags.slice(0, 2);
    }
    return [];
  };

  // Check saved status for all articles when component mounts
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const savedChecks = await Promise.all(
          articles.map(async (article) => {
            try {
              let result;
              if (article.type === 'course') {
                result = await SavedCoursesAPI.checkIfCourseSaved(article.id, session.access_token);
              } else {
                result = await ArticleAPI.CheckIfSaved(article.id, session.access_token);
              }
              return { id: article.id, isSaved: result.data?.is_saved || false };
            } catch (error) {
              console.error(`Error checking saved status for item ${article.id}:`, error);
              return { id: article.id, isSaved: false };
            }
          })
        );

        const newSavedStates: { [key: string]: boolean } = {};
        savedChecks.forEach(({ id, isSaved }) => {
          newSavedStates[id] = isSaved;
        });
        setSavedStates(newSavedStates);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkSavedStatus();
  }, [articles, user]);

  const handleSaveClick = async (article: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking save
    requireAuth(async () => {
      const articleId = article.id;
      try {
        setLoadingStates(prev => ({ ...prev, [articleId]: true }));

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          alert('يرجى تسجيل الدخول أولاً');
          return;
        }

        const isSaved = savedStates[articleId];

        if (isSaved) {
          // Unsave the article/course
          let result;
          if (article.type === 'course') {
            result = await SavedCoursesAPI.unsaveCourse(articleId, session.access_token);
          } else {
            result = await ArticleAPI.UnsaveContent(articleId, session.access_token);
          }

          if (result.status === 'success') {
            setSavedStates(prev => ({ ...prev, [articleId]: false }));
            console.log('تم إلغاء الحفظ بنجاح');
          }
        } else {
          // Save the article/course
          let result;
          if (article.type === 'course') {
            result = await SavedCoursesAPI.saveCourse(articleId, session.access_token);
          } else {
            result = await ArticleAPI.SaveContent(articleId, session.access_token);
          }

          if (result.status === 'success') {
            setSavedStates(prev => ({ ...prev, [articleId]: true }));
            console.log('تم الحفظ بنجاح');
          }
        }
      } catch (error: any) {
        console.error('Error saving/unsaving item:', error);
        alert(error.message || 'حدث خطأ أثناء الحفظ');
      } finally {
        setLoadingStates(prev => ({ ...prev, [articleId]: false }));
      }
    });
  };

  const handleShareClick = (article: any, event: React.MouseEvent) => {
    event.stopPropagation();

    const typeLabels: { [key: string]: string } = {
      article: 'مقال',
      video: 'فيديو',
      course: 'دورة'
    };

    const typeLabel = typeLabels[article.type] || 'محتوى';
    const shareTitle = `${typeLabel}: ${article.title}`;

    const cleanDesc = (article.brief || article.description || '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .substring(0, 100);

    const typePath = article.type === 'video' ? 'video' : article.type === 'course' ? 'course' : 'article';
    const shareUrl = `${window.location.origin}/education/${typePath}/${article.id}`;

    const shareText = `تعرف على ${article.title} من خلال منصة سرمد\n\n${cleanDesc}${cleanDesc ? '...' : ''}`;

    setShareData({
      isOpen: true,
      title: shareTitle,
      url: shareUrl,
      text: shareText
    });
  };

  return (
    <>
      <div className={`articles-grid ${layout}-layout`}>
        {articles.map((article, idx) => (
          <motion.div
            className={`service-card article-card ${layout}`}
            key={article.id || idx}
            variants={fadeInUp as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.02 }}
            transition={{
              duration: 0.5,
              delay: (idx % 3) * 0.1 // Stagger effects for items in the same row
            }}
            onClick={() => {
              if (article.type === 'video') {
                navigate(`/education/video/${article.id}`);
              } else if (article.type === 'course') {
                navigate(`/education/course/${article.id}`);
              } else {
                navigate(`/education/article/${article.id}`);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-icon">
              <img
                src={article.thumbnail_image || article.thumbnail_url || "https://placehold.co/600x400?text=No+Image"}
                alt={article.title}
                className="service-img"
              />
            </div>

            <div className="card-text" style={{ paddingTop: '1rem' }}>
              {/* Type Badge & Tags Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div className="card-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: article.type === 'video' ? 'rgba(239, 68, 68, 0.1)' : article.type === 'course' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: article.type === 'video' ? '#ef4444' : article.type === 'course' ? '#3b82f6' : '#10b981',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {article.type === 'video' ? 'فيديو' : article.type === 'course' ? 'دورة' : 'مقال'}
                  </span>
                  {article.tags && article.tags.length > 0 && getTags(article.tags).map((tag: string, i: number) => (
                    <span key={i} style={{
                      background: 'rgba(53, 120, 141, 0.1)',
                      color: '#35788d',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h3 style={{ marginBottom: '4px' }}>{article.title}</h3>

              {/* Brief */}
              <p className="article-brief" style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.4', marginBottom: '8px' }}>
                {(() => {
                  const rawText = article.brief || article.description || '';
                  // Simple HTML stripping and entity decoding
                  return rawText
                    .replace(/<[^>]*>?/gm, '') // Strip tags
                    .replace(/&nbsp;/g, ' ')   // Handle nbsp
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"');
                })()}
              </p>

              {/* Author Info - Moved above metrics */}
              {article.author_id && <AuthorInfo authorId={article.author_id} />}

              {/* Metrics Row */}
              <div className="article-metrics" style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* Watch/Clock Icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{(article.duration || article.reading_time) ? `${article.duration || article.reading_time} دقيقة` : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* Eye Icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{120}</span> {/* Static number for now as requested */}
                </div>
              </div>

              {/* Article Footer with Share and Save buttons */}
              <div className="article-footer">
                <button
                  className="share-btn"
                  onClick={(e) => handleShareClick(article, e)}
                >
                  🔗 مشاركة
                </button>
                <button
                  className={`save-btn ${savedStates[article.id] ? 'saved' : ''}`}
                  onClick={(e) => handleSaveClick(article, e)}
                  disabled={loadingStates[article.id]}
                >
                  {loadingStates[article.id]
                    ? '⏳ جاري...'
                    : savedStates[article.id]
                      ? '✅ محفوظ'
                      : '🔖 حفظ'
                  }
                </button>
              </div>

            </div>
          </motion.div>
        ))}
        {appendCard && (
          <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.02 }}
            transition={{
              duration: 0.5,
              delay: (articles.length % 3) * 0.1
            }}
          >
            {appendCard}
          </motion.div>
        )}
      </div>
      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData(prev => ({ ...prev, isOpen: false }))}
        title={shareData.title}
        url={shareData.url}
        shareText={shareData.text}
      />
    </>
  );
};

export default ArticleCard;