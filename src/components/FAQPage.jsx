import React, { useState, useMemo, useEffect } from 'react';
import './FAQPage.css';
import FaqAPI from '../Api/Faqs/faqs.api';

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openIdx, setOpenIdx] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    console.log("ddddddddd")

    const categories = [
        { id: 'all', title: 'الكل' },
        { id: 'general', title: 'أسئلة عامة' },
        { id: 'sleep', title: 'دراسة النوم' },
        { id: 'security', title: 'الخصوصية والأمان' },
        { id: 'services', title: 'الخدمات والاشتراكات' }
    ];

    const fallbackFaqs = [
        {
            id: 1,
            category: 'general',
            q: 'كيف يعمل سرمد في المنزل؟',
            a: 'نقوم بتحليل عادات نومك من خلال أجهزتنا المتطورة المخصصة للاستخدام المنزلي وتقديم تقرير مفصل يشمل جودة النوم، مراحل النوم المختلفة، وتوصيات مخصصة لتحسين روتينك اليومي.'
        },
        {
            id: 2,
            category: 'sleep',
            q: 'هل أحتاج لمعدات خاصة؟',
            a: 'نوفر لك كافة المعدات اللازمة في حال طلبك لخدمة دراسة النوم المنزلية. الأجهزة سهلة الاستخدام ومصممة لتكون غير مزعجة أثناء النوم لضمان الحصول على بيانات دقيقة وطبيعية.'
        },
        {
            id: 3,
            category: 'general',
            q: 'هل الخدمة متاحة للمحترفين فقط؟',
            a: 'لا، خدماتنا مصممة للجميع. سواء كنت تعاني من أرق مزمن، أو ترغب فقط في تحسين طاقتك اليومية من خلال نوم أفضل، فإن حلولنا تناسب كافة المستويات والأعمار.'
        },
        {
            id: 4,
            category: 'security',
            q: 'هل يتم تخزين بياناتي بشكل آمن؟',
            a: 'نعم، نستخدم أعلى معايير التشفير العالمية (AES-256) لحماية بياناتك الصحية والخصوصية. بياناتك لا يتم مشاركتها أبداً مع أي طرف ثالث دون موافقتك الصريحة.'
        },
        {
            id: 5,
            category: 'services',
            q: 'كيف يمكنني حجز استشارة طبية؟',
            a: 'يمكنك حجز استشارة مباشرة من خلال قسم الخدمات في الموقع. ستظهر لك المواعيد المتاحة لأطباء متخصصين في طب النوم يمكنك التحدث معهم عبر الإنترنت.'
        },
        {
            id: 6,
            category: 'sleep',
            q: 'ما هو برنامج CBT-I؟',
            a: 'هو العلاج السلوكي المعرفي للأرق، وهو المعيار الذهبي عالمياً لعلاج مشاكل النوم دون أدوية. برنامجنا مؤتمت ومدعوم بذكاء اصطناعي ليقودك خطوة بخطوة نحو نوم هادئ.'
        },
        {
            id: 7,
            category: 'security',
            q: 'هل يمكنني حذف بياناتي لاحقاً؟',
            a: 'بكل تأكيد. نحن نؤمن بحق المستخدم في تملك بياناته. يمكنك طلب حذف حسابك وكافة البيانات المرتبطة به في أي وقت من خلال إعدادات الحساب أو التواصل مع الدعم.'
        }
    ];

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setIsLoading(true);
                const response = await FaqAPI.getActiveFaqs();

                if (response.status === 'success' && response.data && response.data.length > 0) {
                    const mappedFaqs = response.data.map(item => ({
                        id: item.id,
                        category: item.category || 'general',
                        q: item.question_ar || item.question_en,
                        a: item.answer_ar || item.answer_en
                    }));
                    setFaqs(mappedFaqs);
                } else {
                    setFaqs(fallbackFaqs);
                }
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
                setFaqs(fallbackFaqs);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const filteredFaqs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, faqs]);

    return (
        <div className="faq-page">
            {/* Hero Section */}
            <section className="faq-hero">
                <div className="container">
                    <div className="badge">مركز المساعدة</div>
                    <h1>الأسئلة <span className="gradient-text">الشائعة</span></h1>
                    <p>تجد هنا إجابات لكل استفساراتك حول تحسين جودة حياتك من خلال النوم</p>

                    <div className="faq-search-wrapper">
                        <div className="faq-search">
                            <input
                                type="text"
                                placeholder="ابحث عن سؤالك هنا..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="faq-main">
                <div className="container">
                    {/* Categories Grid */}
                    <div className="faq-categories">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`faq-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="faq-results">
                        {isLoading ? (
                            <div className="faq-loading">جاري التحميل...</div>
                        ) : filteredFaqs.length > 0 ? (
                            <div className="faq-accordion">
                                {filteredFaqs.map((faq) => (
                                    <div
                                        className={`faq-card ${openIdx === faq.id ? 'open' : ''}`}
                                        key={faq.id}
                                        onClick={() => setOpenIdx(openIdx === faq.id ? null : faq.id)}
                                    >
                                        <div className="faq-card-header">
                                            <h3>{faq.q}</h3>
                                        </div>
                                        <div className="faq-card-body">
                                            <div className="faq-answer-inner">
                                                <p>{faq.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="faq-empty">
                                <h3>عذراً، لم نجد نتائج لـ "{searchQuery}"</h3>
                                <p>حاول استخدام كلمات مفتاحية أخرى أو تصفح الأقسام</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="faq-contact">
                <div className="container">
                    <div className="contact-glass">
                        <h2>لم تجد إجابة لسؤالك؟</h2>
                        <p>فريقنا المتخصص متواجد دائماً لمساعدتك في رحلتك نحو نوم أفضل</p>
                        <button className="btn-primary">تواصل معنا الآن</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
