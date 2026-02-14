import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="container footer-content">
        {/* Left Column: Social & Brand Info */}
        <div className="footer-col brand-col">
          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-text">سرمد</span>
          </div>
          <p className="brand-desc">
            سرمد هي منصة متكاملة لتحسين أداء النوم، نقدم حلولاً مبنية على العلم لمساعدتك في تحقيق نوم أفضل وحياة أكثر صحة.
          </p>
          <div className="social-icons">
            <div className="social-circle">f</div>
            <div className="social-circle">𝕏</div>
            <div className="social-circle"></div>
          </div>
        </div>

        {/* Middle Right Column: Quick Links */}
        <div className="footer-col">
          <h4>روابط سريعة</h4>
          <ul className="footer-links">
            <li><span className="footer-link" onClick={() => navigate("/education")}>مركز التثقيف</span></li>
            <li><span className="footer-link" onClick={() => navigate("/assessment")}>التقييم المجاني</span></li>
            <li><span className="footer-link" onClick={() => navigate("/services")}>الخدمات</span></li>
            <li><span className="footer-link" onClick={() => navigate("/webinars")}>الندوات</span></li>
            <li><span className="footer-link" onClick={() => navigate("/faq")}>الأسئلة الشائعة</span></li>
          </ul>
        </div>

        {/* Middle Left Column: Services */}
        <div className="footer-col">
          <h4>الخدمات</h4>
          <ul className="footer-links">
            <li><a href="#">استشارة طبية</a></li>
            <li><a href="#">دراسة النوم المنزلية</a></li>
            <li><a href="#">برنامج CBT-I</a></li>
            <li><a href="#">البرامج المؤسسية</a></li>
          </ul>
        </div>

        {/* Right Column: Contact Us */}
        <div className="footer-col contact-col">
          <h4>تواصل معنا</h4>
          <div className="contact-item">
            <span className="contact-info">info@sarmad.sa</span>
            <span className="contact-icon">✉</span>
          </div>
          <div className="contact-item">
            <span className="contact-info" dir="ltr">+966 50 000 0000</span>
            {/* <span className="contact-icon">📞</span> */}
          </div>
          <div className="contact-item">
            <span className="contact-info">الرياض، المملكة العربية السعودية</span>
            {/* <span className="contact-icon">📍</span> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-inner">
          <div className="legal-links">
            <a href="#">إخلاء المسؤولية الطبية</a>
            <a href="#">الشروط والأحكام</a>
            <a href="#">سياسة الخصوصية</a>
          </div>
          <div className="copyright">
            © 2026 سرمد. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
