import React, { useState, useEffect } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onComplete, amount }) => {
    const [step, setStep] = useState('form'); // form, processing, success
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [cardType, setCardType] = useState('default');

    useEffect(() => {
        if (!isOpen) {
            setStep('form');
            setCardData({ number: '', name: '', expiry: '', cvv: '' });
        }
    }, [isOpen]);

    const handleNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);

        // Detect card type
        if (val.startsWith('4')) setCardType('visa');
        else if (val.startsWith('5')) setCardType('mastercard');
        else if (val.startsWith('9')) setCardType('mada');
        else setCardType('default');

        // Format with spaces
        const formatted = val.match(/.{1,4}/g)?.join(' ') || '';
        setCardData({ ...cardData, number: formatted });
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setCardData({ ...cardData, expiry: val });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep('processing');

        // Simulate processing
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onComplete();
            }, 2000);
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal glass-card no-hover">
                {step === 'form' && (
                    <>
                        <div className="payment-modal-header">
                            <h2>إتمام الدفع الآمن</h2>
                            <p>المبلغ المطلوب: {amount} ر.س</p>
                        </div>

                        <div className={`card-preview ${cardType}`}>
                            <div className="card-chip"></div>
                            <div className="card-number-preview">
                                {cardData.number || '•••• •••• •••• ••••'}
                            </div>
                            <div className="card-details-preview">
                                <div className="card-holder">
                                    <label>Card Holder</label>
                                    <div>{cardData.name || 'FULL NAME'}</div>
                                </div>
                                <div className="card-exp">
                                    <label>Expires</label>
                                    <div>{cardData.expiry || 'MM/YY'}</div>
                                </div>
                            </div>
                        </div>

                        <form className="payment-form" onSubmit={handleSubmit}>
                            <div className="input-group full">
                                <label>رقم البطاقة</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardData.number}
                                    onChange={handleNumberChange}
                                    required
                                />
                            </div>
                            <div className="input-group full">
                                <label>الاسم على البطاقة</label>
                                <input
                                    type="text"
                                    placeholder="الاسم كما هو مكتوب"
                                    value={cardData.name}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="exp-cvv">
                                <div className="input-group">
                                    <label>تاريخ الانتهاء</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={cardData.expiry}
                                        onChange={handleExpiryChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>رمز الأمان (CVV)</label>
                                    <input
                                        type="password"
                                        placeholder="•••"
                                        maxLength="3"
                                        value={cardData.cvv}
                                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary confirm-btn">
                                دفع {amount} ر.س الآن
                            </button>
                            <button type="button" className="btn-text cancel-btn" onClick={onClose}>
                                إلغاء
                            </button>
                        </form>
                    </>
                )}

                {step === 'processing' && (
                    <div className="processing-view">
                        <div className="spinner"></div>
                        <h3>جاري معالجة الدفع...</h3>
                        <p>الرجاء عدم إغلاق الصفحة</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="processing-view">
                        <div className="success-icon">✓</div>
                        <h3>تم الدفع بنجاح!</h3>
                        <p>شكراً لثقتك بنا</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
