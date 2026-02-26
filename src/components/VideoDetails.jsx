import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContentAPI from '../Api/Content/content.api';
import CourseAPI from '../Api/Courses/course.api';
import './ArticleDetails.css'; // Reusing the same styles
import LoadingModal from './shared/LoadingModal';
import DOMPurify from 'isomorphic-dompurify';

const VideoDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isLesson = new URLSearchParams(location.search).get('type') === 'lesson';
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch video details
                let videoData;
                if (isLesson) {
                    videoData = await CourseAPI.getLessonById(id);
                } else {
                    videoData = await ContentAPI.getContentById(id);
                }
                console.log("Fetched Video Data:", videoData);

                // Unwrap the response (same logic as ArticleDetails)
                let dataToSet = videoData;
                if (videoData && videoData.data) {
                    dataToSet = videoData.data;
                }
                // Handle case where API returns an array
                if (Array.isArray(dataToSet) && dataToSet.length > 0) {
                    dataToSet = dataToSet[0];
                }

                console.log("Setting Video State:", dataToSet);
                setVideo(dataToSet);

                // Fetch related videos
                const allVideos = await ContentAPI.getVideos();

                // Calculate shared tags count and sort
                const currentTags = dataToSet.tags || [];
                // Filter out current video
                const otherVideos = (allVideos.data || []).filter(item => item.id !== id);

                const sortedVideos = otherVideos.map(item => {
                    const sharedCount = (item.tags || []).filter(tag => currentTags.includes(tag)).length;
                    return { ...item, sharedCount };
                }).sort((a, b) => b.sharedCount - a.sharedCount);

                setRelatedVideos(sortedVideos.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch video details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, isLesson]);

    if (isLoading) return <LoadingModal isOpen={true} message="جارٍ تحميل الفيديو..." />;
    if (!video) return <div className="error-state">الفيديو غير موجود</div>;

    // Determine the video's theme based on segment
    // Kids theme activates ONLY when segment array contains ONLY "children" and nothing else
    // Women's theme activates ONLY when segment array contains ONLY "women" and nothing else
    const videoSegments = Array.isArray(video.segment) ? video.segment : [];

    let dataSegment = 'default';
    if (videoSegments.length === 1) {
        if (videoSegments[0] === 'children' || videoSegments[0] === 'الأطفال' || videoSegments[0] === 'أطفال') {
            dataSegment = 'children';
        } else if (videoSegments[0] === 'women' || videoSegments[0] === 'النساء' || videoSegments[0] === 'نساء') {
            dataSegment = 'women';
        }
    }

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

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(video.media_url);

    return (
        <div className="article-details-page" data-segment={dataSegment}>
            <div className="article-container">

                {/* Main Content */}
                <article className="article-content">
                    <div className="video-player-container" style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title={video.title}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : video.media_url ? (
                            <video
                                controls
                                src={video.media_url}
                                poster={video.thumbnail_image}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            >
                                متصفحك لا يدعم تشغيل الفيديو.
                            </video>
                        ) : (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                لا يوجد رابط للفيديو
                            </div>
                        )}
                    </div>

                    {/* 1. Meta Section (Views & Duration) - First under video */}
                    <div className="article-meta-bar" style={{ display: 'flex', gap: '1.5rem', color: '#666', marginBottom: '1rem', fontSize: '0.9rem', padding: '0 2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            {video.views || 0} مشاهدة
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            {video.duration || 'غير محدد'}
                        </span>
                    </div>

                    {/* 2. Title and Brief */}
                    <div className="video-header" style={{ marginBottom: '1rem', padding: '0 2rem' }}>
                        <h1 className="article-title" style={{ marginBottom: '0.5rem' }}>{video.title}</h1>
                        {video.brief && (
                            <div className="article-brief">
                                {video.brief}
                            </div>
                        )}
                    </div>

                    {/* 3. Tags */}
                    {video.tags && video.tags.length > 0 && (
                        <div className="article-tags" style={{ marginBottom: '1.5rem', padding: '0 2rem' }}>
                            {video.tags.map((tag, i) => (
                                <span key={i} className="article-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Description - Sanitized */}
                    <div className="article-body-wrapper">
                        <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(video.description) }}
                        />
                    </div>

                    <div className="disclaimer">
                        <p>إخلاء مسؤولية طبية: المعلومات الواردة في هذا الفيديو هي لأغراض تعليمية فقط ولا تغني عن الاستشارة الطبية المتخصصة.</p>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="article-sidebar">
                    {/* CTA Box - Matching ArticleDetails EXACTLY */}
                    <div className="sidebar-cta">
                        <h3 className="cta-title">اتخذ خطوة نحو نوم أفضل</h3>
                        <button className="cta-btn primary">
                            احجز استشارة طبية
                        </button>
                        <button className="cta-btn secondary">
                            انضم لبرنامج تحسين النوم
                        </button>
                    </div>

                    {/* Related Videos */}
                    <div className="related-articles">
                        <h3 className="cta-title">فيديوهات ذات صلة</h3>
                        {relatedVideos.map(item => (
                            <div key={item.id} className="related-item" onClick={() => navigate(`/education/video/${item.id}`)}>
                                <img src={item.thumbnail_image || item.thumbnail_url} alt={item.title} className="related-thumb" />
                                <div className="related-info">
                                    <h4>{item.title}</h4>
                                    <div className="related-meta">{item.duration || '10:00'} دقيقة</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default VideoDetails;
