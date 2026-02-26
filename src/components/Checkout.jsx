import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './shared/Toast';
import OrdersAPI from '../Api/Orders/orders.api';
import PaymentModal from './PaymentModal';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, session, profile } = useAuth();
    const { showToast } = useToast();

    // Get service type from state
    const serviceType = location.state?.activeService || 'expert';

    const serviceConfigs = {
        'home-test': {
            title: 'دراسة وتحليل سلوك النوم في المنزل',
            price: '950 ر.س',
            numericPrice: 950,
            description: 'تشمل توصيل الجهاز، تحليل البيانات، وتقرير طبي شامل.'
        },
        'expert': {
            title: 'الاستشارات والتوجية الشخصي للنوم',
            price: '450 ر.س',
            numericPrice: 450,
            description: 'جلسة مرئية لمدة 45 دقيقة مع خبير معتمد.'
        },
        'program': {
            title: 'التدريب والسلوكيات العلاجية',
            price: '1800 ر.س',
            numericPrice: 1800,
            description: 'برنامج متكامل لمدة 8 أسابيع (CBT-I).'
        }
    };

    const currentService = serviceConfigs[serviceType] || serviceConfigs['expert'];
    const [customMobile, setCustomMobile] = useState(profile?.mobile || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [address, setAddress] = useState({
        city: '',
        district: '',
        street: '',
        notes: ''
    });

    const handleConfirmBooking = () => {
        if (!user) {
            showToast('يرجى تسجيل الدخول أولاً', 'error');
            navigate('/login', { state: { from: location } });
            return;
        }

        if (serviceType === 'home-test' && (!address.city || !address.district || !address.street)) {
            showToast('يرجى إكمال بيانات العنوان لتوصيل الجهاز', 'error');
            return;
        }

        // Open payment simulation modal
        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async () => {
        setIsPaymentModalOpen(false);
        setIsSubmitting(true);

        try {
            // Construct a single address string from components
            const combinedAddress = [address.city, address.district, address.street].filter(Boolean).join(', ');

            const orderPayload = {
                user_id: user.id,
                address: combinedAddress || 'No address provided',
                mobile_number: customMobile || profile?.mobile || '',
                total_amount: currentService.numericPrice,
                currency: 'SAR',
                payment_method: 'Credit Card',
                payment_status: 'Paid',
                user_notes: address.notes || ''
            };

            await OrdersAPI.createOrder(orderPayload, session?.access_token);

            showToast('تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً.', 'success');
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (error) {
            console.error('Order creation failed:', error);
            showToast('حدث خطأ أثناء معالجة الطلب', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-container">
                    <div className="checkout-card glass-card no-hover">
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
                                <div className="address-form">
                                    <div className="input-group">
                                        <label>الاسم</label>
                                        <input
                                            type="text"
                                            value={profile?.name || 'مستخدم جديد'}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>رقم هاتف التواصل</label>
                                        <input
                                            type="tel"
                                            placeholder="مثال: +966500000000"
                                            value={customMobile}
                                            onChange={(e) => setCustomMobile(e.target.value)}
                                            required
                                        />
                                        <small style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                                            يمكنك تغيير الرقم إذا كنت ترغب في التواصل عبر رقم آخر
                                        </small>
                                    </div>
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

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onComplete={handlePaymentComplete}
                amount={currentService.numericPrice}
            />
        </div>
    );
};

export default Checkout;
