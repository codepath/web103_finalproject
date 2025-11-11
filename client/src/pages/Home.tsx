import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header/Nav Placeholder */}
       <header className="flex justify-between items-center p-4 bg-gray-200">
         <div className="w-10 h-10 bg-white rounded-full"></div>
         <div className="text-3xl text-white">☰</div>
       </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center grow p-4">
        {/* Logo & Title Area */}
        <div className="text-center mb-8">
           <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 font-bold">LOGO</div>
           <div className="bg-gray-300 px-12 py-3 rounded text-white text-xl font-bold tracking-wider">BEATDLE</div>
        </div>

        {/* Description Box */}
        <div className="bg-gray-300 p-6 w-full max-w-3xl text-center mb-12 h-32 flex items-center justify-center text-white text-xl">
          Text Description/Game Overview
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 w-full max-w-4xl">
          {/* Play (Daily) Button */}
          <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-4">ICON 1</div>
              <Link to="/daily" className="w-48 h-16 bg-gray-300 flex items-center justify-center text-white text-xl font-semibold rounded hover:bg-gray-400 transition">
                Play
              </Link>
          </div>

           {/* Join (Session) Button */}
           <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-4">ICON 2</div>
              <Link to="/join" className="w-48 h-16 bg-gray-300 flex items-center justify-center text-white text-xl font-semibold rounded hover:bg-gray-400 transition">
                Join
              </Link>
          </div>

           {/* Extras Button */}
           <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-4">ICON 3</div>
              <button className="w-48 h-16 bg-gray-300 flex items-center justify-center text-white text-xl font-semibold rounded hover:bg-gray-400 transition">
                ???
              </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;