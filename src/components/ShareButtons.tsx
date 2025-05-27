import { useState } from "react";
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

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-blue-600 font-medium "
      >
        <FaShareAlt className="h-5 w-5" />
       
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 relative">
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
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                <FaFacebookF className="h-6 w-6" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                <FaTwitter className="h-6 w-6" />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800"
              >
                <FaLinkedinIn className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareDialog;
