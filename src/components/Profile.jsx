import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfilesAPI from '../Api/Profiles/profiles.api';
import ArticleAPI from '../Api/Articles/article.api';
import SavedCoursesAPI from '../Api/Courses/savedCourses.api';
import AssessmentAPI from '../Api/Assessment/Assessment.api';
import OrdersAPI from '../Api/Orders/orders.api';
import MessagesAPI from '../Api/Messages/messages.api';
import ConsultationsAPI from '../Api/Consultations/consultations.api';
import './Profile.css';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { session, user, profile, setProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('saved');
    const [supportMessage, setSupportMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        age_range: profile?.age_range || '',
        gender: profile?.gender || '',
        city: profile?.city || '',
        mobile: profile?.mobile || '',
        email: profile?.email || '',
        language: profile?.language || 'ar'
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

    const [savedContent, setSavedContent] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);

    useEffect(() => {
        if (profile?.id && session?.access_token) {
            fetchUserData();
        }
    }, [profile?.id, session?.access_token]);

    const fetchUserData = async () => {
        setContentLoading(true);
        try {
            const [savedRes, savedCoursesRes, assessmentRes, ordersRes, consultationsRes] = await Promise.all([
                ArticleAPI.GetSavedContent(session.access_token),
                SavedCoursesAPI.getUserSavedCourses(session.access_token),
                AssessmentAPI.GetUserAssessments(profile.id),
                OrdersAPI.getUserOrders(session.access_token),
                ConsultationsAPI.getMyBookings(profile.id, session.access_token)
            ]);

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
            setOrders(ordersRes.data || []);
            setConsultations(consultationsRes.data || []);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        } finally {
            setContentLoading(false);
        }
    };

    const getRiskData = (score, symptoms) => {
        const s = symptoms?.toLowerCase() || "";
        if (s === "insomnia" || score >= 90) {
            return { label: "أنماط الأرق (Insomnia)", color: "#fe676e", status: "يتطلب تدخل متخصص" };
        } else if (s === "apnea" || score >= 40) {
            return { label: "انقطاع النفس (Apnea)", color: "#fd8f52", status: "توصية عاجلة" };
        } else {
            return { label: "مخاطر منخفضة (Low Risk)", color: "#86a3b0", status: "حالة جيدة" };
        }
    };

    const latestAssessment = useMemo(() =>
        assessments.length > 0 ? [...assessments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
        , [assessments]);

    const latestOrder = useMemo(() =>
        orders.length > 0 ? [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
        , [orders]);

    const riskData = latestAssessment ? getRiskData(latestAssessment.score || 0, latestAssessment.symptoms) : null;

    const journeySteps = useMemo(() => [
        {
            id: 'assessment',
            title: 'تقييم النوم المستند للعلم',
            status: assessments.length > 0 ? 'completed' : 'pending',
            action: () => navigate('/assessment'),
            buttonText: assessments.length > 0 ? 'عرض النتائج' : 'بدأ التقييم',
            icon: '📋'
        },
        {
            id: 'study',
            title: 'دراسة النوم المنزلية (HST)',
            status: latestOrder ? (latestOrder.operational_status === 'Report Ready' ? 'completed' : 'processing') : 'pending',
            action: () => navigate('/services'),
            buttonText: latestOrder ? 'تتبع الطلب' : 'طلب الدراسة',
            icon: '🏠'
        },
        {
            id: 'consultation',
            title: 'استشارة طبية متخصصة',
            status: consultations.length > 0 ? 'completed' : 'pending',
            action: () => navigate('/services', { state: { activeService: 'expert' } }),
            buttonText: consultations.length > 0 ? 'حجز موعد جديد' : 'حجز موعد',
            icon: '👨‍⚕️'
        }
    ], [assessments, latestOrder, consultations, navigate]);

    const nextAction = useMemo(() => {
        const hasProgress = !!localStorage.getItem('assessment_progress');

        // Priority 8: All steps completed (Report Ready)
        if (latestOrder?.operational_status === 'Report Ready') {
            return {
                title: 'حافظ وتعلم',
                desc: 'استمر في ممارسات النوم الجيدة للحفاظ على صحتك وجودة حياتك.',
                btn: 'عرض مرصد التعلم',
                action: () => navigate('/education'),
                secondary: 'حجز متابعة',
                secondaryAction: () => navigate('/services')
            };
        }

        // Priority 7: Upcoming consultation
        if (profile?.upcoming_session) {
            return {
                title: 'جلستك قادمة',
                desc: 'موعد جلستك الاستشارية يقترب، يرجى الاستعداد في الوقت المحدد.',
                btn: 'انضم للجلسة',
                action: () => window.open(profile.upcoming_session_link, '_blank'),
                secondary: 'إعادة جدولة',
                secondaryAction: () => navigate('/services')
            };
        }

        // Priority 6: Home study ordered (awaiting results)
        if (latestOrder && latestOrder.operational_status !== 'Report Ready') {
            return {
                title: 'تتبع دراسة نومك',
                desc: 'تحقق من حالة طلبك أو ارفع بيانات جهاز التتبع المنزلي.',
                btn: 'تتبع / رفع البيانات',
                action: () => navigate('/services'),
                secondary: 'تواصل مع الدعم',
                secondaryAction: () => setIsSupportOpen(true)
            };
        }

        // Priority 5: Home study eligible (Moderate risk + no orders)
        if (latestAssessment && riskData?.color === "#fd8f52" && !latestOrder) {
            return {
                title: 'أكد عبر دراسة منزلية',
                desc: 'نوصي بإجراء دراسة نوم منزلية لتشخيص حالتك بشكل أدق وموثق.',
                btn: 'اطلب الدراسة',
                action: () => navigate('/services'),
                secondary: 'لماذا نوصي بها؟',
                secondaryAction: () => navigate('/education')
            };
        }

        // Priority 4: Quiz completed - Moderate risk (fallback if already ordered or handled)
        if (latestAssessment && riskData?.color === "#fd8f52") {
            return {
                title: 'حسن خطة نومك',
                desc: 'استكشف التوصيات المخصصة لك بناءً على نتائج تقييمك.',
                btn: 'عرض التوصيات',
                action: () => navigate('/services'),
                secondary: 'حجز استشارة',
                secondaryAction: () => navigate('/services')
            };
        }

        // Priority 3: Quiz completed - High risk
        if (latestAssessment && riskData?.color === "#fe676e") {
            return {
                title: 'احجز استشارة طبية',
                desc: 'بناءً على نتائجك، نوصي بالتحدث مع طبيب متخصص في أسرع وقت.',
                btn: 'احجز الآن',
                action: () => navigate('/services'),
                secondary: 'عرض نتيجة الاستبيان',
                secondaryAction: () => navigate('/results', { state: { fromProfile: true } })
            };
        }

        // Priority 2: Quiz in progress
        if (hasProgress && assessments.length === 0) {
            return {
                title: 'أكمل من حيث توقفت',
                desc: 'لديك استبيان لم يكتمل بعد. أكمله الآن للحصول على تحليلك الخاص.',
                btn: 'أكمل الاستبيان',
                action: () => navigate('/assessment'),
                secondary: 'عرض الإجابات الجزئية',
                secondaryAction: () => navigate('/assessment')
            };
        }

        // Priority 1: Quiz not started (Default)
        if (assessments.length === 0) {
            return {
                title: 'ابدأ تقييم نومك',
                desc: 'اكتشف جودة نومك وأهم المخاطر الصحية في ٥ دقائق فقط.',
                btn: 'ابدأ الاستبيان',
                action: () => navigate('/assessment'),
                secondary: 'تعرف على الاستبيان',
                secondaryAction: () => navigate('/education')
            };
        }

        // Fallback for cases with assessments but no specific risk logic matched
        return {
            title: 'حافظ وتعلم',
            desc: 'استمر في ممارسات النوم الجيدة للحفاظ على صحتك وجودة حياتك.',
            btn: 'عرض مرصد التعلم',
            action: () => navigate('/education'),
            secondary: 'تصفح المحتوى',
            secondaryAction: () => navigate('/education')
        };
    }, [assessments, latestAssessment, latestOrder, riskData, profile, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await ProfilesAPI.updateProfile(profile.id, { ...formData, role: 'RegisteredUser' });
            setProfile(result.data);
            setMessage({ text: 'تم تحديث البيانات بنجاح', type: 'success' });
            setTimeout(() => { setIsEditing(false); setMessage({ text: '', type: '' }); }, 2000);
        } catch (err) {
            setMessage({ text: err.message || 'حدث خطأ', type: 'error' });
        } finally { setLoading(false); }
    };

    const formatDate = (dateVal) => {
        if (!dateVal) return '---';
        return new Date(dateVal).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (!user) return (
        <div className="profile-page container">
            <div className="glass-card login-prompt" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>يرجى تسجيل الدخول</h2>
                <button className="btn-primary" onClick={() => navigate('/login')}>تسجيل الدخول</button>
            </div>
        </div>
    );

    return (
        <div className="profile-page container">
            {/* 1. Identity Strip (Sketch Style) */}
            <motion.div className="identity-strip" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="id-info-wrapper">
                    <img src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'مستخدم')}&background=86a3b0&color=fff`} className="id-avatar" alt="" />
                    <div className="id-details">
                        <div className="id-name-header">
                            <h3>{profile?.name || 'مستخدم سرمد'}</h3>
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>تعديل الملف</button>
                        </div>
                        <span className="sarmad-id">SARMAD ID: #{profile?.id?.slice(0, 8).toUpperCase()}</span>
                        <div className="id-stats-row">
                            <span className="stat-item">مستوى الخطر: <strong style={{ color: riskData?.color || 'inherit' }}>{riskData?.label?.split(' ')[0] || '---'}</strong></span>
                            <span className="stat-item">متوسط النوم: <strong>6.2 ساعة</strong></span>
                            <span className="stat-item">آخر نشاط: <strong>{assessments.length > 0 ? 'منذ يومين' : '---'}</strong></span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="profile-main-grid special-layout">
                {/* 1. Left Column (Fixed Width): Next Best Action */}
                <div className="smart-panel-column left-side">
                    <motion.div className="smart-panel-sketch full-height-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="next-step-header">
                            <h3>خطوتك التالية</h3>
                        </div>
                        <div className="next-step-content">
                            <div className="cta-logic-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'right' }}>
                                <p className="rec-action-label" style={{ marginBottom: '0.2rem' }}>الإجراء الموصى به:</p>
                                <h4 className="cta-title-text" style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1.2' }}>{nextAction.title}</h4>
                                <p className="cta-desc-text" style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.5' }}>{nextAction.desc}</p>

                                <div className="action-divider" style={{ margin: '1rem 0' }}></div>
                                <p className="risk-statement" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                                    حالة الخطر: <strong style={{ color: riskData?.color || 'var(--accent-color)', display: 'inline', fontSize: 'inherit' }}>{riskData?.label || 'مخاطر منخفضة'}</strong>
                                </p>

                                <div className="cta-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button className="book-btn-sketch" onClick={nextAction.action}>
                                        {nextAction.btn}
                                    </button>

                                    {nextAction.secondary && (
                                        <button
                                            className="view-all-btn-sketch"
                                            onClick={nextAction.secondaryAction || nextAction.action}
                                            style={{ margin: 0, background: 'var(--card-bg)', color: 'var(--accent-color)' }}
                                        >
                                            {nextAction.secondary}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 2. Right Column (Flexible): Data & History */}
                <div className="journey-column right-side">
                    <div className="top-compact-row">
                        {/* Your Sleep Journey */}
                        <div className="glass-card section-card compact-card">
                            <h3 className="card-title-sketch">رحلة نومك</h3>
                            <div className="journey-list-sketch">
                                <div className={`journey-line ${journeySteps[0].status}`}>
                                    <span className="line-num">١. الاستبيان</span>
                                    <span className="line-status">{journeySteps[0].status === 'completed' ? '✓' : '○'}</span>
                                </div>
                                <div className={`journey-line ${journeySteps[1].status}`}>
                                    <span className="line-num">٢. دراسة النوم المنزلية</span>
                                    <span className="line-status">{journeySteps[1].status === 'completed' ? '✓' : '○'}</span>
                                </div>
                                <div className={`journey-line ${journeySteps[2].status}`}>
                                    <span className="line-num">٣. الاستشارة الطبية</span>
                                    <span className="line-status">{journeySteps[2].status === 'completed' ? '✓' : '○'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sleep Snapshot */}
                        <div className="glass-card section-card compact-card">
                            <h3 className="card-title-sketch">لمحة النوم</h3>
                            <ul className="snapshot-list mini-grid">
                                <li><span>الدرجة:</span> <strong>{latestAssessment ? Math.round(latestAssessment.score) : '---'}</strong></li>
                                <li><span>الخطر:</span> <strong style={{ color: riskData?.color }}>{riskData?.label?.split(' ')[0] || '---'}</strong></li>
                                <li><span>الساعات:</span> <strong>6.2 س</strong></li>
                                <li><span>النمط:</span> <strong>غير منتظم</strong></li>
                            </ul>
                        </div>
                    </div>

                    {/* Assessments History */}
                    {assessments.length > 0 && (
                        <div className="glass-card section-card">
                            <h3 className="card-title-sketch">سجل التقييمات</h3>
                            <div className="sessions-list-sketch">
                                {assessments
                                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                    .slice(0, 5)
                                    .map((item) => {
                                        const rData = getRiskData(item.score, item.symptoms);
                                        return (
                                            <div key={item.id} className="session-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>• تقييم مستويات النوم - {formatDate(item.created_at)}</div>
                                                    <div style={{ color: rData.color, fontSize: '0.9rem', marginRight: '1rem', marginTop: '0.2rem' }}>
                                                        مستوى الخطر: {rData.label} (الدرجة: {Math.round(item.score)})
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '4px' }}
                                                    onClick={() => navigate('/results', { state: { fromProfile: true, assessmentData: item } })}
                                                >
                                                    عرض النتائج
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Recent Sessions */}
                    <div className="glass-card section-card">
                        <h3 className="card-title-sketch">الجلسات والاستشارات</h3>
                        <div className="sessions-list-sketch">
                            {consultations.length > 0 ? (
                                consultations
                                    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
                                    .slice(0, 5)
                                    .map((item) => (
                                        <div key={item.id} className="session-line">
                                            <span>
                                                • {formatDate(item.scheduled_at)} - {item.type?.name || 'استشارة'}
                                            </span>
                                            <span className="session-icon" style={{
                                                color: item.status === 'confirmed' ? '#22C55E' : (item.status === 'pending' ? '#F59E0B' : 'inherit')
                                            }}>
                                                {item.status === 'confirmed' ? '✓' : (item.status === 'pending' ? '⌛' : '•')}
                                            </span>
                                        </div>
                                    ))
                            ) : (
                                <div style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>لا توجد جلسات مضافة بعد</div>
                            )}
                            <button className="view-all-btn-sketch" onClick={() => navigate('/services')}>حجز استشارة طبية</button>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="glass-card section-card">
                        <h3 className="card-title-sketch">الوثائق</h3>
                        <div className="docs-list">
                            <div className="doc-item">
                                <div className="doc-info">
                                    <span className="doc-icon">📄</span>
                                    <div className="doc-meta">
                                        <span className="doc-name">أحدث تقرير نوم.pdf</span>
                                        <span className="doc-date">٢٠ فبراير ٢٠٢٦</span>
                                    </div>
                                </div>
                                <button className="doc-btn download">تحميل</button>
                            </div>
                            <button className="upload-btn-sketch">رفع وثيقة</button>
                        </div>
                    </div>

                    {/* Medical Info */}
                    <div className="glass-card section-card medical-accordion">
                        <details>
                            <summary className="card-title-sketch">
                                المعلومات الطبية (اختياري)
                                <span className="accordion-arrow">▼</span>
                            </summary>
                            <div className="med-info-grid">
                                <div className="med-fact">
                                    <label>الحالات الطبية:</label>
                                    <p>{profile?.conditions || 'لا يوجد'}</p>
                                </div>
                                <div className="med-fact">
                                    <label>الحساسية:</label>
                                    <p>{profile?.allergies || 'لا يوجد'}</p>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            {/* Modals - Simplified for cleaner code */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)}>
                        <motion.div className="modal-content profile-edit-modal" initial={{ y: 50 }} animate={{ y: 0 }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>تعديل البيانات</h2>
                                <button onClick={() => setIsEditing(false)}>×</button>
                            </div>
                            <form className="profile-form" onSubmit={handleSubmit}>
                                {message.text && (
                                    <div className={`status-message ${message.type}`}>
                                        {message.text}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>الاسم</label>
                                    <input name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>الجنس</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="male">ذكر</option>
                                            <option value="female">أنثى</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>العمر</label>
                                        <input name="age_range" value={formData.age_range} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>المدينة</label>
                                    <input name="city" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>حفظ</button>
                                    <button type="button" className="btn-secondary-minimal" onClick={() => setIsEditing(false)}>إلغاء</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {isLogoutOpen && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogoutOpen(false)}>
                        <motion.div className="modal-content logout-confirm" initial={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            <h3>تسجيل الخروج</h3>
                            <p>هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
                            <div className="form-actions">
                                <button className="btn-danger" onClick={() => { logout(); navigate('/'); }}>نعم، متأكد</button>
                                <button className="btn-secondary-minimal" onClick={() => setIsLogoutOpen(false)}>إلغاء</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
