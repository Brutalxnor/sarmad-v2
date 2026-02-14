import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './JourneySteps.css';

const JourneySteps = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useScrollAnimation({ threshold: 0.2 });
  const sectionRef = useRef(null);

  const steps = [
    {
      num: '1',
      title: 'تعلم',
      desc: 'استكشف محتوى تعليمي موثوق حول صحة النوم',
      icon: '🏫'
    },
    {
      num: '2',
      title: 'قيم نومك',
      desc: 'تقييم سريع ياخذ دقيقتين ويعطيك صورة واضحة عن وضع نومك.',
      icon: '⚖️'
    },
    {
      num: '3',
      title: 'نفهم حالتك',
      desc: 'نحلل النتائج ونحدّد إيش اللي مأثر على نومك بالضبط.',
      icon: '🔍'
    },
    {
      num: '4',
      title: 'نرشّح الحل المناسب',
      desc: 'استشارة، دراسة نوم منزلية، أو برنامج تحسين نوم… حسب حالتك.',
      icon: '📱'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveStep(0);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  return (
    <section className="journey" ref={sectionRef}>
      <div className="section-bg"></div>
      <div className="container">
        <div className="section-head">
          <div className="badge">كيف نشتغل</div>
          <h2>   كيف نساعدك في  <span className="gradient-text">سَرمَد</span></h2>
          {/* <p className="journey-subtitle">لقد تم إثبات فعالية تطبيق سرمد سريرياً لتحقيق نتائج حقيقية لنومك، كل ليلة</p> */}
        </div>

        <div className="timeline-container scroll-animate" ref={scrollRef}>
          <div className="timeline-main-line">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="timeline-tick"></div>
            ))}
          </div>

          <div className="steps-wrapper">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`step-item ${idx === activeStep ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="step-card">
                  <div className="step-card-content">
                    <div className="step-number-badge">{step.num}</div>
                    <span className="step-card-percent"> {step.title}</span>
                    <p className="step-card-text">{step.desc}</p>
                  </div>
                </div>
                <div className="step-connector"></div>
                <div className="step-dot"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="journey-cta">
          <button className="cta-button" onClick={() => navigate('/assessment')}>
            <span>ابدأ بالتقييم المجاني</span>
            <span className="arrow">←</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default JourneySteps;

