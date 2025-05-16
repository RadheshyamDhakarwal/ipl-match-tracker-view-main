import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const News = () => {
  const [newsList, setNewsList] = useState(null);
  const fetchNews = async () => {
    try {
      const res = await axios.get("/api/cricindia/newsapi.php");
      setNewsList(res.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  useEffect(() => {
    fetchNews();
  }, []);

  const cards = [
    {
      title: "Chopra: RCB were smart in picking players",
      thumbnail: "https://cricindia.com/Images/addtopsection.jpeg",
    },
    {
      title: "Why is spin a win this IPL season?",
      thumbnail: "https://cricindia.com/Images/addtopsection.jpeg",
    },
    {
      title: "What happened to home advantage in IPL 2025?",
      thumbnail: "https://cricindia.com/Images/addtopsection.jpeg",
    },
    {
      title: "Moody praises 'well-coached, well-managed' GT",
      thumbnail: "https://cricindia.com/Images/addtopsection.jpeg",
    },
    {
      title: "Has Pant been LSG’s biggest letdown?",
      thumbnail: "https://cricindia.com/Images/addtopsection.jpeg",
    },
  ];
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <div className="overflow-hidden">
        <div className=" whitespace-nowrap scrollbar-hide mb-4">
          <Link to="https://play.google.com/store/apps/details?id=com.frequentsolution.cric_india&hl=en_IN">
            <img
              src="https://cricindia.com/Images/newsadd.jpeg"
              className="inline-block w-full  mr-2"
              alt="News 1"
            />
          </Link>
          {/* <img
            src="/public/Images/addtopsection.jpeg"
            className="inline-block w-full h-40 mr-2"
            alt="News 2"
          />
          <img
            src="/public/Images/addtopsection2.jpeg"
            className="inline-block w-full h-40 mr-2"
            alt="News 3"
          />
          <img
            src="/public/Images/18197370940294022628.jpeg"
            className="inline-block w-full h-40 mr-2"
            alt="News 4"
          /> */}
        </div>
      </div>

      {newsList?.news?.length === 0 && (
        <p className="text-center text-gray-500">No news available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left/Main News Section */}
        <div className="md:col-span-2 space-y-6">
          <section className="ipl-wrapper">
            <div className="ipl-main-card">
              <div className="ipl-main-img">
                <img
                  src="https://cricindia.com/Images/18197370940294022628.jpeg"
                  className="inline-block w-full  mr-2"
                  alt="News 3"
                />
                <button className="ipl-play-button">dd</button>
                <div className="ipl-main-title">
                  Moody: Ponting, Iyer have turned it around for PBKS
                </div>
              </div>
              <div className="ipl-main-info">
                <h4 className="ipl-heading">
                  Buttler, Bethell, Jacks set to miss IPL playoffs
                </h4>
                <ul className="ipl-bullet-list">
                  <li>Russell, Narine to return ahead of RCB game</li>
                  <li>PBKS wait on Stoinis, Inglis</li>
                  <li>Cummins, Head likely to rejoin SRH</li>
                  <li>Buttler, Coetzee to rejoin GT</li>
                  <li>Updates - Which overseas players are coming back?</li>
                  <li className="font-semibold">
                    Race to playoffs: GT, RCB one win away
                  </li>
                </ul>
              </div>
            </div>

            <div className="ipl-card-row">
              {cards.map((card, i) => (
                <div className="ipl-card" key={i}>
                  <div className="ipl-card-img">
                    <img
                      src="https://cricindia.com/Images/addtopsection.jpeg"
                      alt={card.title}
                    />
                    <button className="ipl-card-play">ddd</button>
                  </div>
                  <div className="ipl-card-title">{card.title}</div>
                </div>
              ))}
            </div>
          </section>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 card-box-outer">
            {newsList.map((news) => (
              <Link
                to={`/news-detail/${news.slugValue}/${news._id}`}
                key={news._id}
                className="block border rounded-lg bg-white hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                 
                  <div className="md:w-1/3 w-full h-48 md:h-auto p-2 ">
                    <img
                      src={`http://localhost:8080/Images/${news.image}`}
                      alt={news.newsTitle}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                
                  <div className="p-4 md:w-2/3">
                    <h3 className="text-md font-bold mb-2 text-gray-600">
                      {news.newsTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(news.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-700">
                      {news.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {newsList?.news?.map((news) => (
              <Link
                to={`/news-detail/${news.slug}`}
                key={news._id}
                className="block border rounded-lg bg-white hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                  {/* News Image */}
                  <div className="md:w-1/1 w-half h-48 md:h-auto p-2 ">
                    <img
                      src={`${news.image}`}
                      alt={news.news_title}
                      className="w-half img-wth object-cover rounded-lg"
                    />
                  </div>
                  {/* News Content */}
                  <div className="p-4 md:w-2/3">
                    <h3 className="text-md font-bold mb-2 text-gray-600">
                      {news.news_title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(news.date_time).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-700">
                      {news.short_description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Right Sidebar Section */}
        <div className="space-y-6">
          <div className="bg-white p-4 shadow-md rounded-lg">
            {/* Example latest photo card */}
            <div className="right-ad-conta iner ">
              <div className="scrolling-ad ">
                <Link to="https://play.google.com/store/apps/details?id=com.frequentsolution.cric_india&hl=en_IN">
                  <img
                    src="https://cricindia.com/Images/newaddlongimg.jpeg"
                    alt="Ad"
                  />
                </Link>
                <img
                  src="https://cricindia.com/Images/newssideadd.jpeg"
                  className="mt-3"
                  alt="Ad Duplicate"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Repeat for more cards */}
          </div>

          {/* Add Section (e.g., ad image) */}
          {/* <div className="bg-white p-2 shadow-md rounded-lg">
            <img
              src="/path-to-ad.jpg"
              alt="Ad"
              className="w-full object-cover rounded"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default News;
