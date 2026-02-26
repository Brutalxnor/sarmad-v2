import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './shared/Toast';
// import OrdersAPI from '../Api/Orders/orders.api'; // Assuming you might need this
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const { showToast } = useToast();

    // Get service type from state
    const serviceType = location.state?.activeService || 'expert';

    const serviceConfigs = {
        'home-test': {
            title: 'دراسة وتحليل سلوك النوم في المنزل',
            price: '950 ر.س',
            description: 'تشمل توصيل الجهاز، تحليل البيانات، وتقرير طبي شامل.'
        },
        'expert': {
            title: 'الاستشارات والتوجية الشخصي للنوم',
            price: '450 ر.س',
            description: 'جلسة مرئية لمدة 45 دقيقة مع خبير معتمد.'
        },
        'program': {
            title: 'التدريب والسلوكيات العلاجية',
            price: '1800 ر.س',
            description: 'برنامج متكامل لمدة 8 أسابيع (CBT-I).'
        }
    };

    const currentService = serviceConfigs[serviceType] || serviceConfigs['expert'];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [address, setAddress] = useState({
        city: '',
        district: '',
        street: '',
        notes: ''
    });

    const handleConfirmBooking = async () => {
        if (serviceType === 'home-test' && (!address.city || !address.district || !address.street)) {
            showToast('يرجى إكمال بيانات العنوان لتوصيل الجهاز', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Mocking order creation for now
            // const response = await OrdersAPI.createOrder({ ... }, session.access_token);

            setTimeout(() => {
                showToast('تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً.', 'success');
                setIsSubmitting(false);
                navigate('/profile');
            }, 1500);
        } catch (error) {
            showToast('حدث خطأ أثناء معالجة الطلب', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-container">
                    <div className="checkout-card glass-card">
                        <div className="checkout-header">
                            <h1>إكمال عملية الحجز</h1>
                            <p>راجع تفاصيل طلبك وأكد الحجز للمتابعة.</p>
                        </div>

                        <div className="order-summary">
                            <div className="summary-item main">
                                <div className="service-info">
                                    <h3>{currentService.title}</h3>
                                    <p>{currentService.description}</p>
                                </div>
                                <div className="service-price">
                                    {currentService.price}
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="user-info-preview">
                                <h3>معلومات الاتصال</h3>
                                <div className="info-row">
                                    <span>الاسم:</span>
                                    <span>{profile?.name || 'مستخدم جديد'}</span>
                                </div>
                                <div className="info-row">
                                    <span>رقم الهاتف:</span>
                                    <span>{profile?.mobile || 'غير مسجل'}</span>
                                </div>
                            </div>

                            {serviceType === 'home-test' && (
                                <>
                                    <div className="summary-divider"></div>
                                    <div className="shipping-address-section">
                                        <h3>عنوان التوصيل (لجهاز الفحص)</h3>
                                        <div className="address-form">
                                            <div className="input-group">
                                                <label>المدينة</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: الرياض"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>الحي</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: الياسمين"
                                                    value={address.district}
                                                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group full">
                                                <label>الشارع وتفاصيل الموقع</label>
                                                <input
                                                    type="text"
                                                    placeholder="اسم الشارع، رقم المبنى، المعالم القريبة"
                                                    value={address.street}
                                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group full">
                                                <label>ملاحظات إضافية (اختياري)</label>
                                                <textarea
                                                    placeholder="أي تعليمات إضافية للمندوب..."
                                                    value={address.notes}
                                                    onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="payment-notice">
                                <div className="notice-icon">ℹ️</div>
                                <p>سيتم توجيهك لبوابة الدفع الآمنة لإتمام العملية بعد التأكيد.</p>
                            </div>

                            <button
                                className="btn-primary confirm-btn"
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الحجز والدفع'}
                            </button>

                            <button
                                className="btn-text cancel-btn"
                                onClick={() => navigate(-1)}
                            >
                                إلغاء والعودة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
