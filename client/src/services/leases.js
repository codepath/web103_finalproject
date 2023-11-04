import simpleFetch from "./simpleFetch.js";

const API_URL = "/api/tenees";

const createLeaseListing = async (credentials) => {
    const {
        user_id,
        listing_type,
        tenant_names,
        room_setup,
        appliances,
        amenities,
        preference_gender,
        preference_age,
        other_preferences,
        deal_breakers,
        location,
        rent,
        utilities,
        lease_length,
        start_date,
        pictures,
    } = credentials;

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id,
            listing_type,
            tenant_names,
            room_setup,
            appliances,
            amenities,
            preference_gender,
            preference_age,
            other_preferences,
            deal_breakers,
            location,
            rent,
            utilities,
            lease_length,
            start_date,
            pictures,
        }),
    };

    try {
        const response = await simpleFetch(`${API_URL}/`, options);
        return response;
    } catch (error) {
        throw error;
    }
};

const updateLeaseListing = async (credentials) => {
    const {
        room_setup,
        appliances,
        amenities,
        preference_gender,
        preference_age,
        other_preferences,
        deal_breakers,
        location,
        rent,
        utilities,
        lease_length,
        start_date,
        pictures
    } = credentials;

    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
             room_setup,
        appliances,
        amenities,
        preference_gender,
        preference_age,
        other_preferences,
        deal_breakers,
        location,
        rent,
        utilities,
        lease_length,
        start_date,
        pictures}),
    };

    try {
        const response = await simpleFetch(`${API_URL}/${credentials.id}`, options);
        return response;
    } catch (error) {
        throw error;
    }
}

const deleteLeaseListing = async (id) => {
    const options = {
        method: "DELETE",
    };

    try {
        const response = await simpleFetch(`${API_URL}/${id}`, options);
        return response;
    } catch (error) {
        throw error;
    }
};

const getLeaseListingById = async (id) => {
    try {
        const response = await simpleFetch(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getAllLeaseListings = async () => {
    try {
        const response = await simpleFetch(`${API_URL}/`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getLeaseListingsByUserId = async (userId) => {
    try {
        const response = await simpleFetch(`${API_URL}/user/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getLeaseListingsByLeaseType = async (leaseType) => {
    try {
        const response = await simpleFetch(`${API_URL}/type/${leaseType}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export default {
    createLeaseListing,
    updateLeaseListing,
    deleteLeaseListing,
    getLeaseListingById,
    getAllLeaseListings,
    getLeaseListingsByUserId,
    getLeaseListingsByLeaseType,
};

