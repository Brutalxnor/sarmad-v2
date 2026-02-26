import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseAPI from '../Api/Courses/course.api';
import ProfilesAPI from '../Api/Profiles/profiles.api';
import LoadingModal from './shared/LoadingModal';
import SpeakerCard from './shared/SpeakerCard';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                const response = await CourseAPI.getCourseById(id);
                if (response && response.data) {
                    setCourse(response.data);
                    // Open first section by default
                    if (response.data.sections && response.data.sections.length > 0) {
                        setOpenSections({ [response.data.sections[0].id]: true });
                    }
                    // Fetch author profile using author_id
                    if (response.data.author_id) {
                        try {
                            const profileRes = await ProfilesAPI.getProfile(response.data.author_id);
                            console.log('Author Profile:', profileRes);
                            setAuthor(profileRes.data || profileRes);
                        } catch (err) {
                            console.error('Failed to fetch author profile:', err);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch course details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchCourse();
    }, [id]);

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    if (isLoading) return <LoadingModal isOpen={true} message="جارٍ تحميل تفاصيل الدورة..." />;

    if (!course) return <div className="no-results">لم يتم العثور على الدورة</div>;


    // Helper for youtube embed
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
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const isVideoPromo = course.promotional_video_url || (course.type === 'video' && course.media_url);
    const promoVideoUrl = course.promotional_video_url || course.media_url;
    const embedUrl = isVideoPromo ? getYouTubeEmbedUrl(promoVideoUrl) : null;


    return (
        <div className="course-details-page">
            {/* Hero Section */}
            <div className={`course-hero ${isVideoPromo ? 'has-video' : ''}`}>
                {isVideoPromo ? (
                    <div className="course-hero-video-container">
                        {embedUrl ? (
                            <iframe
                                className="course-hero-bg-video"
                                src={embedUrl}
                                title={course.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                className="course-hero-bg-video"
                                controls
                                src={promoVideoUrl}
                                poster={course.thumbnail_url || course.thumbnail_image}
                            >
                                متصفحك لا يدعم تشغيل الفيديو.
                            </video>
                        )}
                    </div>
                ) : (
                    course.thumbnail_url && (
                        <img src={course.thumbnail_url || course.thumbnail_image} alt={course.title} className="course-hero-bg" />
                    )
                )}
                {!isVideoPromo && <div className="course-hero-overlay"></div>}

                {!isVideoPromo && (
                    <div className="course-hero-content">
                        {course.category && (
                            <div className="course-badge">{course.category}</div>
                        )}
                        <h1 className="course-title">{course.title}</h1>
                        <p className="course-description-short">
                            {course.description ?
                                course.description
                                    .replace(/<[^>]*>?/gm, '')
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/&amp;/g, '&')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&quot;/g, '"')
                                    .substring(0, 150) + '...'
                                : ''
                            }
                        </p>

                        <button className="course-cta-btn">
                            ابدأ التعلم الآن
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Bar */}
            <div className="course-stats-bar">
                <div className="stat-item">
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                    <div className="stat-info">
                        <h4>التقييم العام</h4>
                        <p>{course.rate || '0'}</p>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div className="stat-info">
                        <h4>عدد الطلاب</h4>
                        <p>+{course.register || 0}</p>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className="stat-info">
                        <h4>مدة الدورة</h4>
                        <p>{course.duration || '0'} ساعة</p>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-icon" style={course.certificate ? { color: '#22c55e', background: 'transparent' } : { color: '#999', background: 'transparent' }}>
                        {course.certificate ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        )}
                    </div>
                    <div className="stat-info">
                        <h4>الشهادة</h4>
                        <p>{course.certificate ? 'متوفر' : 'غير متوفر'}</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="course-content-grid">
                {/* Main Content */}
                <div className="course-main">

                    {/* Curriculum */}
                    <div className="curriculum-container">
                        <div className="section-head">
                            <h2 className="section-title">المنهج الدراسي</h2>
                        </div>

                        {course.sections && course.sections.length > 0 ? (
                            course.sections.map((section, index) => (
                                <div key={section.id} className="curriculum-section">
                                    <div
                                        className="section-header"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <div className="section-number">{index + 1}</div>
                                            <div>
                                                <span>{section.title}</span>
                                                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>
                                                    {section.lessons ? section.lessons.length : 0} دروس، {section.lessons ? section.lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0) : 0} دقيقة
                                                </div>
                                            </div>
                                        </div>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ transform: openSections[section.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>

                                    {openSections[section.id] && (
                                        <div className="lesson-list">
                                            {section.lessons && section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="lesson-item"
                                                    onClick={() => {
                                                        if (lesson.content_type === 'video') {
                                                            navigate(`/education/video/${lesson.id}?type=lesson`);
                                                        } else {
                                                            navigate(`/education/article/${lesson.id}?type=lesson`);
                                                        }
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="lesson-info">
                                                        <div className="lesson-icon">
                                                            {lesson.content_type === 'video' ? (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                            )}
                                                        </div>
                                                        <span className="lesson-title">{lesson.title}</span>
                                                    </div>
                                                    <div className="lesson-meta">
                                                        <span>{lesson.duration_minutes || 0} دقيقة</span>
                                                        {lesson.is_preview ? (
                                                            <span style={{ color: '#00b4d8', fontSize: '0.8rem', border: '1px solid #00b4d8', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>مجاني</span>
                                                        ) : (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>لا يوجد محتوى متاح حالياً</div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="course-sidebar">
                    <SpeakerCard
                        name={author?.full_name || author?.name || course.instructor_name || 'غير محدد'}
                        specialization={author?.role || author?.specialty || 'مدرب'}
                        image={author?.profile_picture || author?.avatar_url || course.instructor_image}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
