import React from 'react';
import im1 from '../assets/1.jpg';
import im2 from '../assets/2.jpg';
import im3 from '../assets/3.jpg';

const WhyChooseUs = () => {
  return (
    <section className="why-us">
      <div className="section-glow"></div>
      <div className="container">
        <div className="section-head">
          <h2>ليه تختار خدمات سرمد؟</h2>
          <p>
            في سرمد نجمع بين العلم، الخبرة الإنسانية، والتجربة الرقمية السهلة عشان نساعدك تحسن نومك بشكل حقيقي.
            خدماتنا مبنية على تقييم دقيق، وإشراف من خبراء نوم، وحلول عملية تناسب نمط حياتك.
          </p>
        </div>

        <div className="cards-wrapper">
          <div className="tilt-card card-1">
            <img src={im1} alt="Sleep Well" />
          </div>
          <div className="tilt-card card-2">
            <img src={im3} alt="Expert Consultation" />
          </div>
          <div className="tilt-card card-3">
            <img src={im2} alt="Medical Tech" />
          </div>
        </div>
      </div>

    </section>
  );
};

export default WhyChooseUs;
