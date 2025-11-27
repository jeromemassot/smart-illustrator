import React from 'react';
import { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult;
  onReset: () => void;
  onRegenerate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, onRegenerate }) => {
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `illustration-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up mb-12">
      <div className="flex flex-col">
        
        {/* Image Side - Now Top and Prominent */}
        <div className="w-full bg-gray-50 flex flex-col items-center justify-center p-8 md:p-12 border-b border-gray-200">
           <div className="relative w-full max-w-2xl aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-white">
             <img 
               src={result.imageUrl} 
               alt="AI Generated Illustration" 
               className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-[1.02]"
             />
           </div>

           {/* Action Buttons Row */}
           <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-2xl">
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Download Image</span>
              </button>
              
              <button 
                onClick={onRegenerate}
                className="flex items-center space-x-2 py-3 px-6 bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>Regenerate</span>
              </button>
           </div>
        </div>

        {/* Text Side - Now Below */}
        <div className="w-full p-8 md:p-12">
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-indigo-600 font-medium text-sm flex items-center justify-center mx-auto space-x-1 transition-colors"
          >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Start New Creation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;