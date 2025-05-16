import React from 'react';

const TermsOfUse = () => {
  return (
   <div className='text-gray-600 sm:px-4 sm:py-10 '> 
     <div className="mx-auto sm:w-4/6 px-7">
      <h1 className="text-[20px] font-bold mb-6 text-center text-gray-600">Terms of Use</h1>

      <div className="grid grid-cols-1 gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CricIndia.com, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use the website.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">2. Use of Content</h2>
          <p>
            All content on CricIndia.com, including match data, statistics, articles, logos, and media, is for informational purposes only. Unauthorized use, reproduction, or distribution is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">3. User Conduct</h2>
          <p>
            You agree not to misuse the website, including but not limited to attempting to hack, inject scripts, or disrupt the website’s performance. Comments and interactions must be respectful.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">4. External Links</h2>
          <p>
            CricIndia.com may contain links to external websites. We are not responsible for the content, privacy policies, or practices of third-party websites.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">5. Disclaimer</h2>
          <p>
            CricIndia.com provides cricket data from external APIs. We do not guarantee 100% accuracy or real-time updates. Use the content at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">6. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms at any time. Continued use of the site after changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg text-gray-600 mb-2">7. Contact</h2>
          <p>
            If you have any questions regarding these Terms, please contact us at: <a href="mailto:support@cricindia.com" className="text-blue-600 underline">support@cricindia.com</a>
          </p>
        </section>
      </div>
    </div>
   </div>
  );
};

export default TermsOfUse;
