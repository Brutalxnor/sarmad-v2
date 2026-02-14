import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleAPI from '../Api/Articles/article.api';
import ContentAPI from '../Api/Content/content.api';
import CourseAPI from '../Api/Courses/course.api';
import ArticleCard from './shared/ArticleCard';
import LoadingModal from './shared/LoadingModal';

import './EducationGrid.css';

const EducationGrid = ({ activeCategory, activeSegment }) => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsLoading(true);
                let data = [];

                // 1. Fetch based on category
                if (activeCategory === 'articles') {
                    const response = await ContentAPI.getArticles();
                    data = (response.data || []).map(item => ({ ...item, type: 'article' }));
                } else if (activeCategory === 'videos') {
                    const response = await ContentAPI.getVideos();
                    data = (response.data || []).map(item => ({ ...item, type: 'video' }));
                } else if (activeCategory === 'courses') {
                    const response = await CourseAPI.getAllCourses();
                    data = (response.data || []).map(course => ({
                        ...course,
                        thumbnail_image: course.thumbnail_url,
                        type: 'course'
                    }));
                } else if (activeCategory === 'all') {
                    const [articlesRes, videosRes, coursesRes] = await Promise.all([
                        ContentAPI.getArticles(),
                        ContentAPI.getVideos(),
                        CourseAPI.getAllCourses()
                    ]);

                    const articles = (articlesRes.data || []).map(item => ({ ...item, type: 'article' }));
                    const videos = (videosRes.data || []).map(item => ({ ...item, type: 'video' }));
                    const courses = (coursesRes.data || []).map(item => ({
                        ...item,
                        thumbnail_image: item.thumbnail_url,
                        type: 'course'
                    }));

                    data = [...articles, ...videos, ...courses].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else {
                    const response = await ArticleAPI.GetAllArticles();
                    const allData = response.data || [];
                    const singularType = activeCategory.endsWith('s') ? activeCategory.slice(0, -1) : activeCategory;
                    data = allData.filter(item => item.type === singularType);
                }

                // 2. Filter by segment if one is selected
                if (activeSegment && activeSegment !== 'all') {
                    data = data.filter(item => {
                        // Handle segment as array (based on database structure)
                        const segments = Array.isArray(item.segment) ? item.segment : [];

                        return (
                            segments.includes(activeSegment) ||
                            segments.includes('all') ||
                            item.target_audience === activeSegment ||
                            item.age_group === activeSegment ||
                            item.topic_id === activeSegment
                        );
                    });
                }

                setArticles(data);
            } catch (error) {
                console.error("Failed to fetch content:", error);
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [activeCategory, activeSegment]);



    const currentItems = articles.slice(0, 5);

    const navigate = useNavigate();

    const SeeMoreCard = (
        <div
            className="see-more-card service-card article-card vertical"
            onClick={() => navigate(`/education/see-more/${activeCategory}`)}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-text">
                <div className="see-more-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
                <div className="see-more-text">
                    استكشف المزيد من المواضيع المخصصة لبرنامجك
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingModal isOpen={true} message="جارٍ تحميل المحتوى..." />;
    }

    return (
        <div className="education-grid-wrapper" id="education-content">
            {articles.length > 0 ? (
                <ArticleCard
                    articles={currentItems}
                    layout="vertical"
                    appendCard={SeeMoreCard}
                />
            ) : (
                <div className="no-content-message">
                    <h3>لا يوجد محتوى متاح حالياً لهذا القسم</h3>
                    <p>يرجى اختيار قسم آخر أو العودة لاحقاً</p>
                </div>
            )}
        </div>
    );
};

export default EducationGrid;
