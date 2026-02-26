import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, smoothTextReveal, fadeInLeft, fadeInRight } from './animations';
import expertConsultationImg from '../../assets/expert_consultation.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './lifestyle-sections.css';
import './service-sections.css';

const ExpertService = () => {
    const navigate = useNavigate();
    const { requireAuth } = useAuth();

    return (
        <>
            {/* Who Needs This Service Section */}
            <section className="who-needs-section" id="who-needs">
                <div className="container">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        <motion.h2
                            className="section-title"
                            variants={smoothTextReveal}
                        >
                            النوم الزين يفرق مع مين؟
                        </motion.h2>
                        <motion.p
                            className="section-subtitle"
                            variants={smoothTextReveal}
                        >
                            يفرق معاك انت... لأنك تعبت، وتستاهل ترتاح. عندنا حلول مخصصة لك، نمشي معاك خطوة بخطوة.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="needs-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        <motion.div className="need-card" variants={fadeInUp}>
                            <div className="need-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h3>مدراء وروّاد أعمال؟</h3>
                            <p>تشتغل تحت ضغط كبير؟ توتر مزمن، أرق، وإرهاق... نساعدك تفهم وش اللي مأثر على نومك، ونعطيك حلول ترد لك طاقتك.</p>
                        </motion.div>

                        <motion.div className="need-card" variants={fadeInUp}>
                            <div className="need-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"></path>
                                    <path d="M12 7v5l3 3"></path>
                                </svg>
                            </div>
                            <h3>انتي حامل؟</h3>
                            <p>تعانين من تقطع أو قلة في النوم؟ نوفر لك جلسات مخصصة تساعدك تنامين براحة، وتخلين جسمك وعقلك ياخذون راحتهم.</p>
                        </motion.div>

                        <motion.div className="need-card" variants={fadeInUp}>
                            <div className="need-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h3>انت رياضي؟</h3>
                            <p>تتدرب كثير؟ النوم مو كسل… هو جزء من تمارينك، ومن نجاحك. نقدّم لك خطة نوم مصممة على أسلوبك وتدريبك.</p>
                        </motion.div>

                        <motion.div className="need-card" variants={fadeInUp}>
                            <div className="need-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 10v6M2 10v6M6 4h12l2 6v10H4V10L6 4z"></path>
                                </svg>
                            </div>
                            <h3>طالب في الجامعة؟</h3>
                            <p>ضغط دراسي وسهر؟ نومك مو وقت ضايع… هو استثمار في مستقبلك. نساعدك ترتّب جدول نومك وتسترجع تركيزك.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Treatment Journey Section */}
            <section className="treatment-journey" id="journey">
                <div className="container">
                    <div className="journey-layout">
                        {/* Header & Right List Column */}
                        <div className="journey-info">
                            <motion.div
                                className="journey-header-content"
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.1 }}
                            >
                                <h2 className="section-title">وش بنقدّم لك في <span className="highlight">رحلة العلاج؟</span></h2>
                                <p className="section-subtitle">هنا نبدأ التغيير الحقيقي. نشتغل معك على بناء عادات نوم أفضل بمتابعة خبير.</p>
                            </motion.div>

                            <motion.div
                                className="journey-list"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.1 }}
                            >
                                <motion.div className="list-item" variants={fadeInUp}>
                                    <div className="item-content">
                                        <h3>تحليل السلوك للنوم</h3>
                                        <p>دراسة تفصيلية لعاداتك اليومية التي تؤثر سلبًا على نومك.</p>
                                    </div>
                                    <div className="item-icon-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>

                                <motion.div className="list-item" variants={fadeInUp}>
                                    <div className="item-content">
                                        <h3>تهيئة بيئة النوم</h3>
                                        <p>توصيات عملية لتعديل الإضاءة والحرارة والضجيج في غرفتك.</p>
                                    </div>
                                    <div className="item-icon-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Cards Column 1 & 2 */}
                        <motion.div
                            className="journey-cards-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <motion.div className="journey-card" variants={fadeInUp}>
                                <div className="journey-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3>مراجعة شاملة</h3>
                                    <p>تحليل دقيق لتاريخك الصحي ونمط حياتك السابق لفهم الجذور.</p>
                                </div>
                            </motion.div>

                            <motion.div className="journey-card" variants={fadeInUp}>
                                <div className="journey-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3>جلسة مرئية 1:1</h3>
                                    <p>لقاء مباشر وخاص عبر الفيديو مع استشاري متخصص لمدة 45 دقيقة.</p>
                                </div>
                            </motion.div>

                            <motion.div className="journey-card" variants={fadeInUp}>
                                <div className="journey-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" />
                                        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" />
                                        <path d="M9 14L11 16L15 12" />
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3>تقرير متكامل</h3>
                                    <p>ملخص مكتوب بكافة التوصيات والخطوات القادمة لضمان الاستمرارية.</p>
                                </div>
                            </motion.div>

                            <motion.div className="journey-card" variants={fadeInUp}>
                                <div className="journey-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3>خطة علمية</h3>
                                    <p>خطوات عملية مخصصة لك مبنية على أحدث البروتوكولات الطبية.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Lifestyle Image Section */}
            <section className="expert-lifestyle-section">
                <div className="container">
                    <div className="lifestyle-grid alternate">
                        <motion.div
                            className="lifestyle-text-side"
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <h2 className="section-title">استشارة مهنية.. بخصوصية تامة</h2>
                            <p className="lifestyle-description">
                                لا تقلق بشأن التنقل أو غرف الانتظار. جلستك مع خبير النوم تتم عبر اتصال فيديو آمن وخصوصي، حيث نركز تماماً عليك وعلى احتياجاتك.
                            </p>
                            <div className="lifestyle-features">
                                <div className="l-feature">
                                    <span className="l-icon">✓</span>
                                    <span>اتصال فيديو HD آمن</span>
                                </div>
                                <div className="l-feature">
                                    <span className="l-icon">✓</span>
                                    <span>جدول مرن يناسب وقتك</span>
                                </div>
                                <div className="l-feature">
                                    <span className="l-icon">✓</span>
                                    <span>خبراء معتمدون ومرخصون</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lifestyle-image-wrap"
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <img src={expertConsultationImg} alt="Expert Consultation Lifestyle" className="lifestyle-img-premium" />
                            <div className="image-overlay-card left">
                                <h3>معك في كل خطوة</h3>
                                <p>دعم مستمر وإرشاد علمي مبسط.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <section className="pricing-section">
                <div className="container">
                    <div className="pricing-grid">
                        {/* Right Side: Text & Info */}
                        <motion.div
                            className="pricing-info-side"
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <motion.h2
                                className="pricing-main-title"
                                variants={fadeInRight}
                            >
                                جاهز لإستعادة جودة حياتك
                            </motion.h2>
                            <motion.p
                                className="pricing-main-subtitle"
                                variants={fadeInRight}
                            >
                                الاستثمار في نومك هو استثمار في صحتك النفسية، وإنتاجيتك، وسعادتك اليومية. من يومك يبتدي... لين تغمض عيونك وأنت مرتاح البال.
                            </motion.p>

                            <div className="info-badges-row">
                                <div className="info-badge">
                                    <span>مدة الجلسة: 45 دقيقة</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                <div className="info-badge">
                                    <span>خبراء معتمدون</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* Left Side: Price Card */}
                        <div className="price-card-container">
                            <motion.div
                                className="modern-price-card"
                                variants={fadeInLeft}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.1 }}
                            >
                                <h3 className="package-tag" style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'block' }}>ماذا تشمل الجلسة؟</h3>

                                <div className="price-divider"></div>

                                <ul className="price-features-list">
                                    <li>
                                        <span>تحليل دقيق وفهم عميق لجودة نومك.</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </li>
                                    <li>
                                        <span>نصايح شخصية من خبراء تقدر تطبّقها.</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </li>
                                    <li>
                                        <span>أدوات وتدريب مخصص لنتائج تدوم.</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </li>
                                </ul>

                                <button
                                    className="modern-cta-btn"
                                    onClick={() => requireAuth(() => navigate('/checkout', { state: { activeService: 'expert' } }))}
                                >
                                    قم بحجز موعد
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ExpertService;
