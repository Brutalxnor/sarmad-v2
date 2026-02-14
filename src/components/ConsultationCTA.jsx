import React from 'react';

const ConsultationCTA = () => {
    return (
        <section className="consultation-cta">
            <div className="container">
                <div className="cta-card">
                    <h2>هل تحتاج إلى مساعدة إضافية؟</h2>
                    <p>استطع أن تحصل على استشارة فورية عبر الفيديو</p>
                    <div className="cta-actions">
                        <button className="btn-primary">احجز استشارة</button>
                        <button className="btn-secondary-outline">تواصل معنا</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsultationCTA;
