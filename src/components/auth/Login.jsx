import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilesAPI from '../../Api/Profiles/profiles.api';
import { useToast } from '../shared/Toast';
import PoliciesModal from '../PoliciesModal';

const Login = () => {
    const [mode, setMode] = useState('phone'); // 'phone' or 'email'
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+966');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const countries = [
        { code: '+20', name: 'Egypt', flag: 'eg' },
        { code: '+966', name: 'Saudi Arabia', flag: 'sa' },
        { code: '+971', name: 'UAE', flag: 'ae' },
        { code: '+965', name: 'Kuwait', flag: 'kw' },
        { code: '+973', name: 'Bahrain', flag: 'bh' },
        { code: '+968', name: 'Oman', flag: 'om' },
        { code: '+974', name: 'Qatar', flag: 'qa' },
        { code: '+962', name: 'Jordan', flag: 'jo' },
    ];

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('request'); // 'request' or 'verify'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const { loginWithPhone, verifyPhoneOtp, loginWithEmail, verifyEmailOtp, setProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    // Timer logic for OTP resend and back button
    useEffect(() => {
        let interval = null;
        if (step === 'verify' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Auto-detect country based on IP
    useEffect(() => {
        const detectCountry = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                if (data.country_code) {
                    const countryMap = {
                        'EG': '+20',
                        'SA': '+966',
                        'AE': '+971',
                        'KW': '+965',
                        'BH': '+973',
                        'OM': '+968',
                        'QA': '+974',
                        'JO': '+962'
                    };

                    const detectedPrefix = countryMap[data.country_code];
                    if (detectedPrefix) {
                        setCountryCode(detectedPrefix);
                    }
                }
            } catch (error) {
                console.error('Failed to detect country via IP:', error);
                // Fallback is already set to +966 in useState
            }
        };

        detectCountry();
    }, []);

    const from = (location.state?.from?.pathname || '/') + (location.state?.from?.search || '');
    const fromState = location.state?.from?.state || {};

    // Policies modal state
    const [showPoliciesModal, setShowPoliciesModal] = useState(false);
    const [policiesAccepted, setPoliciesAccepted] = useState(false);
    const [consentChecks, setConsentChecks] = useState({
        A: true,
        B: true,
        C: false,
        D: false,
        E: false,
    });

    const mandatoryAccepted = consentChecks.A && consentChecks.B;

    const handleConsentToggle = (key) => {
        setConsentChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLoginRequest = async (e) => {
        e.preventDefault();
        setError('');

        if (!mandatoryAccepted) {
            setError('يرجى الموافقة على البنود الإلزامية للمتابعة');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'phone') {
                // Remove leading zero if present and combine with country code
                const cleanPhone = phone.replace(/^0+/, '');
                const fullPhone = `${countryCode}${cleanPhone}`;

                console.log('Attempting login with phone:', fullPhone); // DEBUG LOG checking format
                const { data, error } = await loginWithPhone(fullPhone);
                console.log('Phone Login Response:', { data, error }); // DEBUG LOG
                if (error) throw error;
                showToast('تم إرسال رمز التحقق إلى هاتفك', 'success');
            } else {
                const { data, error } = await loginWithEmail(email);
                console.log('Email Login Response:', { data, error }); // DEBUG LOG
                if (error) throw error;
                showToast('تم إرسال رمز التحقق إلى بريدك الإلكتروني', 'success');
            }
            // Proceed to verification step for both modes
            setStep('verify');
            setTimer(60); // Start 60s cooldown
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;

        setError('');
        setLoading(true);
        try {
            if (mode === 'phone') {
                const cleanPhone = phone.replace(/^0+/, '');
                const fullPhone = `${countryCode}${cleanPhone}`;
                const { error } = await loginWithPhone(fullPhone);
                if (error) throw error;
                showToast('تم إعادة إرسال رمز التحقق', 'success');
            } else {
                const { error } = await loginWithEmail(email);
                if (error) throw error;
                showToast('تم إعادة إرسال رابط الدخول', 'success');
            }
            setTimer(60); // Reset timer
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إعادة إرسال الرمز');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let data, error;
            let contactValue = '';

            if (mode === 'phone') {
                // Use the same format as login request
                const cleanPhone = phone.replace(/^0+/, '');
                const fullPhone = `${countryCode}${cleanPhone}`;
                contactValue = fullPhone;
                ({ data, error } = await verifyPhoneOtp(fullPhone, otp));
            } else {
                contactValue = email;
                ({ data, error } = await verifyEmailOtp(email, otp));
            }

            if (error) throw error;

            if (data.session) {
                const authUser = data.session.user;

                // Try to get existing profile or create new one
                let profileData = null;
                let isNewUser = false;

                try {
                    const profileResult = await ProfilesAPI.getProfile(authUser.id);
                    profileData = profileResult.data;

                    // Update existing profile if contact info is missing
                    const updatePayload = {};
                    if (mode === 'phone' && !profileData.mobile) updatePayload.mobile = contactValue;
                    if (mode === 'email' && !profileData.email) updatePayload.email = contactValue;

                    if (Object.keys(updatePayload).length > 0) {
                        try {
                            const updated = await ProfilesAPI.updateProfile(authUser.id, updatePayload);
                            profileData = updated.data;
                        } catch (updateErr) {
                            console.error('Failed to update existing profile contact info:', updateErr);
                        }
                    }
                } catch {
                    // Profile doesn't exist, create it
                    isNewUser = true;
                    const newProfileData = {
                        id: authUser.id,
                        name: authUser.user_metadata?.full_name || 'New User',
                        role: 'RegisteredUser',
                        ...(mode === 'phone' ? { mobile: contactValue } : { email: contactValue })
                    };
                    const createResult = await ProfilesAPI.createProfile(newProfileData);
                    profileData = createResult.data;
                }

                setProfile(profileData);

                // Redirect to profile completion for new users or previous page
                if (isNewUser) {
                    navigate('/complete-profile', { state: { from: location.state?.from } });
                } else {
                    console.log(`Redirecting to: ${from} with state:`, fromState);
                    navigate(from, { state: fromState, replace: true });
                }
            }
        } catch (err) {
            setError(err.message || 'رمز التحقق غير صحيح');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>تسجيل الدخول</h2>

                {/* Mode Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                    <button
                        className={`btn-primary-ghost ${mode === 'phone' ? 'active' : ''}`}
                        style={{ backgroundColor: mode === 'phone' ? 'var(--accent-color)' : 'transparent', color: mode === 'phone' ? '#fff' : 'inherit' }}
                        onClick={() => { setMode('phone'); setStep('request'); setError(''); }}
                    >
                        رقم الهاتف
                    </button>
                    <button
                        className={`btn-primary-ghost ${mode === 'email' ? 'active' : ''}`}
                        style={{ backgroundColor: mode === 'email' ? 'var(--accent-color)' : 'transparent', color: mode === 'email' ? '#fff' : 'inherit' }}
                        onClick={() => { setMode('email'); setStep('request'); setError(''); }}
                    >
                        البريد الإلكتروني
                    </button>
                </div>

                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}

                {step === 'request' ? (
                    <form onSubmit={handleLoginRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {mode === 'phone' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>رقم الهاتف</label>
                                <div style={{ display: 'flex', gap: '0.5rem', direction: 'ltr' }}>
                                    {/* Country Code Select - Left in LTR (Right in Arabic mind) */}
                                    {/* Custom Country Selector */}
                                    <div className="custom-country-select" style={{ position: 'relative' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            style={{
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--glass-border)',
                                                background: 'var(--card-bg)',
                                                color: 'var(--text-primary)',
                                                minWidth: '110px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                height: '100%'
                                            }}
                                        >
                                            <img
                                                src={`https://flagcdn.com/w40/${countries.find(c => c.code === countryCode)?.flag}.png`}
                                                alt="flag"
                                                style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <span style={{ direction: 'ltr' }}>{countryCode}</span>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
                                        </button>

                                        {showCountryDropdown && (
                                            <div className="country-dropdown-list" style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '180px',
                                                maxHeight: '250px',
                                                overflowY: 'auto',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                zIndex: 100,
                                                marginTop: '4px',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                {countries.map((country) => (
                                                    <div
                                                        key={country.code}
                                                        onClick={() => {
                                                            setCountryCode(country.code);
                                                            setShowCountryDropdown(false);
                                                        }}
                                                        style={{
                                                            padding: '0.6rem 1rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                            direction: 'ltr',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                    >
                                                        <img
                                                            src={`https://flagcdn.com/w40/${country.flag}.png`}
                                                            alt={country.name}
                                                            style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: country.code === countryCode ? 'bold' : 'normal' }}>
                                                            {country.code}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Local Number Input */}
                                    <input
                                        type="tel"
                                        placeholder="1xxxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text-primary)',
                                            textAlign: 'left'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        textAlign: 'right'
                                    }}
                                    required
                                />
                            </div>
                        )}

                        {/* Consents Section */}
                        <div className="login-consents-section">
                            <div className="login-consents-header">
                                <span>الموافقات والشروط</span>
                                <button
                                    type="button"
                                    className="read-full-policies-link"
                                    onClick={() => setShowPoliciesModal(true)}
                                >
                                    قراءة السياسات كاملة
                                </button>
                            </div>

                            {/* Mandatory */}
                            <label className="login-consent-item mandatory">
                                <input
                                    type="checkbox"
                                    checked={consentChecks.A}
                                    onChange={() => handleConsentToggle('A')}
                                />
                                <div className="login-consent-text">
                                    <span className="login-consent-tag mandatory">إلزامي</span>
                                    أوافق على الشروط والأحكام، وسياسة الخصوصية، وشروط خدمات الرعاية الصحية عن بُعد، وسياسة الشكاوى والاقتراحات، وحقوق المستفيد
                                </div>
                            </label>

                            <label className="login-consent-item mandatory">
                                <input
                                    type="checkbox"
                                    checked={consentChecks.B}
                                    onChange={() => handleConsentToggle('B')}
                                />
                                <div className="login-consent-text">
                                    <span className="login-consent-tag mandatory">إلزامي</span>
                                    أوافق على جمع ومعالجة بياناتي الصحية وبيانات النوم
                                </div>
                            </label>

                            {/* Optional */}
                            <label className="login-consent-item optional">
                                <input
                                    type="checkbox"
                                    checked={consentChecks.C}
                                    onChange={() => handleConsentToggle('C')}
                                />
                                <div className="login-consent-text">
                                    <span className="login-consent-tag optional">اختياري</span>
                                    أوافق على تلقي تذكيرات المواعيد وإشعارات الخدمة
                                </div>
                            </label>

                            <label className="login-consent-item optional">
                                <input
                                    type="checkbox"
                                    checked={consentChecks.D}
                                    onChange={() => handleConsentToggle('D')}
                                />
                                <div className="login-consent-text">
                                    <span className="login-consent-tag optional">اختياري</span>
                                    أوافق على تسجيل الجلسة الصوتية/المرئية
                                </div>
                            </label>

                            <label className="login-consent-item optional">
                                <input
                                    type="checkbox"
                                    checked={consentChecks.E}
                                    onChange={() => handleConsentToggle('E')}
                                />
                                <div className="login-consent-text">
                                    <span className="login-consent-tag optional">اختياري</span>
                                    أوافق على الرسائل التسويقية والكوكيز غير الضرورية
                                </div>
                            </label>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', justifyContent: 'center' }}>
                            {loading ? 'جاري المعالجة...' : (mode === 'phone' ? 'إرسال رمز التحقق' : 'إرسال رابط الدخول')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>رمز التحقق</label>
                            <input
                                type="text"
                                placeholder="XXXXXX"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    textAlign: 'center',
                                    letterSpacing: '5px',
                                    fontSize: '1.2rem'
                                }}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', justifyContent: 'center' }}>
                            {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={timer > 0 || loading}
                                style={{
                                    color: timer > 0 ? 'var(--text-secondary)' : 'var(--accent-color)',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: timer > 0 ? 'not-allowed' : 'pointer',
                                    opacity: timer > 0 ? 0.6 : 1,
                                    background: 'none',
                                    border: 'none',
                                    padding: '5px'
                                }}
                            >
                                {timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : 'إعادة إرسال رمز التحقق'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('request')}
                                disabled={timer > 0 || loading}
                                style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'underline',
                                    fontSize: '0.9rem',
                                    cursor: timer > 0 ? 'not-allowed' : 'pointer',
                                    opacity: timer > 0 ? 0.6 : 1,
                                    background: 'none',
                                    border: 'none',
                                    padding: '5px'
                                }}
                            >
                                {mode === 'phone' ? 'تغيير رقم الهاتف' : 'تغيير البريد الإلكتروني'}
                            </button>
                        </div>
                    </form>
                )}
                {/* Policies Modal */}
                <PoliciesModal
                    isOpen={showPoliciesModal}
                    onClose={() => setShowPoliciesModal(false)}
                    onAgreeAll={() => {
                        setConsentChecks(prev => ({ ...prev, A: true, B: true }));
                        setPoliciesAccepted(true);
                    }}
                />
            </div>
        </div>
    );
};

export default Login;
