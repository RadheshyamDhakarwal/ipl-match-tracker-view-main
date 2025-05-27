import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Spinner from "./Spinner";
import { FaShareAlt, FaShareAltSquare } from "react-icons/fa";

const NewsDetails = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [latestNews, setLatest] = useState(null);
  const [news, setNews] = useState(null);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const fetchNewsList = async () => {
    try {
      const res = await fetch(`/api/cricindia/newsapi.php`);
      const data = await res.json();
      setLatest(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNewsList();
  }, [id]);

  const handleClick = (item) => {
    setNews(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const IsJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const res = await fetch(`/api/cricindia/newsapi.php`);
        const data = await res.json();
        const matchedNews = data.news.find(
          (item) => item.id === id || item.slug === slug
        );
        setNews(matchedNews);
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };
    setLoading(true);
    fetchNewsDetails();
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "";
    };
  }, [slug, id]);

  if (!loading || !news)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg font-medium">
        <Spinner />
      </div>
    );
  return (
    <div className="mt-12 ">
      <div className="max-w-[1100px] mx-auto px-4  shadow-lg">
        {/* <h4 className=" text-[#223577]  text-[24px] font-bold">News</h4> */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-3"
        >
          {/* Left: Match/News Details (9 columns) */}

          <div className="md:col-span-9">
            <h1 className="text-[24px] font-bold text-[#4B5563] mb-1">
              {news.news_title}
            </h1>
            <p className="text-[14px]  text-gray-600 mb-1">
              {news.short_description}
            </p>
            <div className="flex items-center gap-6 text-gray-600 mb-1">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {new Date(news.date_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            <span> <FaShareAlt className="text-blue-600 h-8 w-5" /></span>
            </div>
            {news.is_display == 1 && (
              <img
                src={`${news.image}`}
                alt={news.news_title}
                // height={400}
                // style={{ height: "400px" }}
                className="w-full  rounded mb-2 object-cover"
              />
            )}

            {/* <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {news.long_description}
            </div> */}

            <div
              className="news-content text-lg leading-relaxed text-gray-800 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(news.long_description),
              }}
            ></div>
            {news?.scorecard_link && (
              <Link
                to={`/match-preview/${slug}/${news?.scorecard_link}`}
                state={{
                  teamInfo:
                    news?.data && IsJsonString(news.data)
                      ? JSON.parse(news.data)?.teamInfo
                      : [],
                }}
                // ← Send data here
              >
                <div className="text-blue-600  hover:text-[#223577] cursor-pointer">
                  Full Scorecard
                </div>
              </Link>
            )}
            <hr className="my-4" />

            {/* <div className="text-gray-800">
              {news?.data}
            </div> */}
          </div>

          {/* Right: Latest News (3 columns) */}
          <div className="md:col-span-3 shadow-lg p-2">
            <h2 className="text-xl font-semibold mb-4 text-[#4B5563]">
              Latest News
            </h2>
            <div className="space-y-4">
              {latestNews?.news?.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className={`border rounded p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition
                  `}
                  onClick={() => handleClick(item)}
                >
                  <div className=" rounded-lg">
                    {news?.is_display === 1 && (
                      <img
                        src={`${item.image}`}
                        alt=""
                        className="rounded-md"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-[#4B5563] line-clamp-2 mt-1">
                    {item.news_title}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(news.date_time).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
