import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContentAPI from '../Api/Content/content.api';
import CourseAPI from '../Api/Courses/course.api';
import './ArticleDetails.css';
import LoadingModal from './shared/LoadingModal';
import DOMPurify from 'isomorphic-dompurify';

const ArticleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isLesson = new URLSearchParams(location.search).get('type') === 'lesson';
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch article details
                let articleData;
                if (isLesson) {
                    articleData = await CourseAPI.getLessonById(id);
                } else {
                    articleData = await ContentAPI.getContentById(id);
                }
                console.log("Fetched Article Data:", articleData);

                // Check if data exists and set it specifically
                let dataToSet = articleData;
                if (articleData && articleData.data) {
                    dataToSet = articleData.data;
                }

                // Handle case where API returns an array (Supabase style sometimes)
                if (Array.isArray(dataToSet) && dataToSet.length > 0) {
                    dataToSet = dataToSet[0];
                }

                console.log("Setting Article State:", dataToSet);
                setArticle(dataToSet);

                // Fetch related articles (mock or API call)
                const recentArticles = await ContentAPI.getArticles();

                // Filter out current article
                const otherArticles = (recentArticles.data || []).filter(item => item.id !== id);

                // Calculate shared tags count and sort
                const currentTags = dataToSet.tags || [];
                const sortedArticles = otherArticles.map(item => {
                    const sharedCount = (item.tags || []).filter(tag => currentTags.includes(tag)).length;
                    return { ...item, sharedCount };
                }).sort((a, b) => b.sharedCount - a.sharedCount);

                // Take top 3
                setRelatedArticles(sortedArticles.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch article details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, isLesson]);

    if (isLoading) return <LoadingModal isOpen={true} message="جارٍ تحميل المقال..." />;
    if (!article) return <div className="error-state">المقال غير موجود</div>;

    // Determine the article's theme based on segment
    // Kids theme activates ONLY when segment array contains ONLY "children" and nothing else
    // Women's theme activates ONLY when segment array contains ONLY "women" and nothing else
    const articleSegments = Array.isArray(article.segment) ? article.segment : [];

    let dataSegment = 'default';
    if (articleSegments.length === 1) {
        if (articleSegments[0] === 'children' || articleSegments[0] === 'الأطفال' || articleSegments[0] === 'أطفال') {
            dataSegment = 'children';
        } else if (articleSegments[0] === 'women' || articleSegments[0] === 'النساء' || articleSegments[0] === 'نساء') {
            dataSegment = 'women';
        }
    }

    return (
        <div className="article-details-page" data-segment={dataSegment}>
            <div className="article-container">

                {/* Main Content */}
                <article className="article-content">

                    {/* Hero Section with Overlay */}
                    <div className="article-hero" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                        <img
                            src={article.thumbnail_image || article.thumbnail_url || "https://placehold.co/800x400?text=No+Image"}
                            alt={article.title}
                            style={{ width: '100%', display: 'block' }}
                        />
                        <div className="hero-overlay" style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            padding: '2rem 1.5rem',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end'
                        }}>
                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="article-tags" style={{ marginBottom: '0.5rem' }}>
                                    {article.tags.map((tag, i) => (
                                        <span key={i} className="article-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="article-title" style={{ color: 'white', marginBottom: 0 }}>{article.title}</h1>
                        </div>
                    </div>

                    {/* Meta Section Below Image */}
                    <div className="article-meta-bar" style={{ display: 'flex', gap: '1.5rem', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', padding: '0 2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            {article.views || 0} مشاهدة
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            {article.reading_time || article.duration || '5'} دقيقة
                        </span>
                    </div>

                    <div className="article-body-wrapper">
                        {/* Brief */}
                        {article.brief && (
                            <div
                                className="article-brief"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.brief) }}
                            />
                        )}

                        {/* Render HTML Content from description field - Sanitized */}
                        <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.description) }}
                        />
                    </div>

                    <div className="disclaimer">
                        <span>ℹ️</span>
                        <p>إخلاء مسؤولية طبية: المعلومات الواردة في هذا المقال هي لأغراض تعليمية فقط ولا تغني عن الاستشارة الطبية المتخصصة.</p>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="article-sidebar">
                    {/* CTA Box */}
                    <div className="sidebar-cta">
                        <h3 className="cta-title">اتخذ خطوة نحو نوم أفضل</h3>
                        <button className="cta-btn primary">
                            <span>📅</span> احجز استشارة طبية
                        </button>
                        <button className="cta-btn secondary">
                            <span>✓</span> انضم لبرنامج تحسين النوم
                        </button>
                    </div>

                    {/* Related Articles */}
                    <div className="related-articles">
                        <h3 className="cta-title">مقالات ذات صلة</h3>
                        {relatedArticles.map(item => (
                            <div key={item.id} className="related-item" onClick={() => navigate(`/education/article/${item.id}`)}>
                                <img src={item.thumbnail_image} alt={item.title} className="related-thumb" />
                                <div className="related-info">
                                    <h4>{item.title}</h4>
                                    <div className="related-meta">{item.reading_time || '5'} دقيقة</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ArticleDetails;
