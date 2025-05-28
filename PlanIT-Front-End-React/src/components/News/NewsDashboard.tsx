import "./NewsDashboardStyle.css";
import { fetchNewsApi } from "./NewsApi";
import { useState, useEffect } from "react";

function NewsDashboard() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const postNews = async () => {
      const headlines = await fetchNewsApi();
      headlines && setNews(headlines);
    };
    postNews();
  }, []);

  if (news.length > 0) {
    return (
      <div className="newsDashboard">
        {news.map((article, index) => (
          <div key={index + 10} className="newsDashboardBlocks">
            <img
              key={index}
              className="newsImage"
              src={article.urlToImage}
              alt="newsImage"
            ></img>
            <a key={index + 1} className="newsTitle" href={article.url}>
              {article.title}
            </a>
            <p key={index + 2} className="newsDescription">
              {article.description}
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default NewsDashboard;
