import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, growUp, fadeInLeft, fadeInRight } from './animations';
import homeSleepLifestyle from '../../assets/home_sleep_lifestyle.png';
import homeTestBannerBg from '../../assets/home_test_banner_bg.png';
import './timeline.css';
import './lifestyle-sections.css';
import './service-sections.css';

const fadeInRightStagger = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

const HomeTestService = () => {
    // ... (rest of component)


    return (
        <div className="home-test-view">
            {/* Section 1: Symptoms */}
            <section className="hometest-symptoms">
                <div className="container">
                    <motion.h2
                        className="section-title center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        النوم الزين يفرق مع مين؟
                    </motion.h2>
                    <motion.p
                        className="section-subtitle center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        يفرق معاك انت... لأنك تعبت، وتستاهل ترتاح. مهما كان يومك ومهما كان ضغطك، عندنا حل لك.
                    </motion.p>

                    <motion.div
                        className="symptoms-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        <motion.div className="symptom-card" variants={fadeInUp}>
                            <div className="symptom-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h3>تشتغل؟ ومشغول؟</h3>
                            <p>مدراء، روّاد أعمال، موظفين... توتر مزمن وأرق وإرهاق، ونوم ما يكفي.. وكل هذا ينعكس على شغلك.</p>
                        </motion.div>
                        <motion.div className="symptom-card" variants={fadeInUp}>
                            <div className="symptom-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"></path>
                                    <path d="M12 7v5l3 3"></path>
                                </svg>
                            </div>
                            <h3>انتي حامل؟</h3>
                            <p>تغيّرات هرمونية، تعب جسدي، وقلق... نوفر لك حلول تساعدك تنامين براحة وأنتي في بيتك.</p>
                        </motion.div>
                        <motion.div className="symptom-card" variants={fadeInUp}>
                            <div className="symptom-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h3>انت رياضي؟</h3>
                            <p>تتمرن كثير؟ النوم مو كسل… هو جزء من تمارينك، واستشفاء جسمك، ومن نجاحك الرياضي.</p>
                        </motion.div>
                        <motion.div className="symptom-card" variants={fadeInUp}>
                            <div className="symptom-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 10v6M2 10v6M6 4h12l2 6v10H4V10L6 4z"></path>
                                </svg>
                            </div>
                            <h3>طالب جامعة؟</h3>
                            <p>سهر ودوام متقلب؟ نومك مو وقت ضايع… هو استثمار في مستقبلك، وتركيزك في دراستك.</p>
                        </motion.div>
                        <motion.div className="symptom-card" variants={fadeInUp}>
                            <div className="symptom-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3>عندك أطفال؟</h3>
                            <p>قلة النوم تأثر على تركيزهم وتحصيلهم.. ساعدهم يبدأون يومهم بنشاط مع روتين نوم صحي.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            {/* Section: Lifestyle Image */}
            <section className="hometest-lifestyle-section">
                <div className="container">
                    <div className="lifestyle-grid">
                        <motion.div
                            className="lifestyle-image-wrap"
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <img src={homeSleepLifestyle} alt="Home Sleep Test Lifestyle" className="lifestyle-img-premium" />
                            <div className="image-overlay-card">
                                <h3>لا أسلاك. ولا تعقيد.</h3>
                                <p>فقط جهاز صغير تلبسه وتنام بهدوء في سريرك.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lifestyle-text-side"
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <h2 className="section-title">وش نقدّم لك في بيتك؟</h2>
                            <p className="lifestyle-description">
                                نوفر لك حلول لدراسة وتحسين جودة نومك وانت في بيتك ، مع خطة مخصصة تناسب وضعك وظروفك. نساعدك تفهم وش اللي قاعد يأثر على نومك، ونعطيك حلول واقعية تحسّن نومك، وترد لك طاقتك.
                            </p>
                            <div className="lifestyle-stats">
                                <div className="stat-item">
                                    <span className="stat-value">١٠٠٪</span>
                                    <span className="stat-label">خصوصية تامة</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">٠</span>
                                    <span className="stat-label">أسلاك مزعجة</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">٩٩٪</span>
                                    <span className="stat-label">دقة طبية</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 2: Journey */}
            <section className="hometest-journey">
                <div className="container">
                    <motion.h2
                        className="section-title center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        رحلتك نحو نوم أفضل
                    </motion.h2>
                    <motion.div
                        className="hometest-timeline"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        {/* The Axis Line */}
                        <div className="timeline-axis"></div>

                        <motion.div className="timeline-item step-1" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number">1</div>
                                <div className="timeline-content">
                                    <h3>يوصل لباب بيتك</h3>
                                    <p>فقط جهاز صغير يوصل لباب بيتك، بدون تعب ولا غرف انتظار.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '120px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-2" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number">2</div>
                                <div className="timeline-content">
                                    <h3>ليلة وحدة بهدوء</h3>
                                    <p>تلبسه ليلة وحدة بس، بدون أسلاك مزعجة، ويسجّل بيانات نومك بكل سلاسة.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '80px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-3" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number">3</div>
                                <div className="timeline-content">
                                    <h3>مزامنة البيانات</h3>
                                    <p>يتم رفع بياناتك تلقائياً وبكل أمان لمنصتنا الطبية للبدء في التحليل.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '160px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-4" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number">4</div>
                                <div className="timeline-content">
                                    <h3>النتائج والتحليل</h3>
                                    <p>النتائج؟ دقيقة ويحللها لك أخصائيين نوم معتمدين… في وقت قياسي.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '100px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: Features */}
            <section className="hometest-features">
                <div className="container">
                    <div className="features-layout">
                        <motion.div
                            className="features-grid"
                            variants={fadeInRightStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <motion.div className="feature-card" variants={fadeInUp}>
                                <div className="feature-icon-small">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <h3>تقرير مخبري مفصل</h3>
                                <p>تحليل شامل لجميع ساعات نومك</p>
                            </motion.div>
                            <motion.div className="feature-card" variants={fadeInUp}>
                                <div className="feature-icon-small">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                                <h3>مؤشر انقطاع التنفس</h3>
                                <p>تحديد دقيق لمستويات انقطاع النفس</p>
                            </motion.div>
                            <motion.div className="feature-card" variants={fadeInUp}>
                                <div className="feature-icon-small">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 20v-6M9 20v-10M15 20v-4M18 20V4M6 20v-2" />
                                    </svg>
                                </div>
                                <h3>مراجعة إحصائية</h3>
                                <p>فهم عميق للاضطرابات التي تواجهك</p>
                            </motion.div>
                            <motion.div className="feature-card" variants={fadeInUp}>
                                <div className="feature-icon-small">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3>توصيات علاجية متكاملة</h3>
                                <p>خطوات عملية لتحسين جودة نومك</p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="features-summary"
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <h2 className="section-title">ماذا ستحصل عليه؟</h2>
                            <p>نحن لا نوفر مجرد بيانات، بل نقدم لك رؤية طبية شاملة لحالتك الصحية. التقرير الذي ستحصل عليه معترف به من قبل المستشفيات ويمكنك استخدامه لمتابعة علاجك.</p>
                            <ul className="summary-check-list">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span>تقرير نتائج بصيغة PDF سهل القراءة</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span>توصيات مخصصة حسب حالتك</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span>دعم تقني وفني طوال فترة الدراسة</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 4: Enhanced Banner */}
            <section className="hometest-banner-section-enhanced">
                <div className="banner-bg-container">
                    <img src={homeTestBannerBg} alt="Sleep Device" className="banner-bg-image" />
                    <div className="banner-overlay"></div>
                </div>
                <div className="container">
                    <motion.div
                        className="banner-glass-card"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="banner-title">جاهز تفعّل طاقة النوم الحقيقية؟</h2>
                        <p className="banner-subtitle">ترى النوم ما هو بس "عدد ساعات"...النوم هو كيف تعيد شحنك من راسك لقلبك لجسمك ولروحك. ابدأ رحلتك اليوم.</p>
                        <button className="banner-btn-premium">
                            قم بحجز موعد
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '24px', height: '24px' }}>
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomeTestService;
