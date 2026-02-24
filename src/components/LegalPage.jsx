import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { POLICIES } from '../constants/policiesData';
import './LegalPage.css';

const LegalPage = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();

    const policy = POLICIES.find(p => p.id === policyId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [policyId]);

    if (!policy) {
        return (
            <div className="legal-page-container">
                <div className="legal-error">
                    <h2>عذراً، الصفحة غير موجودة</h2>
                    <button onClick={() => navigate('/')}>العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    return (
        <div className="legal-page-container">
            <div className="legal-page-header">
                <div className="legal-header-content">
                    <h1>{policy.label}</h1>
                    <div className="legal-breadcrumbs">
                        <span onClick={() => navigate('/')}>الرئيسية</span>
                        <span className="separator">/</span>
                        <span className="active">{policy.label}</span>
                    </div>
                </div>
                <div className="header-glow"></div>
            </div>

            <div className="legal-page-content">
                <div className="legal-card">
                    <div className="legal-card-scroll">
                        {policy.render({}, () => { })}
                    </div>
                </div>

                <div className="legal-sidebar">
                    <h3>سياسات أخرى</h3>
                    <div className="other-policies-list">
                        {POLICIES.filter(p => p.id !== 'consent').map(p => (
                            <button
                                key={p.id}
                                className={`policy-link-item ${p.id === policyId ? 'active' : ''}`}
                                onClick={() => navigate(`/legal/${p.id}`)}
                            >
                                <span className="policy-icon-small">{p.icon}</span>
                                <span className="policy-label-small">{p.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="contact-box">
                        <h4>هل لديك استفسار؟</h4>
                        <p>تواصل مع فريق الخصوصية لدينا</p>
                        <a href="mailto:support@sarmad.sa" className="contact-email-btn">
                            support@sarmad.sa
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
