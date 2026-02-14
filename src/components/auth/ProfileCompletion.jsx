import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilesAPI from '../../Api/Profiles/profiles.api';

const ProfileCompletion = () => {
    const { profile, setProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        age_range: profile?.age_range || '',
        gender: profile?.gender || '',
        city: profile?.city || '',
        mobile: profile?.mobile || '',
        email: profile?.email || '',
        language: profile?.language || 'ar'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const updateData = {
                ...formData,
                role: 'RegisteredUser'
            };

            const result = await ProfilesAPI.updateProfile(profile.id, updateData);
            setProfile(result.data);
            navigate('/');
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    const inputStyle = {
        padding: '0.65rem 0.8rem',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
        width: '100%',
        fontSize: '0.95rem'
    };

    const labelStyle = {
        marginBottom: '0.2rem',
        fontWeight: '500',
        fontSize: '0.9rem'
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
            <div className="glass-card" style={{
                maxWidth: '550px',
                width: '100%',
                position: 'relative',
                transform: 'none',
                transition: 'none',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                padding: '2.5rem 2rem 2rem'
            }}>
                {/* Skip Button at Top Left */}
                <button
                    type="button"
                    onClick={handleSkip}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'underline',
                        border: 'none',
                        background: 'none',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    تخطي
                </button>

                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.75rem' }}>أكمل ملفك الشخصي</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    يرجى إكمال معلوماتك للحصول على تجربة أفضل
                </p>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.8rem 1rem',
                    alignItems: 'end'
                }}>
                    {/* Row 1: Name and City */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>الاسم</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسمك الكامل"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>المدينة</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="أدخل مدينتك"
                            style={inputStyle}
                        />
                    </div>

                    {/* Row 2: Phone and Email */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>رقم الهاتف</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="+201234567890"
                            style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }}
                        />
                    </div>

                    {/* Row 3: Gender and Age Range */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>الجنس (اختياري)</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="">اختر الجنس</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>الفئة العمرية</label>
                        <select
                            name="age_range"
                            value={formData.age_range}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">اختر الفئة العمرية</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55-64">55-64</option>
                            <option value="65+">65+</option>
                        </select>
                    </div>

                    {/* Row 4: Language (Full Width or span?) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                        <label style={labelStyle}>اللغة المفضلة</label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    {/* Submit Button (Full Width) */}
                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletion;
