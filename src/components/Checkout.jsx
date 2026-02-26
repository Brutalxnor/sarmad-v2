import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './shared/Toast';
import OrdersAPI from '../Api/Orders/orders.api';
import ConsultationsAPI from '../Api/Consultations/consultations.api';
import PaymentModal from './PaymentModal';
import './Checkout.css';

// Countries data for selector
const countries = [
    { code: '+20', name: 'Egypt', flag: 'eg', short: 'EG', placeholder: '1XXXXXXXXX' },
    { code: '+966', name: 'Saudi Arabia', flag: 'sa', short: 'SA', placeholder: '5XXXXXXXX' },
    { code: '+971', name: 'UAE', flag: 'ae', short: 'AE', placeholder: '5XXXXXXXX' },
    { code: '+965', name: 'Kuwait', flag: 'kw', short: 'KW', placeholder: 'XXXXXXXX' },
    { code: '+973', name: 'Bahrain', flag: 'bh', short: 'BH', placeholder: 'XXXXXXXX' },
    { code: '+968', name: 'Oman', flag: 'om', short: 'OM', placeholder: 'XXXXXXXX' },
    { code: '+974', name: 'Qatar', flag: 'qa', short: 'QA', placeholder: 'XXXXXXXX' },
    { code: '+962', name: 'Jordan', flag: 'jo', short: 'JO', placeholder: '7XXXXXXXX' },
];

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, session, profile, loginWithPhone } = useAuth();
    const { showToast } = useToast();

    // Get service type from state
    const serviceType = location.state?.activeService || 'expert';

    const [consultationTypes, setConsultationTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState(null);
    const [loadingTypes, setLoadingTypes] = React.useState(serviceType === 'expert');

    // Guest Info State (Also used for pre-filling logged-in user info for home-test)
    const [guestName, setGuestName] = useState(profile?.name || '');
    const [guestPhone, setGuestPhone] = useState(profile?.mobile ? profile.mobile.replace(/^\+\d{1,3}/, '') : '');
    const [guestCountryCode, setGuestCountryCode] = useState(() => {
        if (profile?.mobile) {
            const detected = countries.find(c => profile.mobile.startsWith(c.code));
            return detected ? detected.code : '+966';
        }
        return '+966';
    });

    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    // Auto-detect country based on IP for guest users
    React.useEffect(() => {
        if (!user) {
            const detectCountry = async () => {
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();
                    if (data.country_code) {
                        const detected = countries.find(c => c.short === data.country_code);
                        if (detected) {
                            setGuestCountryCode(detected.code);
                        }
                    }
                } catch (error) {
                    console.error('Failed to detect country via IP:', error);
                }
            };
            detectCountry();
        }
    }, [user]);

    React.useEffect(() => {
        if (serviceType === 'expert') {
            fetchConsultationTypes();
        }
    }, [serviceType]);

    const fetchConsultationTypes = async () => {
        try {
            const res = await ConsultationsAPI.getTypes();
            setConsultationTypes(res.data || []);
            if (res.data && res.data.length > 0) {
                setSelectedType(res.data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch types:", err);
            showToast("فشل تحميل أنواع الاستشارات", "error");
        } finally {
            setLoadingTypes(false);
        }
    };

    const serviceConfigs = {
        'home-test': {
            title: 'دراسة وتحليل سلوك النوم في المنزل',
            priceStr: '950 ر.س',
            numericPrice: 950,
            description: 'تشمل توصيل الجهاز، تحليل البيانات، وتقرير طبي شامل.'
        },
        'expert': {
            title: selectedType?.name || 'الاستشارات والتوجية الشخصي للنوم',
            priceStr: `${selectedType?.price || 450} ر.س`,
            numericPrice: selectedType?.price || 450,
            description: selectedType?.description || 'جلسة مرئية مع خبير معتمد.'
        },
        'program': {
            title: 'التدريب والسلوكيات العلاجية',
            priceStr: '1800 ر.س',
            numericPrice: 1800,
            description: 'برنامج متكامل لمدة 8 أسابيع (CBT-I).'
        }
    };

    const currentService = serviceConfigs[serviceType] || serviceConfigs['expert'];
    const [customMobile, setCustomMobile] = useState(profile?.mobile || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [address, setAddress] = useState({
        city: profile?.city || '',
        district: '',
        street: '',
        notes: ''
    });

    const handleConfirmBooking = () => {
        const supportsGuest = serviceType === 'home-test';

        if (supportsGuest) {
            if (!guestName || !guestPhone) {
                showToast('يرجى إدخال الاسم ورقم الهاتف للمتابعة', 'error');
                return;
            }
            if (guestPhone.length < 8) {
                showToast('يرجى إدخال رقم هاتف صحيح', 'error');
                return;
            }
            // Address only required for home-test
            if (serviceType === 'home-test' && (!address.city || !address.district || !address.street)) {
                showToast('يرجى إدخال عنوان التوصيل كاملاً', 'error');
                return;
            }
        }

        // Only require login upfront for non-guest services
        if (!user && !supportsGuest) {
            showToast('يرجى تسجيل الدخول أولاً', 'error');
            navigate('/login', { state: { from: location } });
            return;
        }

        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async () => {
        setIsPaymentModalOpen(false);
        setIsSubmitting(true);

        try {
            const isGuestService = serviceType === 'home-test';

            if (isGuestService) {
                showToast('تمت عملية الدفع بنجاح!', 'success');
                const fullPhone = `${guestCountryCode}${guestPhone.replace(/^0+/, '')}`;
                const combinedAddress = [address.city, address.district, address.street].filter(Boolean).join(', ');
                const addressString = serviceType === 'home-test' ? (combinedAddress || 'No address provided') : 'Consultation Order';

                if (!user) {
                    // For guest users, create order via phone API
                    const orderPayload = {
                        phone: fullPhone,
                        name: guestName,
                        address: addressString,
                        total_amount: currentService.numericPrice,
                        currency: 'SAR',
                        payment_method: 'Credit Card',
                        user_notes: address.notes || ''
                    };

                    try {
                        await OrdersAPI.createOrderByPhone(orderPayload);
                        showToast('تم استلام طلبك بنجاح! جاري إرسال رمز التحقق...', 'success');

                        // Request login/signup OTP
                        await loginWithPhone(fullPhone);

                        // Redirect to Login Page in VERIFY mode
                        setTimeout(() => {
                            navigate('/login', {
                                state: {
                                    initialStep: 'verify',
                                    mode: 'phone',
                                    phone: guestPhone.replace(/^0+/, ''),
                                    countryCode: guestCountryCode,
                                    name: guestName,
                                    from: {
                                        pathname: '/',
                                        state: {
                                            serviceType,
                                            amount: currentService.numericPrice,
                                            mobile: fullPhone,
                                            hasPaid: true,
                                            address: address,
                                            selectedType: selectedType
                                        }
                                    }
                                }
                            });
                        }, 2000);
                    } catch (err) {
                        console.error('Guest order or login failed:', err);
                        showToast('حدث خطأ أثناء إتمام الطلب', 'error');
                        setIsSubmitting(false);
                    }
                } else {
                    // Logged in, create order then go to appropriate page
                    const orderPayload = {
                        user_id: user.id,
                        address: addressString,
                        mobile_number: fullPhone,
                        total_amount: currentService.numericPrice,
                        currency: 'SAR',
                        payment_method: 'Credit Card',
                        payment_status: 'Paid',
                        user_notes: address.notes || ''
                    };

                    try {
                        await OrdersAPI.createOrder(orderPayload, session?.access_token);
                        showToast('تم استلام طلبك بنجاح! ستصلك رسالة تأكيد عبر الواتساب.', 'success');

                        setTimeout(() => {
                            navigate('/', {
                                state: {
                                    serviceType,
                                    amount: currentService.numericPrice,
                                    mobile: fullPhone,
                                    hasPaid: true,
                                    address: address
                                }
                            });
                        }, 1500);
                    } catch (err) {
                        console.error('Order creation failed:', err);
                        showToast('حدث خطأ أثناء إرسال الطلب', 'error');
                        setIsSubmitting(false);
                    }
                }
                return;
            }

            // For other services (expert, program), we create the order immediately (user is guaranteed logged in)
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
                if (serviceType === 'expert') {
                    navigate('/book-consultation', { state: { selectedType } });
                } else {
                    navigate('/profile');
                }
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
                            {serviceType === 'expert' && consultationTypes.length > 1 && (
                                <div className="type-selection-area">
                                    <h3>اختر نوع الاستشارة</h3>
                                    <div className="checkout-types-grid">
                                        {consultationTypes.map(type => (
                                            <div
                                                key={type.id}
                                                className={`checkout-type-card ${selectedType?.id === type.id ? 'active' : ''}`}
                                                onClick={() => setSelectedType(type)}
                                            >
                                                <span className="type-name">{type.name || 'استشارة متخصصة'}</span>
                                                <span className="type-price">{type.price} ر.س</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="summary-divider"></div>
                                </div>
                            )}

                            <div className="summary-item main">
                                <div className="service-info">
                                    <h3>{currentService.title}</h3>
                                    <p>{currentService.description}</p>
                                </div>
                                <div className="service-price">
                                    {currentService.priceStr}
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            {/* Collect name and phone for home-test and expert (even for logged in users) */}
                            {(serviceType === 'home-test' || serviceType === 'expert') && (
                                <div className="guest-info-section">
                                    <h3>معلومات التواصل الأساسية (للتأكيد عبر الواتساب)</h3>
                                    <div className="address-form">
                                        <div className="input-group full">
                                            <label>الاسم الكامل</label>
                                            <input
                                                type="text"
                                                placeholder="أدخل اسمك بالكامل"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="input-group full">
                                            <label>رقم هاتف الجوال (للتواصل والتأكيد)</label>
                                            <div className="phone-input-wrapper" style={{ display: 'flex', gap: '8px', direction: 'ltr' }}>
                                                {/* Custom Country Selector */}
                                                <div className="custom-country-select" style={{ position: 'relative' }}>
                                                    <button
                                                        type="button"
                                                        className="country-selector-btn"
                                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                    >
                                                        <img
                                                            src={`https://flagcdn.com/w40/${countries.find(c => c.code === guestCountryCode)?.flag}.png`}
                                                            alt="flag"
                                                        />
                                                        <span>{guestCountryCode}</span>
                                                        <span className="dropdown-arrow">▼</span>
                                                    </button>

                                                    {showCountryDropdown && (
                                                        <div className="country-dropdown-list">
                                                            {countries.map((country) => (
                                                                <div
                                                                    key={country.code}
                                                                    className="country-dropdown-item"
                                                                    onClick={() => {
                                                                        setGuestCountryCode(country.code);
                                                                        setShowCountryDropdown(false);
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`https://flagcdn.com/w40/${country.flag}.png`}
                                                                        alt={country.name}
                                                                    />
                                                                    <span>{country.name} ({country.code})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <input
                                                    type="tel"
                                                    className="phone-input-field"
                                                    placeholder={countries.find(c => c.code === guestCountryCode)?.placeholder || "XXXXXXXXX"}
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                                                    required
                                                />
                                            </div>
                                            {!user && (
                                                <small style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px', display: 'block', textAlign: 'right', direction: 'rtl' }}>
                                                    سنقوم بإرسال رمز تحقق لهذا الرقم لإنشاء حسابك بعد الدفع
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="summary-divider"></div>
                                </div>
                            )}

                            {/* Old contact info section is now redundant for expert/home-test, only hide it if guest info is shown */}
                            {serviceType !== 'home-test' && serviceType !== 'expert' && (
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
                            )}

                            {/* Shipping address is collected UPFRONT for home-test now */}
                            {(serviceType === 'home-test' || (serviceType !== 'home-test' && serviceType !== 'expert')) && (
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
                                {isSubmitting ? 'جاري المعالجة...' : (serviceType === 'home-test' ? 'تأكيد ودفع الآن' : 'تأكيد الحجز والدفع')}
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
