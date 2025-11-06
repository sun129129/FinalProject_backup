import React from 'react';
import AppRoutes from './routes';

function App() {
  return (
    // Use the full screen, with a light gray background
    <div className="min-h-screen bg-gray-100">
      {/* 
        On wider screens, constrain the content to a max-width of a typical phone, 
        center it, and give it a white background and shadow to resemble an app.
        On smaller screens, it will fill the width.
        'mx-auto' handles the centering.
        'h-full' or 'min-h-screen' ensures it takes up the full height.
      */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App; 