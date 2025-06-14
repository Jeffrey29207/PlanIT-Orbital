// A component that displays the fetched news from the news API as a content for the landing page

import "./NewsDashboardStyle.css";
import { fetchNewsApi } from "./NewsApi.ts";
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
              src={article.fields.thumbnail}
              alt="newsImage"
            ></img>
            <a key={index + 1} className="newsTitle" href={article.webUrl}>
              {article.webTitle}
            </a>
            <p key={index + 2} className="newsDescription">
              {article.fields.trailText}
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default NewsDashboard;
