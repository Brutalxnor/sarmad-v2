import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from './animations';

import expertImg from '../../assets/service_expert_consultation.png';
import homeTestImg from '../../assets/service_home_test.png';
import programImg from '../../assets/service_sleep_program.png';
import './services-hero.css';

const ServicesHero = ({ activeService, setActiveService, comingSoonServices = ['program'] }) => {
    const services = [
        {
            id: 'home-test',
            title: 'دراسة وتحليل سلوك النوم في المنزل',
            img: homeTestImg,
            activeClass: 'active-hometest'
        },
        {
            id: 'expert',
            title: 'الاستشارات والتوجية الشخصي للنوم',
            img: expertImg,
            activeClass: 'active-expert'
        },
        {
            id: 'program',
            title: 'التدريب والسلوكيات العلاجية',
            img: programImg,
            activeClass: 'active-program',
            comingSoon: comingSoonServices.includes('program')
        }
    ];

    const activeServiceData = services.find(s => s.id === activeService);

    return (
        <section className="services-hero">
            <div className="container">
                <motion.h1
                    className="services-title"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                >
                    حلول وخدمات صُمِّمَت بحب!
                </motion.h1>
                <motion.p
                    className="services-subtitle"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                >
                    في قلب رسالتنا فيه قناعة بسيطة: النوم الزين يغيّر حياتك. وحلولنا مصممة على مقاسك، سواء كنت توك بادي تهتم بصحة نومك،<br /> أو تواجه مشكلة محددة وتحتاج رأي خبير.
                </motion.p>

                {/* All three tabs always visible */}
                <motion.div
                    className="service-tabs"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                >
                    {services.map((service) => (
                        <motion.button
                            key={service.id}
                            className={`service-tab ${service.id === activeService ? 'active' : ''} ${service.comingSoon ? 'coming-soon' : ''}`}
                            onClick={() => !service.comingSoon && setActiveService(service.id)}
                            variants={fadeInUp}
                            whileHover={{ scale: service.comingSoon || service.id === activeService ? 1 : 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            {service.comingSoon && (
                                <span className="tab-coming-soon-badge">قريباً</span>
                            )}
                            <img src={service.img} alt={service.title} className="tab-icon" />
                            <span className="tab-title">{service.title}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Large card for active service */}
                <motion.div
                    className={`service-active-card ${activeServiceData.activeClass}`}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                    key={activeService}
                >
                    <div className="active-card-content">
                        <div className="active-service-icon">
                            <img src={activeServiceData.img} alt={activeServiceData.title} className="active-service-img" />
                        </div>
                        <h3 className="active-service-title">{activeServiceData.title}</h3>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesHero;
