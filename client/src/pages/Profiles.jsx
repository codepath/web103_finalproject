import React, { useState } from 'react';

function Profiles() {
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'listings'
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    return (
        <div className="lg:max-w-3xl mx-auto mt-16 mb-8 border-2 border-#FF385C rounded-lg p-10">
            <div className=" flex justify-between items-center mb-6 ">
                <button
                    className={`w-full py-2 rounded-md focus:outline-none ${activeTab === 'user' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('user')}
                >
                    User Profile
                </button>
                <button
                    className={`w-full py-2 rounded-md focus:outline-none ${activeTab === 'listings' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('listings')}
                >
                    Listings
                </button>
            </div>

            {activeTab === 'user' && (
                <div className="grid gap-10 ">
                    <p className='text-center'> User Profile </p>
                    <div className="grid grid-cols-2 gap-4 mt-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="first-name">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first-name"
                                name="first-name"
                                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
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
                                type="password"
                                id="password"
                                name="password"
                                className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>


                    <button
                        onClick={({ handleInputChange })}
                        className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Update Profile
                    </button>
                </div>
            )}

            {activeTab === 'listings' && <p className='text-center'> Listings </p>}

            {/* {activeTab === 'listings' && <Listings />} */}
            {/* </div> */}


        </div>
    );
}

export default Profiles;
