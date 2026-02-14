import React, { useEffect, useState } from 'react';
import ArticleAPI from '../Api/Articles/article.api';
import ArticleCard from './shared/ArticleCard';
import { Link } from 'react-router-dom';

const KnowledgeCenter = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await ArticleAPI.GetAllArticles();
      setArticles(response.data);
    };
    fetchArticles();
  }, []);

  return (
    <section className="knowledge" id="articles">
      <div className="container">
        <div className="section-head-flex">
          <div className="head-text">
            <div className="badge">مركز المعرفة</div>
            <h2>محتوى موثوق <span className="gradient-text">لتحسين نومك</span></h2>
          </div>
          <Link to="/education">
            <button className="view-all">عرض كل المقالات ←</button>
          </Link>
        </div>


        <ArticleCard articles={articles?.slice(0, 3)} />
      </div>

    </section>
  );
};

export default KnowledgeCenter;
