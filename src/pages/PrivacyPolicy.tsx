import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="text-gray-600 sm:px-4 sm:py-12  pt-3">
      <div className=" mx-auto sm:w-4/6 px-7">
        <h2 className="text-[20px] font-bold mb-6    px-7 text-center">
          Privacy Policy for CircIndia.com
        </h2>
        <p className="mb-6">
          At CircIndia, we value and respect the privacy of our users. This
          Privacy Policy outlines how we collect, use, and protect your personal
          information when you visit our website, circindia.com.
        </p>

        <h3 className="text-[18px] font-semibold mb-2">
          1. Information We Collect
        </h3>
        <p className="mb-2">
          We may collect the following types of information when you interact
          with our website:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            <strong>Personal Information:</strong> Your name, email address,
            phone number, and other personal details.
          </li>
          <li>
            <strong>Usage Data:</strong> Your IP address, browser type, device
            info, and visited pages.
          </li>
        </ul>

        <h3 className="text-[18px] font-semibold mb-2">
          2. How We Use Your Information
        </h3>
        <p className="mb-2">We use the information in the following ways:</p>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>To provide and improve our services.</li>
          <li>To respond to your inquiries.</li>
          <li>To personalize your experience.</li>
          <li>To send important updates or policy changes.</li>
        </ul>

        <h3 className="text-[18px] font-semibold mb-2">3. Data Sharing</h3>
        <p className="mb-6">
          We do not share or sell your personal information without your
          consent, unless required by law or necessary to provide requested
          services.
        </p>

        <h3 className="text-[18px] font-semibold mb-2">
          4. Cookies and Tracking Technologies
        </h3>
        <p className="mb-6">
          We may use cookies and similar technologies to enhance your experience
          and analyze traffic.
        </p>

        <h3 className="text-[18px] font-semibold mb-2">
          5. Security of Your Information
        </h3>
        <p className="mb-6">
          We use industry-standard measures to protect your data from
          unauthorized access, alteration, or disclosure.
        </p>

        <h3 className="text-[18px] font-semibold mb-2">6. Your Rights</h3>
        <p className="mb-6">
          You have the right to access, update, or delete your information.
          Contact us at{" "}
          <a
            href="mailto:cricindiamedia@gmail.com"
            className="text-blue-600 underline"
          >
            cricindiamedia@gmail.com
          </a>
          .
        </p>

        <h3 className="text-[18px] font-semibold mb-2">
          7. Changes to This Privacy Policy
        </h3>
        <p className="mb-6">
          We may update this policy. Changes will be posted on this page with
          the updated date.
        </p>

        <h3 className="text-[18px] font-semibold mb-2">8. Contact Us</h3>
        <p>If you have questions or concerns, contact us at:</p>
        <ul className="list-none mt-2">
          <li>
            Email:{" "}
            <a
              href="mailto:cricindiamedia@gmail.com"
              className="text-blue-600 underline"
            >
              cricindiamedia@gmail.com
            </a>
          </li>
          <li>
            Mobile:{" "}
            <a href="tel:+919145892080" className="text-blue-600 underline">
              +91-9145892080
            </a>
          </li>
        </ul>
        <p className="mt-6">
          Thank you for trusting CircIndia with your information.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
