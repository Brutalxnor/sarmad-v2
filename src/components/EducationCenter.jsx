import React from 'react';
import EducationHero from './EducationHero';
import EducationFilters from './EducationFilters';
import EducationSegments from './EducationSegments';
import EducationGrid from './EducationGrid';
import ConsultationCTA from './ConsultationCTA';

const EducationCenter = () => {
    const [activeCategory, setActiveCategory] = React.useState('all');
    const [activeSegment, setActiveSegment] = React.useState('all');

    return (
        <div className="education-page" data-segment={activeSegment}>
            <EducationHero />
            <div className="container">
                <div className="education-controls">
                    <EducationFilters
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />

                    <EducationSegments
                        activeSegment={activeSegment}
                        setActiveSegment={setActiveSegment}
                    />
                </div>

                <EducationGrid
                    activeCategory={activeCategory}
                    activeSegment={activeSegment}
                />
            </div>
            <ConsultationCTA />
        </div>
    );
};

export default EducationCenter;
