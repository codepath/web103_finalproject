import React, { useEffect, useState } from "react";
import LeasesAPI from "../../services/leases.js";
import LeaseTile from '../../components/LeaseTile'

const ListingsPage = () => {
    const [listings, setListings] = useState([]);

    // Function to fetch listings and update the state
    const fetchListings = async () => {
        try {
            const response = await LeasesAPI.getAllLeaseListings();
            setListings(response); 
        } catch (error) {
            console.error("Error fetching listings: ", error);
        }
    };

    useEffect(() => {
        fetchListings(); 
    }, []);

    return (
        <div>
            <h2>Welcome to the Listings Page!</h2>
            <div>
                {listings.map((listing) => (
                    <LeaseTile key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
};

export default ListingsPage;
