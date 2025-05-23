import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsForm from "./NewsForm";
import { toast } from "react-toastify";

const NewsList = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const res = await axios.get("http://localhost:5500/api/newslist");
    setNews(res.data);
  };
 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/delete-news/${id}`);
      toast.success("News deleted successfully!");
      fetchNews();
    } catch (error) {
      toast.error("Failed to delete news. Please try again.");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header */}
      <header className="text-center mb-8 sticky top-0  bg-[#697db7] p-2" style={{zIndex:999999}}>
        <h1 className="text-3xl font-bold text-gray-600 ">News Admin Panel</h1>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Left: Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add News</h2>
          <NewsForm fetchNews={fetchNews} />
        </div>

        {/* Right: News List */}
        {/* <div className="h-[800px] overflow-y-auto pr-2 space-y-4">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between "
            >
              
              <div>
                <hr />
                <h3 className="text-lg font-bold text-gray-800 ">
                  {item.newsTitle}
                </h3>
                
                <p className="text-gray-600 text-[14px] ">{item.shortDescription}</p>
                <p className="text-gray-600 text-[12px]">{item.longDescription}</p>
                <p className="text-gray-600">{item.metaTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-medium">{item.status}</span> |
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>
                <p></p>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4 flex items-start md:items-center">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div> */}

        <div className="max-w-6xl  space-y-6 overflow-y-auto h-[800px]">
          {news.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded shadow">
              {/* Optional Image */}
              <div>
                <img   src={`http://localhost:8080/Images/${item.image}`} alt="News" />

              </div>

              {/* News Title */}
              <h1 className="text-[24px] font-bold text-gray-600 mb-2">
                {item.newsTitle}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-2 justify-between">
                <div>
                  <span className="flex items-center space-x-1">
                    <i className="fas fa-calendar-alt"></i>
                    <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-user"></i>
                      {/* <span>By {item.author || "News Desk"}</span> */}
                      <span>{item.status}</span>
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    {item.slugValue}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              {/* Description */}
              <div className="space-y-3 text-gray-800 text-base leading-relaxed">
                <p className="text-lg">{item.shortDescription}</p>
                <p className="text-sm text-gray-700">{item.longDescription}</p>
                <p className="text-sm text-gray-600 italic">{item.metaTitle}</p>
              </div>

              {/* Footer */}

              {/* Delete Button */}
              <div className="mt-4  flex  gap-4 justify-end ">
                <button className="text-red-600 hover:text-red-800 font-medium">
                  edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsList;
