import React from 'react';
import moonIcon from '../../assets/Moon.svg';

const WebinarHero = () => {
  return (
    <section className="webinars-hero">
      <div className="container hero-inner">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>ندوات تعليمية حول اضطرابات النوم</h1>
            <p>انضموا إلى نخبة من الأطباء والخبراء المساعدين في جلسات تفاعلية تهدف لتحسين جودة نومك وحياتك الصحية.</p>
            <button className="btn-primary hero-btn">استكشف الجدول الزمني</button>
          </div>
          <div className="hero-icons">
            <img src={moonIcon} alt="Moon" className="moon-icon moon-1" />
            <img src={moonIcon} alt="Moon" className="moon-icon moon-2" />
            <img src={moonIcon} alt="Moon" className="moon-icon moon-3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarHero;
