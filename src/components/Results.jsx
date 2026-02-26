import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AssessmentAPI from '../Api/Assessment/Assessment.api';
import LoadingModal from './shared/LoadingModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from './shared/Toast';

const Results = () => {
    const { user, requireAuth } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const currentDate = "18 أكتوبر ، 22 يناير"; // Static date as per screenshot

    console.log("Results.jsx initialized. State received:", location.state);

    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");

    console.log("URL Assessment ID:", id);
    const [assessment, setAssessments] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [calculatedScore, setCalculatedScore] = useState(0);
    const [hasAutoSaved, setHasAutoSaved] = useState(false);

    const isSavingRef = React.useRef(false);

    const savedUserIdRef = React.useRef(null);

    // Effect to auto-save guest results when they log in
    useEffect(() => {
        const autoSaveGuestResult = async () => {
            // Prevent double saving if already in progress or already saved for this user
            if (isSavingRef.current || hasAutoSaved || savedUserIdRef.current === user?.id) return;

            // Only attempt auto-save if we have a valid guest state and a logged-in user
            if (id === 'guest' && user?.id && location.state?.totalScore !== undefined) {
                try {
                    isSavingRef.current = true; // Lock
                    savedUserIdRef.current = user.id; // Mark as processed for this user immediately

                    console.log("Auto-saving guest result for newly logged-in user:", user.id);
                    const answersArray = Object.values(location.state.answers || {});
                    const symptoms = location.state.symptoms || "low risk";
                    const score = location.state.totalScore;

                    const response = await AssessmentAPI.CreateAssessment(answersArray, score, symptoms);

                    if (response?.data?.id) {
                        setHasAutoSaved(true);
                        showToast("تم حفظ التقييم بنجاح في حسابك", "success");
                        // Update URL to the new ID without refreshing, to avoid re-triggering this
                        navigate(`/results?id=${response.data.id}`, {
                            state: location.state,
                            replace: true
                        });
                    }
                } catch (error) {
                    console.error("Auto-save failed:", error);
                    isSavingRef.current = false; // Unlock on error to allow retry
                    savedUserIdRef.current = null; // Reset user tracking on error
                }
            }
        };

        if (id === 'guest' && user?.id) {
            autoSaveGuestResult();
        }
    }, [user, id, location.state, hasAutoSaved, navigate, showToast]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data for ID:", id, "State available:", !!location.state);

            // Priority 1: Check if we have results in state (immediate display for guests/new completions)
            if (location.state && location.state.totalScore !== undefined) {
                console.log("Using immediate results from navigation state:", location.state.totalScore);
                setCalculatedScore(location.state.totalScore);
                setAssessments({
                    answers: location.state.answers || [],
                    symptoms: location.state.symptoms || ""
                });
                setIsLoading(false);
                return;
            }

            // Priority 2: If ID is 'guest' but no state, we can't show anything useful.
            if (id === 'guest' && !location.state) {
                console.warn("Guest ID with no state - redirecting to assessment");
                setIsLoading(false);
                return;
            }


            try {
                if (!id || id === 'guest') {
                    // If we have state but no ID (or guest ID), we should have already handled it in Priority 1.
                    // If we reached here, it means Priority 1 failed (maybe totalScore missing?) 
                    // But we MUST stop loading if we have state, otherwise UI hangs.
                    if (location.state) {
                        console.warn("State exists but Priority 1 skipped. Force stopping loading.");
                        setIsLoading(false);
                        return;
                    }
                    if (!location.state) {
                        setIsLoading(false);
                        return;
                    }
                }

                setIsLoading(true);
                // Fetch assessment and all questions in parallel
                const [assessmentRes, questionsRes] = await Promise.all([
                    AssessmentAPI.GetAssessmentById(id),
                    import('../Api/Questions/Questions.api').then(m => m.default.GetAllQuestions())
                ]);

                // Robust data extraction
                let assessmentData = assessmentRes?.data || assessmentRes || {};
                let questionsData = questionsRes?.data || questionsRes || [];

                // Handle common nesting if the above failed to get arrays/objects
                if (!Array.isArray(questionsData) && questionsData.questions) questionsData = questionsData.questions;
                if (assessmentData.data && !assessmentData.answers) assessmentData = assessmentData.data;

                console.log("Normalized Assessment Data:", assessmentData);
                console.log("Normalized Questions Data:", questionsData);

                // Correctly extract and normalize fields
                const finalAssessment = {
                    ...assessmentData,
                    answers: assessmentData.answers || assessmentData.Answers || [],
                    score: assessmentData.score || assessmentData.Score || 0,
                    symptoms: assessmentData.symptoms || assessmentData.Symptoms || ""
                };

                setAssessments(finalAssessment);

                const answersList = finalAssessment.answers;
                const scoreVal = finalAssessment.score;

                // Calculate score from answers array of UUIDs
                if (answersList.length > 0 && Array.isArray(answersList) && questionsData.length > 0) {
                    let totalPct = 0;
                    answersList.forEach((answerUuid) => {
                        // Support both string UUIDs and objects with id
                        const targetUuid = typeof answerUuid === 'string' ? answerUuid : answerUuid.id;

                        questionsData.forEach(q => {
                            if (q.answers) {
                                const foundAnswer = q.answers.find(ans => ans.id === targetUuid);
                                if (foundAnswer) {
                                    const pct = parseInt(foundAnswer.percentage || foundAnswer.answer_percentage || 0);
                                    totalPct += pct;
                                }
                            }
                        });
                    });
                    setCalculatedScore(totalPct);
                } else if (scoreVal) {
                    setCalculatedScore(parseInt(scoreVal));
                } else {
                    console.warn("No assessment results available to calculate score.");
                }

            } catch (error) {
                console.error("Failed to fetch data for results", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchData();
    }, [id, location.state])


    console.log(assessment);

    if (!user && !isLoading) {
        return (
            <div className="results-page">
                <div className="results-container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '24px', position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '4.5rem', marginBottom: '25px' }}>🔐</div>
                        <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '2rem' }}>تسجيل الدخول مطلوب</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '35px', fontSize: '1.2rem', lineHeight: '1.7', fontWeight: '500' }}>
                            لقد أتممت التقييم بنجاح! يرجى تسجيل الدخول لعرض تحليل نومك المفصل والتوصيات المخصصة لك.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/login', { state: { from: location } })}
                            style={{ margin: '0 auto', padding: '14px 45px', fontSize: '1.1rem', borderRadius: '12px', width: 'fit-content' }}
                        >
                            تسجيل الدخول للمتابعة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getRiskData = (score, symptoms) => {
        const s = symptoms?.toLowerCase() || "";
        if (s === "insomnia" || score >= 90) { // Insomnia (High Risk)
            return {
                label: "أنماط الأرق (Insomnia)",
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.1)",
                description: "بناءً على نتائجك، تظهر لديك مؤشرات قوية للأرق المزمن. نوصي ببدء برنامج CBT-I (مع فحص منزلي إذا لزم الأمر).",
                status: "يتطلب تدخل متخصص",
                actions: {
                    should: [{
                        type: 'cbt',
                        title: "برنامج CBT-I الرقمي",
                        sub: "العلاج السلوكي المعرفي للأرق",
                        desc: "برنامج علاجي رقمي مخصص لعلاج الأرق.",
                        btnText: "ابدأ برنامج العلاج",
                        path: "/services",
                        state: { activeService: 'program' }
                    }],
                    recommended: [{
                        type: 'sleep-study',
                        title: "فحص النوم المنزلي",
                        sub: "للتأكد من سلامة التنفس",
                        desc: "فحص دقيق لاستبعاد أي اضطرابات تنفسية مرافقة.",
                        btnText: "اطلب الفحص",
                        path: "/services",
                        state: { activeService: 'home-test' }
                    }],
                    optional: [{
                        type: 'expert',
                        title: "استشارة خبير النوم",
                        sub: "مساعدة فورية من مختص",
                        desc: "جلسة فيديو مع طبيب متخصص.",
                        btnText: "حجز استشارة",
                        path: "/services",
                        state: { activeService: 'expert' }
                    }]
                }
            };
        } else if (s === "apnea" || score >= 40) { // Apnea (Medium/High Risk)
            return {
                label: "انقطاع النفس (Apnea)",
                color: "#F59E0B",
                background: "rgba(245, 158, 11, 0.1)",
                description: "توصية عاجلة بفحص النوم المنزلي واستشارة طبية فورية نظراً لوجود مؤشرات على اضطراب التنفس.",
                status: "توصية عاجلة",
                actions: {
                    should: [{
                        type: 'sleep-study',
                        title: "فحص النوم المنزلي",
                        sub: "توصية عاجلة",
                        desc: "إجراء ضروري لتشخيص انقطاع النفس بشكل دقيق.",
                        btnText: "اطلب فحص النوم",
                        path: "/services",
                        state: { activeService: 'home-test' }
                    }],
                    recommended: [{
                        type: 'expert',
                        title: "استشارة طبية",
                        sub: "متابعة مع مختص",
                        desc: "ناقش نتائجك مع خبير طبي فوراً.",
                        btnText: "تواصل مع طبيب",
                        path: "/services",
                        state: { activeService: 'expert' }
                    }],
                    optional: [{
                        type: 'info',
                        title: "تنبيه هام",
                        sub: "إخلاء مسؤولية",
                        desc: "هذه النتائج أولية ولا تغني عن التشخيص الطبي. في حال شعرت بضيق تنفس شديد يرجى زيارة الطوارئ.",
                        isStatic: true
                    }]
                }
            };
        } else { // Low Risk
            return {
                label: "مخاطر منخفضة (Low Risk)",
                color: "#22C55E",
                background: "rgba(34, 197, 94, 0.1)",
                description: "نومك في حالة جيدة! نوصي بخطة تعليمية مخصصة وندوات لضمان استمرار جودة نومك العالية.",
                status: "مخاطر منخفضة",
                actions: {
                    should: [{
                        type: 'education',
                        title: "الخطة التعليمية",
                        sub: "دليل تحسين النوم",
                        desc: "نصائح وخطوات عملية للحفاظ على نمط حياة صحي.",
                        btnText: "عرض الخطة",
                        path: "/education",
                        state: {}
                    }],
                    recommended: [{
                        type: 'webinar',
                        title: "ندوات النوم",
                        sub: "تعلم من الخبراء",
                        desc: "انضم لندواتنا المباشرة.",
                        btnText: "استكشف الندوات",
                        path: "/webinars",
                        state: {}
                    }],
                    optional: [{
                        type: 'expert',
                        title: "استشارة اختيارية",
                        sub: "هل لديك تساؤلات؟",
                        desc: "يمكنك حجز استشارة قصيرة إذا رغبت.",
                        btnText: "حجز استشارة",
                        path: "/services",
                        state: { activeService: 'expert' }
                    }]
                }
            };
        }
    };

    const riskData = getRiskData(calculatedScore, assessment?.symptoms);

    const getRiskUI = (level) => {
        const data = getRiskData(calculatedScore, assessment?.symptoms);
        return {
            label: data.label,
            className: {
                color: data.color,
                background: data.background
            },
            icon: level === "high" || data.color === "#EF4444" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4M12 17h.01" />
                </svg>
            ) : data.color === "#F59E0B" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            )
        };
    };

    return (
        <div className="results-page">
            <LoadingModal isOpen={isLoading} message="جارٍ تحميل النتائج..." />
            {!isLoading && (
                <div className="results-container">
                    {/* Header Header */}
                    <div className="results-header">
                        <span className="badge-light">تقرير الأداء الشخصي لصحة نومك</span>
                        <h1>نتائج تقييم النوم الخاص بك</h1>
                        <p className="results-subtitle">بناءً على إجاباتك في الاختبار السابق، تساعدك في اتخاذ الخطوة القادمة.</p>
                        <p className="results-date">{currentDate}</p>
                    </div>

                    {/* Risk Level Alert */}
                    <div className="risk-alert-card-enhanced">
                        <div className="risk-alert-header">
                            <div className="risk-icon-large" style={getRiskUI(null).className}>
                                {getRiskUI(null).icon}
                            </div>
                            <div className="risk-score-badge">
                                <span className="score-label">النتيجة الإجمالية</span>
                                <span className="score-value">{calculatedScore}%</span>
                            </div>
                        </div>
                        <div className="risk-content">
                            <span className="risk-label">مستوى المخاطر الخاص بك</span>
                            <h3 className="risk-value" style={{ color: riskData.color }}>
                                {riskData.label}
                            </h3>
                            <p className="risk-text">{riskData.description}</p>
                            <div className="risk-status-container">
                                <h2 className="risk-status">
                                    {riskData.status}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation Cards */}
                    <h3 className="section-title">توصيات الخبراء المخصصة</h3>
                    <div className="recommendations-container">
                        {/* Should Do - Primary Action */}
                        {riskData.actions?.should?.map((action, i) => (
                            <div key={`should-${i}`} className="rec-card primary-rec">
                                <div className="rec-badge">خطوتك القادمة</div>
                                <div className="rec-icon">
                                    {action.type === 'cbt' && "🛌"}
                                    {action.type === 'sleep-study' && "🏠"}
                                    {action.type === 'education' && "📘"}
                                </div>
                                <div className="rec-content">
                                    <h4>{action.title}</h4>
                                    <p>{action.sub}</p>
                                    <small>{action.desc}</small>
                                </div>
                                <button
                                    className="btn-rec-primary"
                                    onClick={() => requireAuth(() => {
                                        const dest = (action.state?.activeService === 'expert' || action.state?.activeService === 'home-test') ? '/checkout' : (action.path || '/services');
                                        navigate(dest, { state: action.state });
                                    })}
                                >
                                    {action.btnText} <span>←</span>
                                </button>
                            </div>
                        ))}

                        {/* Recommended - Secondary Action */}
                        {riskData.actions?.recommended?.map((action, i) => (
                            <div key={`rec-${i}`} className="rec-card secondary-rec">
                                <div className="rec-badge secondary">موصى به</div>
                                <div className="rec-icon">
                                    {action.type === 'webinar' && "📡"}
                                    {action.type === 'expert' && "👨‍⚕️"}
                                    {action.type === 'sleep-study' && "🏠"}
                                </div>
                                <div className="rec-content">
                                    <h4>{action.title}</h4>
                                    <p>{action.sub}</p>
                                    <small>{action.desc}</small>
                                </div>
                                <button
                                    className="btn-rec-outline"
                                    onClick={() => requireAuth(() => {
                                        const dest = (action.state?.activeService === 'expert' || action.state?.activeService === 'home-test') ? '/checkout' : (action.path || '/services');
                                        navigate(dest, { state: action.state });
                                    })}
                                >
                                    {action.btnText}
                                </button>
                            </div>
                        ))}

                        {/* Optional - Tertiary Action */}
                        {riskData.actions?.optional?.map((action, i) => (
                            <div key={`opt-${i}`} className="rec-card tertiary-rec">
                                {action.isStatic ? (
                                    <div className="static-info">
                                        <div className="rec-icon">⚠️</div>
                                        <h4>{action.title}</h4>
                                        <p>{action.desc}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="rec-badge tertiary">اختياري</div>
                                        <div className="rec-icon">
                                            {action.type === 'expert' && "👨‍⚕️"}
                                        </div>
                                        <div className="rec-content">
                                            <h4>{action.title}</h4>
                                            <p>{action.sub}</p>
                                            <small>{action.desc}</small>
                                        </div>
                                        <button
                                            className="btn-rec-text"
                                            onClick={() => requireAuth(() => {
                                                const dest = (action.state?.activeService === 'expert' || action.state?.activeService === 'home-test') ? '/checkout' : (action.path || '/services');
                                                navigate(dest, { state: action.state });
                                            })}
                                        >
                                            {action.btnText}
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="medical-disclaimer">
                        هذا التقرير هو المرجع العام فقط ولا يغني عن التشخيص الطبي المتخصص نرجو منك التحدث مع طبيبك أو أحد المتخصصين لدينا قبل اتخاذ أي تدابير طبية.
                    </p>

                    {/* Actions Section */}
                    <div className="actions-card">
                        <div className="actions-header">
                            <div className="actions-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 11l3 3L22 4"></path>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            </div>
                            <div className="actions-text">
                                <h3>احفظ أو شارك نتائجك</h3>
                                <p>يمكن رجوع للنتيجة في أي وقت</p>
                            </div>
                        </div>

                        <div className="actions-grid">
                            <button className="action-btn" onClick={() => requireAuth(() => { console.log('Download PDF'); })}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>تحميل PDF</span>
                            </button>

                            {!user && (
                                <button className="action-btn" onClick={() => requireAuth(() => { console.log('Save result'); })}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                        <polyline points="7 3 7 8 15 8"></polyline>
                                    </svg>
                                    <span>حفظ في حسابك</span>
                                </button>
                            )}

                            <button className="action-btn" onClick={() => {
                                const msg = `السلام عليكم، لقد حصلت على نتيجة ${calculatedScore}% في تقييم النوم الخاص بي في سرمد ولدي استفسار:`;
                                window.open(`https://wa.me/966500000000?text=${encodeURIComponent(msg)}`, '_blank');
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                </svg>
                                <span>مشاركة عبر واتساب</span>
                            </button>

                            <button className="action-btn" onClick={() => requireAuth(() => { console.log('Send Email'); })}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <span>إرسال بالإيميل</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
