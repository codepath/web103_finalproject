import React, { useState } from 'react';
import ProfileListing from './ProfileListing';
import UserIcon from '../jsons/UserIcon.json'

function Profiles() {
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'listings'
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState({
        firstName: false,
        lastName: false,
        address: false,
        city: false,
        state: false,
        zipcode: false,
        email: false,
        password: false,
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
        // Clear the error when the user starts typing in the field
        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };

    const handleUpdateProfile = () => {
        // Check for empty fields and set errors
        const errors = {};
        Object.entries(userData).forEach(([key, value]) => {
            if (value.trim() === '') {
                errors[key] = true;
            }
        });
        setFieldErrors(errors);

        // If no errors, proceed with updating the profile
        if (Object.keys(errors).length === 0) {
            // Add logic to update the profile
            console.log('Profile updated successfully!');
        }
        console.log('unsuccessful')
    };



    return (
        <div className="lg:max-w-5xl mx-auto mt-16 mb-8 border-2 border-#FF385C rounded-lg p-10">
            <div className=" flex justify-between items-center mb-6 ">
                <button
                    className={`w-full py-2 rounded-md focus:outline-none ${activeTab === 'user' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('user')}
                >
                    User Profile
                </button>

                <button
                    className={`w-full py-2 rounded-md focus:outline-none ${activeTab === 'properties' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('properties')}

                >
                    {/* <ListingCard /> */}
                    Properties
                </button>

                
                <button
                    className={`w-full py-2 rounded-md focus:outline-none ${activeTab === 'listings' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('listings')}

                >
                    {/* <ListingCard /> */}
                    Listings
                </button>

              
            </div>

            {activeTab === 'user' && (
                <div className="grid gap-10 ">
                    <p className='text-center'> User Profile </p>
                    <ul className="flex justify-center">
                        {UserIcon.map(icon => (
                            <li key={icon.id} className="">
                                <img src={icon.avatar} alt={`avatar`} className='w-40 h-40 object-cover rounded-full mr-2' />
                                <p>{icon.name}</p>
                            </li>
                        ))}
                    </ul>


                    <div className="grid grid-cols-2 gap-4 mt-5">



                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="first-name">
                                First Name
                            </label>
                            <input
                                required
                                type="text"
                                id="first-name"
                                name="first-name"
                                onChange={handleInputChange}
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="last-name">
                                Last Name
                            </label>
                            <input
                                required
                                type="text"
                                id="last-name"
                                name="last-name"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                Address One
                            </label>
                            <input
                                required
                                type="address"
                                id="address"
                                name="address"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your Address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                Address Two (Optional)
                            </label>
                            <input
                                type="address"
                                id="address"
                                name="address"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your Address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                City
                            </label>
                            <input
                                required
                                type="city"
                                id="city"
                                name="city"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your City"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                State
                            </label>
                            <input
                                required
                                type="state"
                                id="state"
                                name="state"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your State"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="zipcode">
                            Zip Code
                        </label>
                        <input
                            required
                            type="zipcode"
                            id="zipcode"
                            name="zipcode"
                            className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your zipcode"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                id="email"
                                name="email"
                                className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                                Password
                            </label>
                            <input
                                required
                                type="password"
                                id="password"
                                name="password"
                                className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleUpdateProfile}
                        className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Update Profile
                    </button>
                </div>
            )}

            {activeTab === 'listings' && (
                <div>
                    <ProfileListing />
                </div>
            )}

            {activeTab === 'properties' && (
                    <div>
                        properties
                    </div>
                )}


                    </div>
                );
}

export default Profiles;
