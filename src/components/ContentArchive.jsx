import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentAPI from '../Api/Content/content.api';
import CourseAPI from '../Api/Courses/course.api';
import TopicsAPI from '../Api/Topics/topics.api';
import ArticleCard from './shared/ArticleCard';
import LoadingModal from './shared/LoadingModal';
import './ContentArchive.css';

const ITEMS_PER_PAGE = 9;

const ContentArchive = () => {
    const { category } = useParams(); // 'articles', 'videos', 'courses', 'all'
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]); // All fetched items (for client-side filtering)
    const [filteredItems, setFilteredItems] = useState([]); // Items after topic filtering
    const [displayedItems, setDisplayedItems] = useState([]); // Items for current page

    const [topics, setTopics] = useState([]);
    const [activeTopic, setActiveTopic] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                let data = [];
                let pageTitle = 'الأرشيف';

                // Fetch Content based on category
                if (category === 'articles') {
                    pageTitle = 'المقالات';
                    const response = await ContentAPI.getArticles();
                    data = (response.data || []).map(i => ({ ...i, type: 'article' }));
                } else if (category === 'videos') {
                    pageTitle = 'الفيديوهات';
                    const response = await ContentAPI.getVideos();
                    data = (response.data || []).map(i => ({ ...i, type: 'video' }));
                } else if (category === 'courses') {
                    pageTitle = 'الدورات التدريبية';
                    const response = await CourseAPI.getAllCourses();
                    data = (response.data || []).map(i => ({
                        ...i,
                        type: 'course',
                        thumbnail_image: i.thumbnail_url
                    }));
                } else if (category === 'all') {
                    pageTitle = 'كل المحتوى';
                    const [articlesRes, videosRes, coursesRes] = await Promise.all([
                        ContentAPI.getArticles(),
                        ContentAPI.getVideos(),
                        CourseAPI.getAllCourses()
                    ]);
                    const articles = (articlesRes.data || []).map(i => ({ ...i, type: 'article' }));
                    const videos = (videosRes.data || []).map(i => ({ ...i, type: 'video' }));
                    const courses = (coursesRes.data || []).map(i => ({
                        ...i,
                        type: 'course',
                        thumbnail_image: i.thumbnail_url
                    }));
                    data = [...articles, ...videos, ...courses];
                }

                // Sort by date desc
                data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setTitle(pageTitle);
                setItems(data);
                setFilteredItems(data); // Initially no filter

                // Fetch Topics
                const topicsRes = await TopicsAPI.getActiveTopics();
                setTopics(topicsRes.data || []);

            } catch (error) {
                console.error("Failed to load archive data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [category]);

    // Handle Filtering
    useEffect(() => {
        if (activeTopic === 'all') {
            setFilteredItems(items);
        } else {
            // Flexible matching: check if topic string contains activeTopic name
            setFilteredItems(items.filter(item => {
                const itemTopic = typeof item.topic === 'string' ? item.topic : (item.topic?.name_ar || item.topic?.name_en || item.topic?.title || '');
                return itemTopic && itemTopic.includes(activeTopic);
            }));
        }
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [activeTopic, items]);

    // Handle Pagination
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedItems(filteredItems.slice(startIndex, endIndex));
    }, [currentPage, filteredItems]);

    // Pagination Controls
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) return <LoadingModal isOpen={true} message="جارٍ تحميل المحتوى..." />;

    return (
        <div className="content-archive-page">
            <div className="archive-container">
                <div className="archive-header">
                    <h1 className="archive-title">{title}</h1>
                    <p className="archive-subtitle">استكشف مكتبتنا الشاملة من المحتوى</p>
                </div>

                {/* Filters - Tabs Style */}
                <div className="education-filters" style={{ margin: '0 0 3rem 0' }}>
                    <ul className="filter-list">
                        <li
                            className={`filter-item ${activeTopic === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTopic('all')}
                        >
                            الكل
                        </li>
                        {topics.map(topic => (
                            <li
                                key={topic.id}
                                className={`filter-item ${activeTopic === (topic.name_ar || topic.title) ? 'active' : ''}`}
                                onClick={() => setActiveTopic(topic.name_ar || topic.title)}
                            >
                                {topic.name_ar || topic.name_en || topic.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Grid */}
                {/* Grid - Directly use ArticleCard which has articles-grid class */}
                <div style={{ marginBottom: '3rem' }}>
                    {displayedItems.length > 0 ? (
                        <ArticleCard articles={displayedItems} layout="vertical" />
                    ) : (
                        <div className="no-results" style={{ textAlign: 'center', padding: '3rem' }}>
                            لا توجد نتائج مطابقة
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            &lt;
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentArchive;
