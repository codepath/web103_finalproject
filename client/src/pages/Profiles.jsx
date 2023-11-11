import React from 'react';

function Profiles() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">User Info</h2>

      <div className="grid grid-cols-1 gap-10 border-2 border-#FF385C p-20 rounded-md">
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="first-name">
            First Name
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="last-name">
            Last Name
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {/* Add a button for updating the profile */}
      <button className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Update Profile
      </button>

        <p className='pt-10'> Listings </p>
    </div>
  );
}

export default Profiles;
