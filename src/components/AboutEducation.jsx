import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './AboutEducation.css';
import sleepLifestyle from '../assets/home_sleep_lifestyle.png';
import awarenessImg from '../assets/sleep_program_lifestyle.png';

const AboutEducation = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const slideIn = (direction) => ({
        hidden: { opacity: 0, x: direction === 'left' ? -40 : 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
        }
    });

    return (
        <div className="about-education-page">
            <section className="about-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="hero-content"
                    >
                        <h1 className="gradient-text">مرصد سرمد للنوم</h1>
                        <p className="hero-subtitle">نبني لك مكاناً يثقفك عن ليلك... بصدق وعلم.</p>
                    </motion.div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="content-grid">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideIn('left')}
                            className="text-block"
                        >
                            <div className="section-visual-accent">
                                <img
                                    src={sleepLifestyle}
                                    alt="Peaceful Sleep"
                                    className="vision-image-sketch"
                                />
                                <div className="image-border-decoration"></div>
                            </div>
                            <h2>هو المساحة التعليمية المتخصصة داخل موقع سرمد.</h2>
                            <p>
                                أنشأناه ليكون مرجعاً موثوقاً يجمع المعرفة الدقيقة عن النوم في مكان واحد.. مبنية على أحدث الدراسات، ومقدمة بلغة واضحة تناسب حياتنا اليومية.
                                هنا نرصد المفاهيم، نفكر في الإشارات، ونضع بين يديك فهماً أعمق قبل أي خطوة أخرى.
                                لأن التغيير الحقيقي يبدأ بالمعلومة الصحيحة... هي الوقت الصحيح.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="info-card-sketch"
                        >
                            <h3>خليك صريح مع نفسك... هل فعلاً نومك طبيعي؟</h3>
                            <p className="card-hint">جاوب بدون تجميل:</p>
                            <motion.ul
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="checklist"
                            >
                                {[
                                    'كم مرة قلت "عادي" وأنت تصحى متعب؟',
                                    'كم مرة احتجت قهوة زيادة عشان تقدر تكمل يومك؟',
                                    'كم مرة انزعجت بسرعة... وأنت يمكن الضغط السبب؟',
                                    'وكم مرة تجاهلت الإشارة... وقلت: "بكرة أرتب نومي"؟'
                                ].map((text, idx) => (
                                    <motion.li key={idx} variants={itemVariants}>{text}</motion.li>
                                ))}
                            </motion.ul>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="conclusion-text"
                            >
                                <p>طيب خلنا نسألك سؤال أهم:</p>
                                <h4>وش لو المشكلة مو في يومك... بل في ليلك؟</h4>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="content-grid reversed">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideIn('right')}
                            className="text-block"
                        >
                            <h2>مو كل تعب طبيعي</h2>
                            <div className="section-visual-accent">
                                <img
                                    src={awarenessImg}
                                    alt="Sleep Awareness"
                                    className="vision-image-sketch"
                                />
                                <div className="image-border-decoration shadow-alt"></div>
                            </div>
                            <p>
                                ومو كل أرق "مرحلة وتعدي".
                                النوم الرديء ما يجيك فجأة ويصرخ، هو يبدأ بهمس بسيط:
                                تركيز أقل. مزاج متقلب. إرهاق خفيف.
                                تم بكرا... وأنت متعود عليه.
                            </p>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="highlight-text"
                            >
                                مرصد سرمد للنوم موجود عشان يوقفك للحظة، ويخليك تواجه الحقيقة بهدوء... قبل ما تتراكم.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="vertical-features"
                        >
                            <div className="feature-item">
                                <h4>لكن عشان نعطيك معرفة دقيقة... ونخليك تفرق بين:</h4>
                                <motion.ul
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    className="simple-list"
                                >
                                    {['تعب عابر', 'وعادة سيئة', 'ومؤشر يستحق الانتباه'].map((text, idx) => (
                                        <motion.li key={idx} variants={itemVariants}>{text}</motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="about-section grid-features">
                <div className="container">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="section-title"
                    >
                        داخل المرصد... وش ينتظرك؟
                    </motion.h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="features-grid"
                    >
                        {[
                            { t: 'حقائق ما أحد قالها لك بوضوح', d: 'عن الأرق، عن الشخير، عن الاستيقاظ المتكرر، عن نوم الساعات الكثيرة بدون راحة.' },
                            { t: 'مكتبة معرفية موثوقة', d: 'مبنية على أبحاث حديثة، لكن بلغة تفهمها بدون تعقيد.' },
                            { t: 'موازنة صادقة', d: 'متى تكفي بتعديل بسيط في روتينك... ومتى تعرف أن التأجيل ممكن يكلفك أكثر.' },
                            { t: 'ورش ودورات منظمة', d: 'إذا قررت تتعمق، تلقى محتوى مدروس يساعدك تطبق، مو بس تقرأ.' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10, borderColor: 'var(--accent-color)' }}
                                className="feature-card"
                            >
                                <h4>{feature.t}</h4>
                                <p>{feature.d}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="about-section final-block">
                <div className="container">
                    <div className="content-grid">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={slideIn('left')}
                            className="text-block"
                        >
                            <h2>خلنا نكون واضحين...</h2>
                            <p>
                                النوم الرديء، ما يأثر عليك اليوم بس، هو يأثر على قراراتك، تركيزك، علاقاتك، وحتى صحتك.
                                وأصعب شيء؟ إنك تتعود عليه... وتحسبه طبيعي.
                            </p>
                            <p className="brand-statement">
                                مرصد سرمد ما يعطيك تشخيص، لكن يعطيك وعي.
                            </p>
                            <p>
                                وأحياناً الوعي هو الفرق بين إنك تكمل بنفس الدائرة... أو تبدأ تغيير حقيقي.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="cta-box"
                        >
                            <h3>هنا تبدأ القصة الصح</h3>
                            <p>مرصد سرمد هو القسم التعليمي والتثقيفي داخل موقع سرمد.</p>
                            <p className="question-text">السؤال الأخير...</p>
                            <h4>بتكمل تعود على التعب، ولا بتعرف وش القصة؟</h4>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutEducation;
