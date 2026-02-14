import { useEffect, useRef } from 'react';

const useScrollAnimation = (options = {}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        entry.target.classList.remove('animate-out');
                    } else {
                        entry.target.classList.add('animate-out');
                        entry.target.classList.remove('animate-in');
                    }
                });
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options.threshold, options.rootMargin]);

    return elementRef;
};

export default useScrollAnimation;
