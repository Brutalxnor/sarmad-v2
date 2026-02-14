import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ScrollAnimateSection = ({ children, className = '', animationType = 'default' }) => {
    const ref = useScrollAnimation({ threshold: 0.1 });

    const getAnimationClass = () => {
        switch (animationType) {
            case 'stagger':
                return 'scroll-animate-stagger';
            case 'slide-left':
                return 'scroll-slide-left';
            case 'slide-right':
                return 'scroll-slide-right';
            default:
                return 'scroll-animate';
        }
    };

    return (
        <div ref={ref} className={`${getAnimationClass()} ${className}`}>
            {children}
        </div>
    );
};

export default ScrollAnimateSection;
