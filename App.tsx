import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultDisplay from './components/ResultDisplay';
import KeySelectionModal from './components/KeySelectionModal';
import { GenerationRequest, GenerationResult } from './types';
import { ensureApiKeySelected, generateContent } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [lastRequest, setLastRequest] = useState<GenerationRequest | null>(null);

  // Check key status on mount
  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleKeySelect = async () => {
    try {
      const win = window as any;
      if (win.aistudio) {
        await win.aistudio.openSelectKey();
        setHasKey(true);
        setShowKeyModal(false);
      }
    } catch (e) {
      console.error("Key selection failed", e);
      setError("Failed to select API key. Please try again.");
    }
  };

  const handleGenerate = async (request: GenerationRequest) => {
    setLastRequest(request);
    // Clear result to show loading state in InputSection or separate loader
    setResult(null); 
    setError(null);
    setLoading(true);

    try {
      // 1. Ensure Key is selected (Nano Banana Pro Requirement)
      const validKey = await ensureApiKeySelected();
      if (!validKey && !hasKey) {
        // Fallback if the direct helper didn't force the UI or failed
        setShowKeyModal(true);
        setLoading(false);
        return;
      }
      setHasKey(true);

      // 2. Process
      const data = await generateContent(request);
      setResult(data);

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        // Key might be invalid or project not found, force re-selection
        setHasKey(false);
        setShowKeyModal(true);
        setError("The selected API Key seems invalid or expired. Please select a valid project.");
      } else {
        setError(err.message || "An unexpected error occurred while generating content.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setLastRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="logo.jpeg" 
              alt="Med Illustrations Creator Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Med Illustrations Creator
            </h1>
          </div>
          
          {hasKey && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Project Connected</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Intro */}
        {!result && !loading && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              Turn Medical Docs into <br/>
              <span className="text-indigo-600">Simple Illustrations</span>
            </h2>
            <p className="text-xl text-gray-500">
              Upload a document or link a URL. We'll summarize it and create a custom visual explanation tailored to your audience using AI.
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {result ? (
            <ResultDisplay 
              result={result} 
              onReset={handleReset} 
              onRegenerate={handleRegenerate}
            />
          ) : (
            <InputSection onGenerate={handleGenerate} isLoading={loading} />
          )}
        </div>
      </main>

      {/* API Key Modal - displayed if logic demands it */}
      {showKeyModal && !hasKey && (
        <KeySelectionModal onSelect={handleKeySelect} />
      )}
    </div>
  );
};

export default App;