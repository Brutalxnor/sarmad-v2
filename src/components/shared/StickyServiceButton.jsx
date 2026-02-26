import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StickyServiceButton.css';

const StickyServiceButton = ({ serviceType }) => {
    const navigate = useNavigate();
    const { requireAuth } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero section
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const config = {
        'home-test': {
            text: 'اطلب دراسة النوم المنزلية',
            className: 'home-test-btn'
        },
        'expert': {
            text: 'احجز استشارة خبير',
            className: 'expert-btn'
        },
        'program': {
            text: 'اشترك في البرنامج الآن',
            className: 'program-btn'
        }
    };

    const current = config[serviceType] || config['expert'];

    const handleAction = () => {
        requireAuth(() => {
            navigate('/checkout', { state: { activeService: serviceType } });
        });
    };

    return (
        <button
            className={`floating-sticky-cta ${isVisible ? 'visible' : ''} ${current.className}`}
            onClick={handleAction}
            aria-label={current.text}
        >
            <span className="btn-text">{current.text}</span>
            <div className="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </div>
        </button>
    );
};

export default StickyServiceButton;
