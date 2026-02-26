// new ConsultationBooking.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConsultationsAPI from '../Api/Consultations/consultations.api';
import { useToast } from './shared/Toast';
import PaymentModal from './PaymentModal';
import './ConsultationBooking.css';
import { motion, AnimatePresence } from 'framer-motion';

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

const ConsultationBooking = () => {
    const { user, session, profile, loginWithPhone } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [types, setTypes] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Guest Info State
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

    const [selection, setSelection] = useState({
        type: location.state?.selectedType || null,
        specialistId: '',
        slot: null,
        notes: ''
    });

    // Auto-detect country based on IP for guest users
    useEffect(() => {
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

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const typesRes = await ConsultationsAPI.getTypes();
            const fetchedTypes = typesRes.data || [];
            setTypes(fetchedTypes);

            // If we don't have a selection yet, or the passed selection isn't in the list, set a default
            if (!selection.type && fetchedTypes.length > 0) {
                setSelection(prev => ({ ...prev, type: fetchedTypes[0] }));
            } else if (selection.type && fetchedTypes.length > 0) {
                // Ensure the selection object is the one from the fetched list (for references)
                const matchedType = fetchedTypes.find(t => t.id === selection.type.id);
                if (matchedType) {
                    setSelection(prev => ({ ...prev, type: matchedType }));
                }
            }

            const slotsRes = await ConsultationsAPI.getAvailableSlots();
            setSlots(slotsRes.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('حدث خطأ أثناء تحميل البيانات', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeSelect = (type) => {
        setSelection(prev => ({ ...prev, type }));
    };

    const handleSlotSelect = (slot) => {
        setSelection(prev => ({ ...prev, slot }));
    };
    const handleConfirmBooking = async () => {
        if (!selection.type || !selection.slot) {
            showToast('يرجى اختيار نوع الاستشارة وموعد متاح', 'error');
            return;
        }

        if (!user) {
            if (!guestName || !guestPhone) {
                showToast('يرجى إدخال الاسم ورقم الهاتف للمتابعة', 'error');
                return;
            }
            if (guestPhone.length < 8) {
                showToast('يرجى إدخال رقم هاتف صحيح', 'error');
                return;
            }
        }

        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async () => {
        try {
            setSubmitting(true);
            setIsPaymentModalOpen(false);

            if (user) {
                // Logged in user books directly
                const bookingData = {
                    user_id: user.id,
                    type_id: selection.type.id,
                    slot_id: selection.slot.id,
                    specialist_id: selection.slot.specialist_id,
                    scheduled_at: selection.slot.start_time,
                    notes: selection.notes || ''
                };
                await ConsultationsAPI.bookConsultation(bookingData, session.access_token);
                showToast('تم حجز استشارتك بنجاح!', 'success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                // Guest creates booking by phone
                const fullPhone = `${guestCountryCode}${guestPhone.replace(/^0+/, '')}`;

                await ConsultationsAPI.createByPhone({
                    phone: fullPhone,
                    name: guestName,
                    type_id: selection.type.id,
                    slot_id: selection.slot.id,
                    specialist_id: selection.slot.specialist_id,
                    scheduled_at: selection.slot.start_time,
                    notes: selection.notes || ''
                });

                showToast('تم استلام طلبك بنجاح! جاري إرسال رمز التحقق...', 'success');
                await loginWithPhone(fullPhone);

                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            mode: 'VERIFY',
                            mobile: fullPhone,
                            redirectAfterLogin: '/'
                        }
                    });
                }, 1500);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            showToast(error.message || 'فشل عملية الحجز', 'error');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="booking-container"><div className="glass-card">جاري التحميل...</div></div>;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="booking-container">
            <motion.div
                className="booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="booking-header">
                    <h1>احجز استشارتك القادمة</h1>
                    <p>اختر الخدمة والموعد المناسب لبدء رحلة تحسين نومك مع خبرائنا</p>
                </div>

                <div className="booking-grid">
                    <div className="selection-section">
                        {/* Step 1: Select Type */}
                        <div className="step-card">
                            <h3><span className="step-number">١</span> نوع الاستشارة</h3>
                            <div className="types-grid">
                                {types.map(type => (
                                    <div
                                        key={type.id}
                                        className={`type-option ${selection.type?.id === type.id ? 'selected' : ''}`}
                                        onClick={() => handleTypeSelect(type)}
                                    >
                                        <div className="type-info">
                                            <h4>{type.name}</h4>
                                            <p>{type.description}</p>
                                            <small>{type.duration} دقيقة</small>
                                        </div>
                                        <div className="type-price">{type.price} ر.س</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Select Date & Time */}
                        <div className="step-card">
                            <h3><span className="step-number">٢</span> المواعيد المتاحة</h3>
                            {slots.length > 0 ? (
                                <div className="slots-grid">
                                    {slots.map(slot => (
                                        <button
                                            key={slot.id}
                                            className={`slot-btn ${selection.slot?.id === slot.id ? 'selected' : ''}`}
                                            onClick={() => handleSlotSelect(slot)}
                                        >
                                            <div className="slot-date">{formatDate(slot.start_time)}</div>
                                            <div className="slot-time">{formatTime(slot.start_time)}</div>
                                            {slot.specialist && <div className="slot-specialist">مع {slot.specialist.name}</div>}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-slots">لا توجد مواعيد متاحة حالياً. يرجى مراجعة الصفحة لاحقاً.</p>
                            )}
                        </div>

                        {/* Step 3: Booking Info (Notes & Guest details if not logged in) */}
                        <div className="step-card">
                            <h3><span className="step-number">٣</span> بيانات الحجز</h3>

                            {!user && (
                                <div className="guest-info-section" style={{ marginBottom: '20px' }}>
                                    <div className="notes-area" style={{ marginTop: 0 }}>
                                        <label>الاسم الكامل</label>
                                        <input
                                            type="text"
                                            placeholder="أدخل اسمك بالكامل"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                color: 'var(--text-primary)',
                                                marginBottom: '10px'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="notes-area" style={{ marginTop: '10px' }}>
                                        <label>رقم هاتف الجوال (للتواصل والتأكيد)</label>
                                        <div className="phone-input-wrapper" style={{ display: 'flex', gap: '8px', direction: 'ltr' }}>
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
                                        <small style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px', display: 'block', textAlign: 'right', direction: 'rtl' }}>
                                            سنقوم بإرسال رمز تحقق لهذا الرقم لإنشاء حسابك بعد الدفع
                                        </small>
                                    </div>
                                </div>
                            )}

                            <div className="notes-area" style={{ marginTop: !user ? '0' : '10px' }}>
                                <label>ملاحظات إضافية (اختياري)</label>
                                <textarea
                                    placeholder="أخبرنا عن أي تفاصيل ترغب في مناقشتها..."
                                    value={selection.notes}
                                    onChange={(e) => setSelection(prev => ({ ...prev, notes: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        color: 'var(--text-primary)',
                                        resize: 'vertical',
                                        minHeight: '80px'
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Summary Panel */}
                    <div className="booking-summary">
                        <div className="summary-card">
                            <div className="summary-header">
                                <h3>ملخص الحجز</h3>
                            </div>

                            {selection.type && (
                                <div className="summary-item">
                                    <span className="label">الخدمة:</span>
                                    <span className="value">{selection.type.name}</span>
                                </div>
                            )}

                            {selection.slot && (
                                <>
                                    <div className="summary-item">
                                        <span className="label">التاريخ:</span>
                                        <span className="value">{formatDate(selection.slot.start_time)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">الوقت:</span>
                                        <span className="value">{formatTime(selection.slot.start_time)}</span>
                                    </div>
                                    {selection.slot.specialist && (
                                        <div className="summary-item">
                                            <span className="label">الأخصائي:</span>
                                            <span className="value">{selection.slot.specialist.name}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="summary-total">
                                <span className="total-label">الإجمالي:</span>
                                <span className="total-value">{selection.type?.price || 0} ر.س</span>
                            </div>

                            <button
                                className="confirm-booking-btn"
                                onClick={handleConfirmBooking}
                                disabled={submitting || !selection.type || !selection.slot}
                            >
                                {submitting ? 'جاري معالجة الطلب...' : 'الدفع وتأكيد الحجز'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Payment Modal inside Consultation Booking */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={selection.type?.price || 0}
                onComplete={handlePaymentComplete}
            />
        </div>
    );
};

export default ConsultationBooking;
