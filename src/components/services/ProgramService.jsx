import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, growUp, fadeInLeft, fadeInRight } from './animations';
import sleepProgramLifestyle from '../../assets/sleep_program_lifestyle.png';
import './timeline.css';
import './lifestyle-sections.css';
import './program-service.css';

const ProgramService = () => {
    return (
        <div className="program-view">
            {/* Section 1: What you will learn */}
            <section className="program-learning">
                <div className="container">
                    <motion.h2
                        className="section-title center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        أبعد من مجرد "نصائح للنوم"
                    </motion.h2>
                    <motion.p
                        className="section-subtitle center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        برنامجنا ليس مجرد قائمة مهام، بل هو رحلة تحول علمية. نستخدم أحدث تقنيات العلاج السلوكي المعرفي للأرق (CBT-I) لتمكينك من النوم بشكل طبيعي دون الحاجة للأدوية.
                    </motion.p>

                    <motion.div
                        className="learning-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        <motion.div className="learning-card" variants={fadeInUp}>
                            <div className="learning-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </div>
                            <h3>تدريب نوم مخصص لك</h3>
                            <p>نرسم لك خطة تدريب على روتين نوم يناسبك ويندمج مع نمط حياتك.</p>
                        </motion.div>
                        <motion.div className="learning-card" variants={fadeInUp}>
                            <div className="learning-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8l4 4-4 4M8 12h8" />
                                </svg>
                            </div>
                            <h3>علاج النوم السلوكي المعرفي (CBT-I)</h3>
                            <p>العلاج الأهم عالمياً للأرق المزمن، معتمد على جلسات منظمة وسلوكيات مثبتة علمياً.</p>
                        </motion.div>
                        <motion.div className="learning-card" variants={fadeInUp}>
                            <div className="learning-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3>برامج لفئات محددة</h3>
                            <p>مثل الحوامل، كبار السن، الرياضيين، رواد الأعمال، وغيرهم.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Lifestyle Image Section */}
            <section className="program-lifestyle-section">
                <div className="container">
                    <div className="lifestyle-grid">
                        <motion.div
                            className="lifestyle-image-wrap"
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <img src={sleepProgramLifestyle} alt="Sleep Program Lifestyle" className="lifestyle-img-premium" />
                            <div className="image-overlay-card">
                                <h3>تغيير حقيقي. نتائج تدوم.</h3>
                                <p>استيقظ كل صباح وأنت في كامل نشاطك.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lifestyle-text-side"
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <h2 className="section-title">أبعد من مجرد "نصائح للنوم"</h2>
                            <p className="lifestyle-description">
                                برنامجنا ليس مجرد قائمة مهام، بل هو رحلة تحول علمية. نستخدم أحدث تقنيات العلاج السلوكي المعرفي للأرق (CBT-I) لتمكينك من النوم بشكل طبيعي دون الحاجة للأدوية.
                            </p>
                            <div className="lifestyle-stats">
                                <div className="stat-item">
                                    <span className="stat-value">٨ أسابيع</span>
                                    <span className="stat-label">مدة البرنامج</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">٨٠٪</span>
                                    <span className="stat-label">نسبة التحسن</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">علمي</span>
                                    <span className="stat-label">نهج مدروس</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 2: Program Structure */}
            <section className="program-structure">
                <div className="container">
                    <motion.h2
                        className="section-title center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        هيكل البرنامج ومدته
                    </motion.h2>
                    <motion.p
                        className="section-subtitle center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                    >
                        رحلة علاجية متكاملة موزعة على 8 أسابيع لضمان أفضل نتائج النوم المستدامة.
                    </motion.p>

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
                                <div className="step-number" style={{ display: 'none' }}>1</div>
                                <div className="timeline-content">
                                    <h3>الأسبوع 1: التقييم الأولي الشامل</h3>
                                    <p>فحص دقيق لعادات النوم الحالية، التاريخ الطبي، وتحديد الأهداف الشخصية المرجوة من البرنامج.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '140px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-2" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number" style={{ display: 'none' }}>2</div>
                                <div className="timeline-content">
                                    <h3>الأسبوع 2 - 4: تعديل السلوك وعادات النوم</h3>
                                    <p>تطبيق تقنيات "تحكم المثير" والتحكم في المحفزات لإعادة الارتباط بين غرفة النوم.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '90px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-3" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number" style={{ display: 'none' }}>3</div>
                                <div className="timeline-content">
                                    <h3>الأسبوع 5 - 6: إعادة الهيكلة المعرفية</h3>
                                    <p>التعامل مع "قلق الأداء" وتصحيح المفاهيم الخاطئة التي تعيق الممارسات للنوم الهادئ.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '150px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="timeline-item step-4" variants={fadeInUp}>
                            <div className="timeline-card">
                                <div className="step-number" style={{ display: 'none' }}>4</div>
                                <div className="timeline-content">
                                    <h3>الأسبوع 7 - 8: الوقاية من الانتكاس</h3>
                                    <p>وضع خطة طويلة الأمد للحفاظ على جودة النوم ولضمان عدم العودة لمشكلات النوم مستقبلاً.</p>
                                </div>
                            </div>
                            <motion.div className="timeline-marker" variants={growUp} style={{ '--line-height': '110px' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: Banner */}
            <section className="program-banner-section">
                <div className="container">
                    <div className="banner-content">
                        <h2 className="banner-title">جاهز تفعّل طاقة النوم الحقيقية؟</h2>
                        <p className="banner-subtitle">ترى النوم ما هو بس "عدد ساعات"...النوم هو كيف تعيد شحنك من راسك لقلبك لجسمك ولروحك. ابدأ رحلتك اليوم.</p>
                        <button className="banner-btn">ابدأ رحلتك اليوم وخذ أول خطوة</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProgramService;
