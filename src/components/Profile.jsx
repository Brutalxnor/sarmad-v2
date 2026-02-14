import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfilesAPI from '../Api/Profiles/profiles.api';
import ArticleAPI from '../Api/Articles/article.api';
import SavedCoursesAPI from '../Api/Courses/savedCourses.api';
import AssessmentAPI from '../Api/Assessment/Assessment.api';
import OrdersAPI from '../Api/Orders/orders.api';
import MessagesAPI from '../Api/Messages/messages.api';
import './Profile.css';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { session, user, profile, setProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'assessments', or 'orders'
    const [message, setMessage] = useState({ type: '', text: '' });
    const [supportMessage, setSupportMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    // Data states
    const [savedContent, setSavedContent] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        age_range: '',
        gender: '',
        city: '',
        mobile: '',
        email: '',
        language: 'ar'
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                age_range: profile.age_range || '',
                gender: profile.gender || '',
                city: profile.city || '',
                mobile: profile.mobile || '',
                email: profile.email || '',
                language: profile.language || 'ar'
            });
        }
    }, [profile]);

    // Fetch user data when session or profile is available
    useEffect(() => {
        if (profile?.id && session?.access_token) {
            fetchUserData();
        }
    }, [profile?.id, session?.access_token]);

    const fetchUserData = async () => {
        setContentLoading(true);
        try {
            // Fetch saved content (articles/videos) and saved courses in parallel
            const [savedRes, savedCoursesRes, assessmentRes] = await Promise.all([
                ArticleAPI.GetSavedContent(session.access_token),
                SavedCoursesAPI.getUserSavedCourses(session.access_token),
                AssessmentAPI.GetUserAssessments(profile.id)
            ]);

            // Transform courses to match the visual structure of saved content if needed
            const normalizedCourses = (savedCoursesRes.data || []).map(item => ({
                ...item,
                content: {
                    ...item.course,
                    type: 'course',
                    thumbnail_image: item.course?.thumbnail_url
                },
                isCourse: true
            }));

            const combinedContent = [
                ...(savedRes.data || []),
                ...normalizedCourses
            ].sort((a, b) => new Date(b.saved_at || b.created_at).getTime() - new Date(a.saved_at || a.created_at).getTime());

            setSavedContent(combinedContent);
            setAssessments(assessmentRes.data || []);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        } finally {
            setContentLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const ordersRes = await OrdersAPI.getUserOrders(session.access_token);
            setOrders(ordersRes.data || []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    const getRiskData = (score, symptoms) => {
        const s = symptoms?.toLowerCase() || "";
        if (s === "insomnia" || score >= 90) {
            return {
                label: "أنماط الأرق (Insomnia)",
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.1)",
                status: "يتطلب تدخل متخصص"
            };
        } else if (s === "apnea" || score >= 40) {
            return {
                label: "انقطاع النفس (Apnea)",
                color: "#F59E0B",
                background: "rgba(245, 158, 11, 0.1)",
                status: "توصية عاجلة"
            };
        } else {
            return {
                label: "مخاطر منخفضة (Low Risk)",
                color: "#22C55E",
                background: "rgba(34, 197, 94, 0.1)",
                status: "مخاطر منخفضة"
            };
        }
    };

    // Get the latest assessment for status display
    const latestAssessment = assessments.length > 0
        ? assessments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

    const riskData = latestAssessment ? getRiskData(latestAssessment.score || 0, latestAssessment.symptoms) : null;


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await ProfilesAPI.updateProfile(profile.id, formData);
            setProfile(result.data);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء التحديث' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString, alternativeField) => {
        const dateVal = dateString || alternativeField;
        if (!dateVal) return 'تاريخ غير متوفر';

        const date = new Date(dateVal);
        if (isNaN(date.getTime())) return 'تاريخ غير صالح';

        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="profile-page container">
                <div className="glass-card login-prompt" style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="prompt-icon"></div>
                    <h2>يرجى تسجيل الدخول لعرض الملف الشخصي</h2>
                    <p>انضم إلينا لمتابعة رحلة تحسين جودة حياتك ونومك.</p>
                    <button className="btn-primary" onClick={() => navigate('/login')}>تسجيل الدخول</button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page container">
            <motion.div
                className="profile-header-section"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="profile-cover">
                    <div className="cover-overlay"></div>
                </div>
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <img
                            src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=86a3b0&color=fff&size=128`}
                            alt={formData.name}
                            className="profile-avatar"
                        />
                        <div className="avatar-badge"></div>
                    </div>
                    <div className="profile-basic-info">
                        <h1>{formData.name || 'مستخدم سرمد'}</h1>
                        <div className="profile-badges">
                            {riskData && (
                                <span className="profile-status-badge" style={{ backgroundColor: riskData.color }}>
                                    {riskData.label}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="btn-primary" onClick={() => setIsEditing(true)}>
                            تعديل الملف الشخصي
                        </button>
                        <button className="btn-secondary" onClick={() => setIsLogoutOpen(true)}>
                            تسجيل الخروج
                        </button>
                    </div>
                </div>

            </motion.div>

            {/* Sleep Quality Status Section */}
            {riskData && latestAssessment && (
                <motion.div
                    className="glass-card sleep-status-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="status-header">
                        <h3>حالة جودة النوم</h3>
                        <span className="status-date">آخر تقييم: {formatDate(latestAssessment.created_at)}</span>
                    </div>
                    <div className="status-content" style={{ background: riskData.background }}>
                        <div className="status-score-section">
                            <div className="status-score-circle" style={{ borderColor: riskData.color }}>
                                <span className="status-score-value" style={{ color: riskData.color }}>
                                    {Math.round(latestAssessment.score || 0)}%
                                </span>
                                <span className="status-score-label">النتيجة</span>
                            </div>
                        </div>
                        <div className="status-info-section">
                            <h4 className="status-level" style={{ color: riskData.color }}>
                                {riskData.label}
                            </h4>
                            <p className="status-description">{riskData.status}</p>
                            <button
                                className="btn-view-details"
                                onClick={() => navigate(`/results?id=${latestAssessment.id}`)}
                                style={{ borderColor: riskData.color, color: riskData.color }}
                            >
                                عرض التفاصيل الكاملة
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="profile-content-grid">
                <motion.div
                    className="glass-card activity-card full-width"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="activity-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            المحتوى المحفوظ
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('assessments')}
                        >
                            تقييماتي
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('orders');
                                if (orders.length === 0) {
                                    fetchOrders();
                                }
                            }}
                        >
                            طلباتي
                        </button>
                    </div>

                    <div className="tab-content">
                        <AnimatePresence mode="wait">
                            {activeTab === 'saved' ? (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="activity-list"
                                >
                                    {contentLoading ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>جاري تحميل محتواك المفضل...</p>
                                        </div>
                                    ) : savedContent.length > 0 ? (
                                        savedContent.map(item => (
                                            <div
                                                key={item.id}
                                                className="activity-item premium-item"
                                                onClick={() => {
                                                    const type = item.content?.type;
                                                    const contentId = item.content_id || item.course_id;
                                                    const path = type === 'video' ? 'video' : type === 'course' ? 'course' : 'article';
                                                    navigate(`/education/${path}/${contentId}`);
                                                }}
                                            >
                                                <div className="item-visual">
                                                    {item.content?.thumbnail_image ? (
                                                        <img src={item.content.thumbnail_image} alt="" className="item-thumb" />
                                                    ) : (
                                                        <div className="item-icon-placeholder">{item.content?.type === 'video' ? 'فيديو' : item.content?.type === 'course' ? 'دورة' : 'مقال'}</div>
                                                    )}
                                                    <div className="type-badge">{item.content?.type === 'video' ? 'فيديو' : item.content?.type === 'course' ? 'دورة' : 'مقال'}</div>
                                                </div>
                                                <div className="item-info">
                                                    <h4>{item.content?.title || 'محتوى غير معروف'}</h4>
                                                    <div className="item-meta">
                                                        <span className="date">تم الحفظ في: {formatDate(item.saved_at, item.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="item-action">
                                                    <span className="arrow">←</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-activity">
                                            <div className="icon"></div>
                                            <p>لم تقم بحفظ أي محتوى بعد. ابدأ باستكشاف مركز المعرفة!</p>
                                            <button className="btn-primary" onClick={() => navigate('/education')}>اكتشف المحتوى</button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : activeTab === 'assessments' ? (
                                <motion.div
                                    key="assessments"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="activity-list"
                                >
                                    {contentLoading ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>جاري جلب نتائج تقييماتك...</p>
                                        </div>
                                    ) : assessments.length > 0 ? (
                                        assessments.map(item => (
                                            <div
                                                key={item.id}
                                                className="activity-item premium-item"
                                                onClick={() => navigate(`/results?id=${item.id}`)}
                                            >
                                                <div className="item-visual assessment-visual">
                                                    <div className="score-ring">
                                                        <span className="score-val">{Math.round(item.score || 0)}</span>
                                                    </div>
                                                </div>
                                                <div className="item-info">
                                                    <h4>تقييم جودة النوم</h4>
                                                    <div className="item-meta">
                                                        <span className="date">بتاريخ: {formatDate(item.created_at)}</span>
                                                        <span className="status-chip completed">مكتمل</span>
                                                    </div>
                                                </div>
                                                <div className="item-action">
                                                    <span className="arrow">←</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-activity">
                                            <div className="icon"></div>
                                            <p>لم تقم بإجراء أي تقييمات حتى الآن. ابدأ الآن واعرف مستوى جودة نومك!</p>
                                            <button className="btn-primary" onClick={() => navigate('/assessment')}>ابدأ التقييم الأول</button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : activeTab === 'orders' ? (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="activity-list"
                                >
                                    {contentLoading ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>جاري تحميل طلباتك...</p>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        orders.map(order => (
                                            <div
                                                key={order.id}
                                                className="activity-item order-item"
                                            >
                                                <div className="order-visual">
                                                    <div className="order-icon">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M20 7h-4m0 0V3m0 4v4m0-4h-4m8 6H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V14a1 1 0 00-1-1z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="item-info">
                                                    <h4>طلب فحص النوم المنزلي</h4>
                                                    <div className="item-meta">
                                                        <span className="date">تاريخ الطلب: {formatDate(order.created_at)}</span>
                                                        <span className={`status-chip order-status-${order.operational_status?.toLowerCase().replace(' ', '-')}`}>
                                                            {order.operational_status || 'قيد المعالجة'}
                                                        </span>
                                                    </div>
                                                    {order.tracking_ref && (
                                                        <div className="order-tracking">
                                                            <span>رقم التتبع: {order.tracking_ref}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="item-action">
                                                    <span className="arrow">←</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-activity">
                                            <div className="icon"></div>
                                            <p>لم تقم بطلب أي خدمات بعد. اطلب فحص النوم المنزلي الآن!</p>
                                            <button className="btn-primary" onClick={() => navigate('/services')}>استكشف الخدمات</button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditing(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>تعديل المعلومات الشخصية</h2>
                                <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
                            </div>

                            {message.text && (
                                <div className={`status-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>الاسم بالكامل</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled
                                            className="disabled-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>رقم الهاتف</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="01xxxxxxxxx"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>المدينة</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="القاهرة، الرياض..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>الفئة العمرية</label>
                                        <select name="age_range" value={formData.age_range} onChange={handleChange}>
                                            <option value="">اختر الفئة</option>
                                            <option value="18-24">18-24</option>
                                            <option value="25-34">25-34</option>
                                            <option value="35-44">35-44</option>
                                            <option value="45-54">45-54</option>
                                            <option value="55+">55+</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>الجنس</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">اختر الجنس</option>
                                            <option value="male">ذكر</option>
                                            <option value="female">أنثى</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                    <button type="button" className="btn-primary-ghost" onClick={() => setIsEditing(false)}>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Support Button */}
            <button
                className="sticky-support-btn"
                onClick={() => setIsSupportOpen(true)}
                title="تواصل مع الدعم"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>

            {/* Support Modal */}
            <AnimatePresence>
                {isSupportOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSupportOpen(false)}
                    >
                        <motion.div
                            className="modal-content support-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div className="header-title-wrapper">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="header-icon">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <h2>تواصل مع الدعم</h2>
                                </div>
                                <button className="modal-close" onClick={() => setIsSupportOpen(false)}>×</button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!supportMessage.trim()) {
                                    setMessage({ type: 'error', text: 'الرجاء كتابة رسالة' });
                                    return;
                                }

                                setSendingMessage(true);
                                setMessage({ type: '', text: '' });

                                MessagesAPI.sendMessage({
                                    text: supportMessage,
                                    level: 'user_support'
                                }, session.access_token)
                                    .then(() => {
                                        setMessage({ type: 'success', text: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
                                        setSupportMessage('');
                                        setTimeout(() => {
                                            setIsSupportOpen(false);
                                            setMessage({ type: '', text: '' });
                                        }, 2000);
                                    })
                                    .catch((error) => {
                                        setMessage({ type: 'error', text: 'فشل إرسال الرسالة. حاول مرة أخرى.' });
                                    })
                                    .finally(() => {
                                        setSendingMessage(false);
                                    });
                            }}>
                                <div className="modal-body">
                                    {message.text && (
                                        <div className={`message-banner ${message.type}`}>
                                            {message.text}
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>رسالتك</label>
                                        <textarea
                                            value={supportMessage}
                                            onChange={(e) => setSupportMessage(e.target.value)}
                                            placeholder="اكتب رسالتك هنا..."
                                            rows="6"
                                            disabled={sendingMessage}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn-primary" disabled={sendingMessage}>
                                        {sendingMessage ? 'جاري الإرسال...' : 'إرسال'}
                                    </button>
                                    <button type="button" className="btn-secondary" onClick={() => setIsSupportOpen(false)} disabled={sendingMessage}>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsLogoutOpen(false)}
                    >
                        <motion.div
                            className="modal-content logout-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>تسجيل الخروج</h2>
                                <button className="modal-close" onClick={() => setIsLogoutOpen(false)}>×</button>
                            </div>
                            <div className="modal-body" style={{ padding: '2rem', textAlign: 'center' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟</p>
                            </div>
                            <div className="modal-footer" style={{ padding: '1.5rem 2rem', borderTop: '2px solid #f7fafc', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button className="btn-primary" onClick={() => {
                                    logout();
                                    setIsLogoutOpen(false);
                                    navigate('/');
                                }} style={{ backgroundColor: '#e53e3e', borderColor: '#e53e3e', color: 'white' }}>
                                    نعم، تسجيل الخروج
                                </button>
                                <button className="btn-secondary" onClick={() => setIsLogoutOpen(false)}>
                                    إلغاء
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
