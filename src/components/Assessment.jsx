import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionAPI from '../Api/Questions/Questions.api';
import Confetti from 'react-confetti';
import AssessmentAPI from '../Api/Assessment/Assessment.api';
import LoadingModal from './shared/LoadingModal';
import { useAuth } from '../context/AuthContext';

const Assessment = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalSteps = questions.length || 0;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await QuestionAPI.GetAllQuestions();

        if (response?.data) setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const answeredCount = Object.keys(answers).length;
  // Progress is based on questions answered. 
  // If we want it to be "Step X of Y", we show progress as (currentStep / totalSteps) * 100 
  // but the user wants it to change according to percentage. 
  // Let's make it more intuitive: Progress = (answeredCount / totalSteps) * 100
  const progress = totalSteps > 0 ? (answeredCount / totalSteps) * 100 : 0;

  const getProgressColor = (pct) => {
    if (pct < 33) return 'linear-gradient(90deg, #fe676e 0%, #fd8f52 100%)'; // Red to Orange
    if (pct < 66) return 'linear-gradient(90deg, #fd8f52 0%, #ffdca2 100%)'; // Orange to Yellow
    return 'linear-gradient(90deg, #35788D 0%, #0096CC 100%)'; // Blue/Green
  };

  const handleOptionSelect = (answerId) => {
    if (isSubmitting || showConfetti) return;
    setAnswers({ ...answers, [currentStep]: answerId });
  };

  const submitAssessment = async (currentUser = user, resumedAnswers = null) => {
    setIsSubmitting(true);
    try {
      const activeAnswers = resumedAnswers || answers;
      const answersArray = Object.values(activeAnswers);
      let totalScore = 0;

      answersArray.forEach(answerUuid => {
        questions.forEach(q => {
          const foundAnswer = q.answers?.find(ans => ans.id === answerUuid);
          if (foundAnswer) {
            const pct = parseInt(
              foundAnswer.percentage ||
              foundAnswer.answer_percentage ||
              foundAnswer.answerPercentage ||
              foundAnswer.points ||
              foundAnswer.score ||
              foundAnswer.value ||
              0
            );
            totalScore += pct;
          }
        });
      });

      let symptoms = "low risk";
      if (totalScore >= 90) symptoms = "insomnia";
      else if (totalScore >= 40) symptoms = "apnea";

      let assessmentId = 'guest';

      if (currentUser && currentUser.id) {
        try {
          const response = await AssessmentAPI.CreateAssessment(answersArray, totalScore, symptoms);
          assessmentId = response?.data?.id || 'guest';
        } catch (apiErr) {
          console.error("Failed to save to DB:", apiErr);
        }
      }

      setIsSubmitting(false);
      setShowConfetti(true);

      setTimeout(() => {
        navigate(`/results?id=${assessmentId}`, {
          state: { answers: activeAnswers, totalScore, symptoms }
        });
      }, 3000);
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

  // Handle return from login
  useEffect(() => {
    if (user && location.state?.resumedAssessment && questions.length > 0) {
      const savedAnswers = location.state.assessmentAnswers;
      setAnswers(savedAnswers);
      // Auto-submit
      submitAssessment(user, savedAnswers);
    }
  }, [user, questions.length]);

  const nextStep = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!user) {
        // Pass the answers to login so we can resume
        navigate('/login', {
          state: {
            from: {
              pathname: '/assessment',
              state: {
                resumedAssessment: true,
                assessmentAnswers: answers
              }
            }
          }
        });
      } else {
        submitAssessment(user);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (isLoading) return (
    <div className="assessment-page">
      <LoadingModal isOpen={true} message="جارٍ تحميل الأسئلة..." />
    </div>
  );

  if (totalSteps === 0) return (
    <div className="assessment-page">
      <div className="sleep-background">
        <div className="nebula-glow" style={{ top: '10%', left: '10%' }}></div>
        <div className="stars-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="assessment-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
          <h2 style={{ color: '#fff', marginBottom: '15px' }}>لا يوجد تقييم متاح حالياً</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>
            عذراً، لم يتم إضافة أي أسئلة للتقييم بعد. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-next"
            onClick={() => navigate('/')}
            style={{ background: 'var(--accent-color)', color: '#fff' }}
          >
            العودة للرئيسية
          </motion.button>
        </motion.div>
      </div>
    </div>
  );

  const currentQuestion = questions[currentStep % questions.length];

  return (
    <div className="assessment-page">
      <div className="sleep-background">
        <div className="nebula-glow" style={{ top: '10%', left: '10%' }}></div>
        <div className="nebula-glow" style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }}></div>
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                '--duration': `${2 + Math.random() * 4}s`,
                '--delay': `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="success-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle, rgba(0, 150, 204, 0.2) 0%, transparent 70%)',
            zIndex: 2000,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              color: '#fff',
              fontSize: '2.5rem',
              fontWeight: 800,
              textShadow: '0 0 20px rgba(0, 150, 204, 0.8)'
            }}
          >
            تم التحليل بنجاح
          </motion.div>
        </motion.div>
      )}

      <LoadingModal isOpen={isSubmitting} message="جارٍ تحليل إجاباتك باحترافية..." />


      <div className="assessment-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="progress-section">
          <div className="progress-texts">
            <span className="progress-percentage">{Math.round(progress)}%</span>
            <span className="progress-label">رحلتك نحو نوم أفضل</span>
            <span className="step-count">الخطوة {currentStep + 1} من {totalSteps}</span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
                background: getProgressColor(progress)
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            ></motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="question-title">{currentQuestion.question}</h2>
            <div className="question-card">
              <div className="options-list">
                {currentQuestion.answers.length ? (
                  currentQuestion.answers.map((ans) => (
                    <motion.label
                      key={ans.id}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(128, 211, 250, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      className={`option-item ${answers[currentStep] === ans.id ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(ans.id)}
                    >
                      <div className="radio-circle">
                        {answers[currentStep] === ans.id && (
                          <motion.div
                            className="radio-inner"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          ></motion.div>
                        )}
                      </div>
                      <span className="option-text">{ans.answer}</span>
                    </motion.label>
                  ))
                ) : (
                  <p>لا توجد خيارات لهذا السؤال</p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="nav-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-prev"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting || showConfetti}
          >
            السابق <span>→</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 150, 204, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-next"
            onClick={nextStep}
            disabled={!answers[currentStep] || isSubmitting || showConfetti}
            style={{
              background: currentStep === totalSteps - 1 ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' : 'var(--text-secondary)',
              color: currentStep === totalSteps - 1 ? '#fff' : 'var(--bg-color)',
              opacity: (isSubmitting || showConfetti) ? 0.7 : 1,
              cursor: (isSubmitting || showConfetti) ? 'not-allowed' : 'pointer'
            }}
          >
            {currentStep === totalSteps - 1 ? 'عرض التحليل النهائي' : 'الخطوة التالية'} <span>←</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
