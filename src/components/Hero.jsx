import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from './services/animations';
import LabIcon from '../assets/Lab.svg';
import ShieldIcon from '../assets/Shield.svg';
import CustomerServiceIcon from '../assets/customer service.svg';
import PersonIcon from '../assets/person.svg';
import MorningVideo from '../assets/morning.mp4';
import NightVideo from '../assets/night.mp4';

const AnimatedText = ({ text, className, delay = 0 }) => {
  const characters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.05,
      },
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === "\n" ? <br /> : char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const Hero = ({ theme }) => {
  const navigate = useNavigate();

  const title1 = "جاهز تفعّل ";
  const title2 = "طاقة النوم الحقيقية؟";

  const subtitle = `ترى النوم ما هو بس "عدد ساعات"...
النوم هو كيف تعيد شحنك، من راسك لقلبك لجسمك ولروحك.

ومهما كان عمرك أو وضعك، عندنا حلول مخصصة لك، نمشي معاك خطوة بخطوة.

من يومك يبتدي... لين تغمض عيونك وأنت مرتاح البال`;

  return (
    <section className="hero" id="home">
      <video autoPlay muted loop playsInline className="hero-video" key={theme}>
        <source src={theme === 'dark' ? NightVideo : MorningVideo} type="video/mp4" />
      </video>
      <div className="hero-bg-overlay"></div>
      <div className="container hero-content">
        <motion.div
          className="hero-text"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h1 variants={fadeInUp}>
            <AnimatedText text={title1} />
            <br />
            <AnimatedText text={title2} className="gradient-text" delay={title1.length * 0.02} />
          </motion.h1>

          <motion.p variants={fadeInUp}>
            <AnimatedText
              text={subtitle}
              delay={0.4}
            />
          </motion.p>

          <motion.div className="hero-btns" variants={fadeInUp}>
            <button className="btn-primary" onClick={() => navigate('/assessment')}>
              ابدأ بالتقييم المجاني
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
