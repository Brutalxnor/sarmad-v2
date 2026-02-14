import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WomanSleepVideo from '../assets/womansleep.mp4';
import NightVideo from '../assets/night.mp4';
import MorningVideo from '../assets/morning.mp4';

const AssessmentCTA = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(0);

  const segments = [
    {
      label: 'افهم مشكلة نومك',
      video: WomanSleepVideo
    },
    {
      label: 'الحل المناسب ليك',
      video: NightVideo
    },
    {
      label: 'تابع تحسّن حقيقي',
      video: MorningVideo
    }
  ];

  return (
    <section className="assessment-cta">
      <div className="container">
        <div className="cta-header">
          <h2>ليه تختار خدمات <span className="gradient-text">سَرمَد؟</span></h2>
          <p>

في قلب رسالتنا فيه قناعة بسيطة: النوم الزين يغيّر حياتك.
وحلولنا مصممة على مقاسك، سواء كنت توك بادي تهتم بصحة نومك، أو تواجه مشكلة محددة وتحتاج رأي خبير.<br/>
          </p>
        </div>
      </div>
      <div className="cta-container">
        <div className="cta-content">
          <div className="content-inner">
            <div className="interactive-labels">
              {segments.map((segment, index) => (
                <span
                  key={index}
                  className={`interactive-label ${activeVideo === index ? 'active' : ''}`}
                  onClick={() => setActiveVideo(index)}
                >
                  {segment.label}
                </span>
              ))}
            </div>

            <p className="cta-description">
كثير من مشاكل النوم لها أسباب واضحة، ومع الفهم الصحيح تقدر توصل للحل المناسب وتعيش يومك بنشاط أكثر.
            </p>

            <button className="btn-assessment-new" onClick={() => navigate('/assessment')}>
              ابدأ التقييم الآن
            </button>
          </div>
        </div>

        <div className="cta-video-wrapper">
          <video
            key={segments[activeVideo].video}
            autoPlay
            muted
            loop
            playsInline
            className="cta-video-new"
          >
            <source src={segments[activeVideo].video} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default AssessmentCTA;
