import React from 'react';
import Hero from './Hero';
import JourneySteps from './JourneySteps';
import ServicesGrid from './ServicesGrid';
import KnowledgeCenter from './KnowledgeCenter';
import AssessmentCTA from './AssessmentCTA';
import Webinars from './Webinars';
import FinalCTA from './FinalCTA';
// import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import ScrollAnimateSection from './ScrollAnimateSection';

const Home = ({ theme }) => {
    return (
        <>
            <Hero theme={theme} />
            <ScrollAnimateSection>
                <JourneySteps />
            </ScrollAnimateSection>
            <ScrollAnimateSection>
                <ServicesGrid />
            </ScrollAnimateSection>
            {/* <ScrollAnimateSection>
                <KnowledgeCenter />
            </ScrollAnimateSection> */}
            <ScrollAnimateSection>
                <AssessmentCTA />
            </ScrollAnimateSection>
            <ScrollAnimateSection>
                <Webinars />
            </ScrollAnimateSection>
            <ScrollAnimateSection>
                <FinalCTA />
            </ScrollAnimateSection>
            {/* <ScrollAnimateSection>
                <WhyChooseUs />
            </ScrollAnimateSection> */}
            <ScrollAnimateSection>
                <Testimonials />
            </ScrollAnimateSection>
        </>
    );
};

export default Home;

