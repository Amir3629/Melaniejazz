'use client'

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Redirect to PagesCMS editor
    window.location.href = `https://pagescms.org/editor?repo=Amir3629/Melaniejazz&branch=main`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Redirecting to Content Management System...</h1>
        <p className="text-gray-400">If you are not redirected automatically, please click the button below:</p>
        <a 
          href="https://pagescms.org/editor?repo=Amir3629/Melaniejazz&branch=main" 
          className="inline-block mt-4 bg-[#C8A97E] text-black px-6 py-2 rounded-lg"
        >
          Go to CMS
        </a>
      </div>
    </div>
  );
} 