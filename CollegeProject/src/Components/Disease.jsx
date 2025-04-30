import React from 'react';
import DiseaseDetection from './DiseaseDetection';

function Disease() {
  return (
    <div className="min-h-screen bg-gray-50 py-12" id="disease-detection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Plant Disease Detection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system can analyze your plant images to detect diseases and determine their severity levels.
          </p>
        </div>
        
        <DiseaseDetection />
      </div>
    </div>
  );
}

export default Disease;
