import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../services/animations';

const ComingSoon = ({ title, subtitle }) => {
  return (
    <div className="coming-soon-view">
      <div className="container">
        <motion.div
          className="coming-soon-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="coming-soon-glass">
            <div className="coming-soon-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="coming-soon-title">{title || "هذه الخدمة قادمة قريباً"}</h2>
            <p className="coming-soon-subtitle">
              {subtitle || "نحن نضع اللمسات الأخيرة لنقدم لك تجربة استثنائية تساعدك على تحسين جودة حياتك من خلال نوم أفضل."}
            </p>
            <div className="coming-soon-status">
              <span className="pulse-dot"></span>
              جاري العمل على التجهيز
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .coming-soon-view {
          padding: 120px 0;
          position: relative;
          overflow: hidden;
          background: var(--bg-color);
        }

        .coming-soon-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .coming-soon-glass {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: 40px;
          padding: 80px 40px;
          box-shadow: var(--shadow);
          position: relative;
        }

        .coming-soon-icon {
          width: 100px;
          height: 100px;
          background: var(--accent-gradient);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 150, 204, 0.2);
        }

        .coming-soon-icon svg {
          width: 50px;
          height: 50px;
        }

        .coming-soon-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .coming-soon-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .coming-soon-status {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 184, 0, 0.1);
          color: #FFB800;
          padding: 12px 24px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.95rem;
          border: 1px solid rgba(255, 184, 0, 0.3);
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: #FFB800;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          box-shadow: 0 0 0 0 rgba(255, 184, 0, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 184, 0, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 184, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 184, 0, 0); }
        }

        @media (max-width: 768px) {
          .coming-soon-view {
            padding: 80px 0;
          }
          .coming-soon-glass {
            padding: 50px 20px;
            border-radius: 30px;
          }
          .coming-soon-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 30px;
          }
          .coming-soon-icon svg {
            width: 40px;
            height: 40px;
          }
          .coming-soon-title {
            font-size: 2rem;
          }
          .coming-soon-subtitle {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .coming-soon-view {
            padding: 60px 0;
          }
          .coming-soon-glass {
            padding: 40px 16px;
            border-radius: 24px;
          }
          .coming-soon-icon {
            width: 70px;
            height: 70px;
            margin-bottom: 25px;
            border-radius: 20px;
          }
          .coming-soon-icon svg {
            width: 35px;
            height: 35px;
          }
          .coming-soon-title {
            font-size: 1.75rem;
            margin-bottom: 16px;
          }
          .coming-soon-subtitle {
            font-size: 1rem;
            margin-bottom: 30px;
          }
          .coming-soon-status {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 360px) {
          .coming-soon-view {
            padding: 50px 0;
          }
          .coming-soon-glass {
            padding: 35px 14px;
            border-radius: 20px;
          }
          .coming-soon-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
            border-radius: 16px;
          }
          .coming-soon-icon svg {
            width: 30px;
            height: 30px;
          }
          .coming-soon-title {
            font-size: 1.6rem;
            margin-bottom: 14px;
          }
          .coming-soon-subtitle {
            font-size: 0.95rem;
            margin-bottom: 25px;
          }
          .coming-soon-status {
            padding: 9px 18px;
            font-size: 0.85rem;
          }
          .pulse-dot {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
