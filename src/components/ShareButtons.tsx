import { useEffect, useState } from "react";
import {
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaTimes,
} from "react-icons/fa";

const ShareDialog = () => {
  const [showModal, setShowModal] = useState(false);
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent("Check this out!");


 useEffect(() => {
    const handleBodyClick = () => {
      setShowModal(false);
    };
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  // Handle social link click: open in new tab + close modal
  const handleShareClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setShowModal(false);
  };

  return (
   <>
      {/* Optional: Visible Share Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent body click event
          setShowModal(true);
        }}
        className="flex items-center gap-2 text-blue-600 font-medium"
      >
        <FaShareAlt className="h-5 w-5" />
     
      </button>

      {/* Share Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)} // close on overlay click
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent modal close on content click
            className="bg-white rounded-lg p-6 w-80 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
              Share this page
            </h2>

            <div className="flex justify-around items-center">
              <button
                onClick={() =>
                  handleShareClick(
                    `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
                  )
                }
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FaFacebookF className="h-6 w-6" />
              </button>

              <button
                onClick={() =>
                  handleShareClick(
                    `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`
                  )
                }
                className="text-blue-400 hover:text-blue-600 transition"
              >
                <FaTwitter className="h-6 w-6" />
              </button>

              <button
                onClick={() =>
                  handleShareClick(
                    `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`
                  )
                }
                className="text-green-600 hover:text-green-800 transition"
              >
                <FaWhatsapp className="h-6 w-6" />
              </button>

              <button
                onClick={() =>
                  handleShareClick(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
                  )
                }
                className="text-blue-800 hover:text-blue-900 transition"
              >
                <FaLinkedinIn className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default ShareDialog;
