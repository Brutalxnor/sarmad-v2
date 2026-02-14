import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseAPI from '../Api/Courses/course.api';
import LoadingModal from './shared/LoadingModal';
import './ArticleDetails.css'; // Reusing existing styles

const LessonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await CourseAPI.getLessonById(id);
                // Adjust based on API structure - assuming response.data holds the lesson object
                if (response && response.data) {
                    setLesson(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch lesson details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (isLoading) return <LoadingModal isOpen={true} message="جارٍ تحميل الدرس..." />;

    if (!lesson) return <div className="no-results">لم يتم العثور على الدرس</div>;

    return (
        <div className="article-details-page">
            <div className="article-container">
                {/* Sidebar - could show course curriculum here later */}
                <aside className="article-sidebar">
                    <div className="sidebar-card cta-card">
                        <h3>هل أنت مستعد لتعلّم المزيد؟</h3>
                        <p>تصفح المزيد من الدورات والدروس في مركز التثقيف.</p>
                        <button className="sidebar-btn primary" onClick={() => navigate('/education')}>
                            تصفح الدورات
                        </button>
                    </div>
                </aside>

                <article className="article-content">
                    {/* Content Header */}
                    <header className="article-header">
                        <div className="article-meta">
                            <span className="article-category">درس</span>
                            <span className="article-date">
                                {lesson.duration_minutes ? `${lesson.duration_minutes} دقيقة` : ''}
                            </span>
                        </div>
                        <h1 className="article-title">{lesson.title}</h1>
                    </header>

                    {/* Content Body */}
                    <div className="article-body">
                        {lesson.content_type === 'video' ? (
                            <div className="video-player-container" style={{ position: 'relative', paddingTop: '56.25%', background: '#000', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
                                {lesson.content_url && lesson.content_url.includes('youtube') ? (
                                    <iframe
                                        src={lesson.content_url.replace('watch?v=', 'embed/')}
                                        title={lesson.title}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        controls
                                        src={lesson.content_url}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    >
                                        متصفحك لا يدعم تشغيل الفيديو.
                                    </video>
                                )}
                            </div>
                        ) : null}

                        {/* Text Content */}
                        {lesson.body && (
                            <div dangerouslySetInnerHTML={{ __html: lesson.body }} />
                        )}

                        {/* Fallback for text content if body is empty but it's a text lesson */}
                        {lesson.content_type === 'text' && !lesson.body && lesson.content_url && (
                            <div className="text-content">
                                <p>رابط المحتوى: <a href={lesson.content_url} target="_blank" rel="noopener noreferrer">{lesson.content_url}</a></p>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default LessonDetails;
