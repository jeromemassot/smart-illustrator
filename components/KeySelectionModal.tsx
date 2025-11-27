import React from 'react';

interface KeySelectionModalProps {
  onSelect: () => void;
}

const KeySelectionModal: React.FC<KeySelectionModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">API Key Required</h3>
        <p className="text-gray-600 mb-6">
          To use the high-quality <strong>Nano Banana Pro</strong> model for illustrations, you need to select a billing-enabled Google Cloud Project API key.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onSelect}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            Connect Google Cloud Project
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Learn about billing and API keys
          </a>
        </div>
      </div>
    </div>
  );
};

export default KeySelectionModal;