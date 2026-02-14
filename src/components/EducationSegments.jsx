import React, { useState } from 'react';
import './EducationSegments.css';

const EducationSegments = ({ activeSegment, setActiveSegment }) => {
    const [isOpen, setIsOpen] = useState(false);

    const segments = [
        { id: 'all', title: 'الكل' },
        { id: 'adults', title: 'الكبار' },
        { id: 'teenagers', title: 'المراهقون' },
        { id: 'eldery', title: 'كبار السن' },
        { id: 'children', title: 'الأطفال' },
        { id: 'parents', title: 'أولياء الأمور' },
        { id: 'women', title: ' النساء' }
    ];

    const activeSegmentData = segments.find(s => s.id === activeSegment) || segments[0];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (id) => {
        setActiveSegment(id);
        setIsOpen(false);
    };

    return (
        <div className="education-segments-container">
            <div className={`custom-select-wrapper ${isOpen ? 'is-open' : ''}`}>
                <div className="select-trigger" onClick={toggleDropdown}>
                    <div className="trigger-content">
                        <span className="selected-label">{activeSegmentData.title}</span>
                    </div>
                </div>

                {isOpen && (
                    <div className="select-dropdown">
                        {segments.map((segment) => (
                            <div
                                key={segment.id}
                                className={`select-option ${activeSegment === segment.id ? 'selected' : ''}`}
                                onClick={() => handleSelect(segment.id)}
                            >
                                <span className="option-label">{segment.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isOpen && <div className="select-overlay" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

export default EducationSegments;
