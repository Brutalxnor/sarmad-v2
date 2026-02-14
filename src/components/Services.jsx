import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ServicesHero from './services/ServicesHero';
import ExpertService from './services/ExpertService';
import HomeTestService from './services/HomeTestService';
import ProgramService from './services/ProgramService';
import ComingSoon from './shared/ComingSoon';
import StickyServiceButton from './shared/StickyServiceButton';

const Services = () => {
  const location = useLocation();
  const [activeService, setActiveService] = useState(location.state?.activeService || 'expert');

  // Update activeService if location state changes (e.g., clicking header dropdown while on services page)
  React.useEffect(() => {
    if (location.state?.activeService) {
      setActiveService(location.state.activeService);
    }
  }, [location.state]);

  const comingSoonServices = ['program'];
  const serviceDetailsRef = useRef(null);

  const handleServiceChange = (serviceId) => {
    setActiveService(serviceId);
    // Scroll to service details section after a short delay to allow state update
    setTimeout(() => {
      if (serviceDetailsRef.current) {
        serviceDetailsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <ServicesHero
        activeService={activeService}
        setActiveService={handleServiceChange}
        comingSoonServices={comingSoonServices}
      />

      {/* Conditional Sections with ref */}
      <div ref={serviceDetailsRef}>
        {activeService === 'expert' && <ExpertService />}
        {activeService === 'home-test' && <HomeTestService />}
        {activeService === 'program' && (
          comingSoonServices.includes('program')
            ? <ComingSoon title="التدريب والسلوكيات العلاجية" />
            : <ProgramService />
        )}
        <StickyServiceButton serviceType={activeService} />
      </div>
    </div>
  );
};

export default Services;
