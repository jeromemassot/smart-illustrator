import React, { useState, ChangeEvent } from 'react';
import { AgeRange, GenerationRequest, IllustrationStyle } from '../types';
import { AGE_OPTIONS, STYLE_OPTIONS, TARGET_LANGUAGES } from '../constants';

interface InputSectionProps {
  onGenerate: (req: GenerationRequest) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [sourceType, setSourceType] = useState<'text' | 'url'>('text');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [language, setLanguage] = useState('English');
  const [ageRange, setAgeRange] = useState<AgeRange>(AgeRange.Kids);
  const [style, setStyle] = useState<IllustrationStyle>(IllustrationStyle.Modern);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onGenerate({
      sourceType,
      content,
      language,
      ageRange,
      style
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Educational Illustration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Source Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Source Material</label>
          <div className="flex space-x-4 mb-2">
            <button
              type="button"
              onClick={() => { setSourceType('text'); setContent(''); setFileName(null); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                sourceType === 'text' 
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upload Document
            </button>
            <button
              type="button"
              onClick={() => { setSourceType('url'); setContent(''); setFileName(null); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                sourceType === 'url' 
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Web URL
            </button>
          </div>

          {sourceType === 'text' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
               <input 
                  type="file" 
                  id="file-upload" 
                  accept=".txt,.md,.csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    {fileName ? fileName : "Click to upload text file (.txt, .md)"}
                  </span>
                </label>
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://example.com/article"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required={sourceType === 'url'}
            />
          )}
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Audience */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Audience Age</label>
             <div className="relative">
               <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRange)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               >
                 {AGE_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>
                     {opt.icon} {opt.label}
                   </option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
             </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Target Language</label>
             <div className="relative">
               <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               >
                 {TARGET_LANGUAGES.map((lang) => (
                   <option key={lang} value={lang}>{lang}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
             </div>
          </div>

          {/* Style */}
          <div className="md:col-span-2 space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Illustration Style</label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STYLE_OPTIONS.map((opt) => (
                  <div 
                    key={opt.value}
                    onClick={() => setStyle(opt.value)}
                    className={`cursor-pointer border rounded-lg p-3 text-sm transition-all ${
                      style === opt.value 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{opt.description}</div>
                  </div>
                ))}
             </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={isLoading || !content}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${
            isLoading || !content
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Magic...</span>
            </span>
          ) : (
            "Generate Illustration"
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;