import React, { useState } from 'react';
import './WebinarRegistrationModal.css';

const WebinarRegistrationModal = ({ isOpen, onClose, webinar }) => {
    const [step, setStep] = useState('form'); // 'form' or 'success'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    if (!isOpen || !webinar) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="webinar-registration-overlay" onClick={onClose}>
            <div className="webinar-registration-modal" onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <div className="webinar-modal-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>

                {/* Header Image */}
                <img
                    src={webinar.thumbnail_image || webinar.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000"}
                    alt={webinar.title}
                    className="webinar-modal-header-img"
                />

                <div className="webinar-modal-body">
                    {step === 'form' ? (
                        <>
                            <h2 className="webinar-modal-title">{webinar.title}</h2>
                            <p className="webinar-modal-subtitle">
                                {webinar.summary || 'تعلم تقنيات مثبتة علمياً لتحسين جودة نومك والتخلص من الأرق المزمن في هذه الندوة التفاعلية'}
                            </p>

                            <div className="webinar-modal-meta">
                                <div className="webinar-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    <span>{formatDate(webinar.date_time)}</span>
                                </div>
                                <div className="webinar-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    <span>{formatTime(webinar.date_time)}</span>
                                </div>
                                <div className="webinar-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <span>{webinar.duration || '60 دقيقة'}</span>
                                </div>
                            </div>

                            <form className="registration-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="الاسم"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="البريد الإلكتروني"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'جاري التسجيل...' : 'سجل الآن مجاني'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-container">
                            <div className="success-icon-wrapper">
                                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 50 L40 70 L80 30" stroke="#35788D" />
                                    <circle cx="50" cy="50" r="45" stroke="#35788D" />
                                </svg>
                            </div>
                            <h2 className="success-title">تم التسجيل بنجاح!</h2>
                            <p className="success-message">سنرسل لك رابط الندوة قبل الموعد بساعة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebinarRegistrationModal;
