import React, { useState, useRef, useCallback, useEffect } from 'react';
import './PoliciesModal.css';

import { POLICIES } from '../constants/policiesData';

// ─── Component ────────────────────────────────────────────────────────────────
const PoliciesModal = ({ isOpen, onClose, onAgreeAll, initialTab = 0 }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [readTabs, setReadTabs] = useState({});
    const [scrolledToBottom, setScrolledToBottom] = useState({});
    const [consentChecks, setConsentChecks] = useState({ A: true, B: true, C: false, D: false, E: false });
    const contentRef = useRef(null);

    const handleConsentChange = (key) => {
        setConsentChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const mandatoryConsentsOk = consentChecks.A && consentChecks.B;

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setReadTabs({});
            setScrolledToBottom({});
            setConsentChecks({ A: true, B: true, C: false, D: false, E: false });
        }
    }, [isOpen, initialTab]);

    // Reset scroll when changing tabs
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
            // Check if content is short enough to not need scrolling
            const el = contentRef.current;
            if (el.scrollHeight <= el.clientHeight + 30) {
                setScrolledToBottom(prev => ({ ...prev, [activeTab]: true }));
                setReadTabs(prev => ({ ...prev, [activeTab]: true }));
            }
        }
    }, [activeTab]);

    // Handle scroll
    const handleScroll = useCallback(() => {
        if (!contentRef.current) return;
        const el = contentRef.current;
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        if (isAtBottom && !scrolledToBottom[activeTab]) {
            setScrolledToBottom(prev => ({ ...prev, [activeTab]: true }));
            setReadTabs(prev => ({ ...prev, [activeTab]: true }));
        }
    }, [activeTab, scrolledToBottom]);

    const allRead = POLICIES.every((_, i) => readTabs[i]);
    const readCount = Object.values(readTabs).filter(Boolean).length;
    const progress = (readCount / POLICIES.length) * 100;

    const handleAgree = () => {
        if (!allRead || !mandatoryConsentsOk) return;
        onAgreeAll();
        onClose();
    };

    const handleNextTab = () => {
        // Go to next unread tab, or just next tab
        const nextIdx = activeTab + 1;
        if (nextIdx < POLICIES.length) {
            setActiveTab(nextIdx);
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <div className={`policies-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="policies-modal" onClick={e => e.stopPropagation()}>
                {/* Close */}
                <button className="policies-close-btn" onClick={onClose} title="إغلاق">✕</button>

                {/* Header */}
                <div className="policies-header">
                    <h3>السياسات والشروط</h3>
                    <p>يرجى قراءة جميع السياسات قبل الموافقة</p>
                </div>

                {/* Content */}
                <div className="policies-content-wrapper">
                    <div
                        className="policies-content"
                        ref={contentRef}
                        onScroll={handleScroll}
                    >
                        {POLICIES[activeTab].render(consentChecks, handleConsentChange)}


                        {/* All done indicator on last tab */}
                        {scrolledToBottom[activeTab] && activeTab === POLICIES.length - 1 && (
                            <div className="policies-done-msg">
                                ✓ تمت قراءة جميع السياسات — يمكنك الآن الموافقة
                            </div>
                        )}
                    </div>
                    <div className={`scroll-fade ${scrolledToBottom[activeTab] ? 'hidden' : ''}`} />
                </div>

                {/* Scroll Indicator */}
                <div className={`scroll-indicator ${scrolledToBottom[activeTab] ? 'hidden' : ''}`}>
                    <span>↓</span> مرر للأسفل لقراءة السياسة كاملة
                </div>

                {/* Footer */}
                <div className="policies-footer">
                    <div className="policies-progress">
                        <div className="policies-progress-bar">
                            <div className="policies-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="policies-progress-text">
                            {readCount}/{POLICIES.length} تمت القراءة
                        </span>
                    </div>

                    <div className="policies-footer-actions">
                        <button className="policies-cancel-btn" onClick={onClose}>
                            إلغاء
                        </button>
                        <button
                            className="policies-agree-btn"
                            disabled={!(scrolledToBottom[activeTab] || allRead)}
                            onClick={activeTab < POLICIES.length - 1 ? handleNextTab : handleAgree}
                            style={{
                                background: (scrolledToBottom[activeTab] && activeTab < POLICIES.length - 1)
                                    ? 'linear-gradient(135deg, var(--accent-color), var(--text-secondary))'
                                    : ''
                            }}
                        >
                            {activeTab < POLICIES.length - 1
                                ? scrolledToBottom[activeTab]
                                    ? `التالي: ${POLICIES[activeTab + 1].label}`
                                    : `يرجى القراءة للمتابعة (${readCount}/${POLICIES.length})`
                                : allRead
                                    ? 'أوافق على جميع السياسات'
                                    : `يرجى إكمال القراءة (${readCount}/${POLICIES.length})`
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliciesModal;
