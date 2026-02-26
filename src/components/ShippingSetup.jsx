import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './shared/Toast';
import OrdersAPI from '../Api/Orders/orders.api';
import './Checkout.css'; // Reusing checkout styles
import { motion } from 'framer-motion';

const ShippingSetup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, session, profile } = useAuth();
    const { showToast } = useToast();

    // Data passed from Checkout or Login redirect
    const { serviceType, amount, mobile, hasPaid, address: initialAddress } = location.state || {};

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localMobile, setLocalMobile] = useState(mobile || profile?.mobile || '');
    const [address, setAddress] = useState({
        city: initialAddress?.city || '',
        district: initialAddress?.district || '',
        street: initialAddress?.street || '',
        notes: initialAddress?.notes || ''
    });

    const handleFinishOrder = async () => {
        if (!address.city || !address.district || !address.street) {
            showToast('يرجى إكمال بيانات العنوان لتوصيل الجهاز', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const combinedAddress = [address.city, address.district, address.street].filter(Boolean).join(', ');

            const orderPayload = {
                user_id: user.id,
                address: combinedAddress,
                mobile_number: localMobile || profile?.mobile || '',
                total_amount: amount || 950,
                currency: 'SAR',
                payment_method: 'Credit Card',
                payment_status: 'Paid',
                user_notes: address.notes || ''
            };

            await OrdersAPI.createOrder(orderPayload, session?.access_token);

            showToast('تم ربط مدفوعاتك بحسابك وحفظ عنوانك بنجاح!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Finalizing order failed:', error);
            showToast('حدث خطأ أثناء حفظ بيانات الشحن', 'error');
            setIsSubmitting(false);
        }
    };

    if (!location.state || (!hasPaid && !user)) {
        return (
            <div className="checkout-page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h2 style={{ color: 'white' }}>عذراً، يرجى إتمام عملية الدفع أولاً</h2>
                    <button className="btn-primary" onClick={() => navigate('/services')} style={{ marginTop: '20px' }}>
                        العودة للخدمات
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-container">
                    <motion.div
                        className="checkout-card glass-card no-hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="checkout-header">
                            <div className="success-badge" style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: '#22C55E',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                display: 'inline-block',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                                ✓ تم تأكيد الدفع بنجاح
                            </div>
                            <h1>تفاصيل الشحن والتوصيل</h1>
                            <p>يرجى إدخال عنوانك بالتفصيل لنتمكن من إرسال جهاز فحص النوم إليك</p>
                        </div>

                        <div className="order-summary">
                            <div className="shipping-address-section">
                                <div className="address-form">
                                    <div className="input-group full">
                                        <label>رقم الجوال للتواصل (في حال رغبت بتغيير رقم حسابك)</label>
                                        <input
                                            type="tel"
                                            placeholder="مثال: +966500000000"
                                            value={localMobile}
                                            onChange={(e) => setLocalMobile(e.target.value)}
                                            required
                                        />
                                    </div>
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
                                        <label>ملاحظات إضافية للمندوب (اختياري)</label>
                                        <textarea
                                            placeholder="مثال: بجوار مسجد خالد بن الوليد، الطابق الثاني..."
                                            value={address.notes}
                                            onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn-primary confirm-btn"
                                onClick={handleFinishOrder}
                                disabled={isSubmitting}
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                {isSubmitting ? 'جاري الحفظ...' : 'إكمال الطلب وتأكيد العنوان'}
                            </button>

                            <p style={{
                                textAlign: 'center',
                                marginTop: '1.5rem',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.85rem'
                            }}>
                                ستتلقى رسالة تأكيد عبر الواتساب بمجرد شحن الجهاز
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ShippingSetup;
