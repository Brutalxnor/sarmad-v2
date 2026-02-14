import React from 'react';
import moonIcon from '../assets/Moon.svg';

const EducationHero = () => {
    return (
        <section className="education-hero">
            <div className="container hero-inner">
                <div className="hero-content-wrapper">
                    <div className="hero-text">
                        <h1>فهم دورة النوم العميق</h1>
                        <p>اكتشف كيف يمكنك تحسين جودة نومك من خلال فهم التوقيت المثالي لدورة نومك الشخصية</p>
                        <button className="btn-primary hero-btn">ابدأ الآن</button>
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

export default EducationHero;
