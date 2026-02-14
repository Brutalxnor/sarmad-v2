import React from 'react';
import { useNavigate } from 'react-router-dom';
import WomanSleepImage from '../assets/boy.jpg'; // Using an image from assets that fits
import CheckIcon from '../assets/check.svg';

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="final-cta">
            <div className="final-cta-container">
                <div className="final-cta-image">
                    <img src={WomanSleepImage} alt="Better Sleep" />
                    <div className="image-overlay"></div>
                </div>

                <div className="final-cta-content">
                    <div className="content-wrapper">
                        <div className="cta-badge">تقييم مجاني - دقيقتان</div>
                        <h2>اكتشف جودة نومك <br />واحصل على توصيات شخصية</h2>

                        <ul className="cta-checklist">
                             تعبت من السهر والتقلب؟<br/> تصحى الصبح ومالك خلق؟<br/>ترى ما أنت لحالك… وبنفس الوقت، ما أنت بدون حل<br/>

خلنا نمشي معك خطوة بخطوة، ونوصلك للنوم العميق اللي تستحقه<br/>

نوم يريحك، وتقوم بكامل طاقتك.


                        </ul>

                        <button className="cta-button" onClick={() => navigate('/assessment')}>
                            <span>ابدأ بالتقييم المجاني</span>
                            <span className="arrow">←</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
