import React, { useState } from 'react';

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setFileName('No file chosen');
      setPreview(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use the appropriate URL based on environment
      const backendUrl = 'http://127.0.0.1:5000/predict';
      console.log('Sending request to:', backendUrl);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with boundary
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }
      
      setResults(data);
    } catch (error) {
      console.error('Error during prediction:', error);
      setError(error.message || 'Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-600 mb-2">Plant Disease Detection</h2>
        <p className="text-gray-600">Upload an image of a plant leaf to detect diseases and their severity</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              id="file-input" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
            <label 
              htmlFor="file-input" 
              className="flex flex-col items-center cursor-pointer"
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-48 object-contain mb-4"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
              <span className="text-green-600 font-medium">Choose a file</span>
              <span className="text-gray-500 text-sm mt-1">{fileName}</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </form>
      </div>
      
      {isLoading && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Analyzing your image...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 p-4">
            <h3 className="text-xl font-bold text-white">Analysis Results</h3>
            {results.mode === 'test' && (
              <p className="text-white text-sm mt-1">Running in test mode (using mock predictions)</p>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Disease</h4>
                <p className="text-2xl font-bold text-green-600">{results.disease}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Severity</h4>
                <p className="text-2xl font-bold text-green-600">{results.severity.toFixed(2)}%</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(results.severity, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection; 