import expertImg from '../assets/service_expert_consultation.png';
import homeTestImg from '../assets/service_home_test.png';
import programImg from '../assets/service_sleep_program.png';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer } from './services/animations';
import './services/services-hero.css';


const ServicesGrid = () => {
  const navigate = useNavigate();
  const comingSoonServices = ['program'];

  return (
    <section className="services" id="services">
      <div className="container">
        <motion.div
          className="section-head"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          <h2>تعرف على خدماتنا </h2>
          <p>خدمات مبنية على أسس علمية تساعدك تحسّن جودة نومك بشكل فعلي.</p>
        </motion.div>

        <motion.div
          className="services-cards"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {/* Card 1: Home Sleep Study */}
          <motion.div
            className="service-card"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="service-icon text-center">
              <img src={homeTestImg} alt="دراسة وتحليل سلوك النوم في المنزل" className="service-img" />
            </div>
            <div className="card-text">
              <h3>دراسة وتحليل سلوك النوم في المنزل.</h3>
              <p>ابدأ من هنا لو تبغى تفهم جودة نومك أو تعاني من اضطرابات وتبغى تشخيص مبدئي.
لا أسلاك. ولا غرف انتظار. فقط جهاز صغير يوصل لباب بيتك، تلبسه ليلة وحدة بدون تعب، ويسجّل بيانات نومك بكل سلاسة.</p>
              <ul className="service-checklist">
                <li><span className="check-mark">✓</span> جهاز مراقبة احترافي</li>
                <li><span className="check-mark">✓</span> تحليل طبي شامل</li>
                <li><span className="check-mark">✓</span> تقرير مفصل مع توصيات</li>
              </ul>
              <button className="service-btn" onClick={() => navigate('/services')}>أطلب دراسة النوم المنزلية <span>←</span></button>
            </div>
          </motion.div>

          {/* Card 2: Specialist Consultation */}
          <motion.div
            className="service-card"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="service-icon text-center">
              <img src={expertImg} alt="الاستشارات والتوجية الشخصي للنوم" className="service-img" />
            </div>
            <div className="card-text">
              <h3> الاستشارات والتوجية الشخصي للنوم</h3>
<p>خدمة مصممة لك إذا عندك نتائج أو تحديات وتحتاج توجيه مباشر. 

تعاني من صعوبة بالنوم؟

جلسة عن بُعد مع خبير يساعدك تفهم مشكلتك، ويقترح خطوات علمية مخصصة. وتفهم نتائجك بشكل واضح.</p>
              <ul className="service-checklist">
                <li><span className="check-mark">✓</span> تقييم شامل لأنماط النوم</li>
                <li><span className="check-mark">✓</span> خطة علاجية مخصصة</li>
                <li><span className="check-mark">✓</span> متابعة لمدة شهر</li>
              </ul>
              <button className="service-btn" onClick={() => navigate('/services')}>احجز استشارتك <span>←</span></button>
            </div>
          </motion.div>

          {/* Card 3: CBT-I Program */}
          <motion.div
            className={`service-card ${comingSoonServices.includes('program') ? 'coming-soon' : ''}`}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {comingSoonServices.includes('program') && (
              <div className="coming-soon-badge">قريباً</div>
            )}
            <div className="service-icon text-center">
              <img src={programImg} alt="التدريب والسلوكيات العلاجية" className="service-img" />
            </div>
            <div className="card-text">
              <h3>التدريب والسلوكيات العلاجية </h3>
<p>
علاج النوم السلوكي المعرفي (CBT-I)
العلاج الأهم عالمياً للأرق المزمن، معتمد على جلسات منظمة وسلوكيات مثبتة علمياً.
برامج لفئات محددة
مثل الحوامل، كبار السن، الرياضيين، رواد الأعمال، وغيرهم.
</p>
              <ul className="service-checklist">
                <li><span className="check-mark">✓</span> 8 جلسات علاجية</li>
                <li><span className="check-mark">✓</span> تمارين وواجبات منزلية</li>
                <li><span className="check-mark">✓</span> تطبيق متابعة يومي</li>
              </ul>
              <button className="service-btn" onClick={() => navigate('/services')}>أبدأ بالبرنامج <span>←</span></button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
