import React, { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      q: 'كيف يعمل سرمد في المنزل؟',
      a: 'نقوم بتحليل عادات نومك من خلال أجهزتنا المتطورة المخصصة للاستخدام المنزلي وتقديم تقرير مفصل.'
    },
    {
      q: 'هل أحتاج لمعدات خاصة؟',
      a: 'نوفر لك كافة المعدات اللازمة في حال طلبك لخدمة دراسة النوم المنزلية.'
    },
    {
      q: 'هل الخدمة متاحة للمحترفين فقط؟',
      a: 'لا، خدماتنا مصممة للجميع، من الأفراد الذين يعانون من مشاكل بسيطة إلى الحالات الأكثر تعقيداً.'
    },
    {
      q: 'هل يتم تخزين بياناتي بشكل آمن؟',
      a: 'نعم، نستخدم أعلى معايير التشفير لحماية بياناتك الصحية والخصوصية.'
    }
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-head">
          <div className="badge">الأسئلة الشائعة</div>
          <h2>كل ما تود معرفته عن <span className="gradient-text">سرمد</span></h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
              key={idx}
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-icon">{openIdx === idx ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default FAQ;
