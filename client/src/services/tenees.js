import simpleFetch from "./simpleFetch.js";

const API_URL = "/api/tenees";

const createTeneesProfile = async (credentials) => {
    const {
        gender,
        age,
        bio,
        hobbies_interests,
        preferences,
        deal_breakers,
        budget_min,
        budget_max,
        picture,
        user_id,
    } = credentials;

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            gender,
            age,
            bio,
            hobbies_interests,
            preferences,
            deal_breakers,
            budget_min,
            budget_max,
            picture,
            user_id,
        }),
    };

    try {
        const response = await simpleFetch(`${API_URL}/`, options);
        return response;
    } catch (error) {
        throw error;
    }
};

const updateTeneesProfile = async (credentials) => {
    const {
        gender,
        age,
        bio,
        hobbies_interests,
        preferences,
        deal_breakers,
        budget_min,
        budget_max,
        picture,
    } = credentials;
    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            gender,
            age,
            bio,
            hobbies_interests,
            preferences,
            deal_breakers,
            budget_min,
            budget_max,
            picture,
        }),
    };

    try {
        const response = await simpleFetch(
            `${API_URL}/${credentials.id}`,
            options
        );
        return response;
    } catch (error) {
        throw error;
    }
};

const deleteTeneesProfile = async (id) => {
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

const getTeneesProfileById = async (id) => {
    try {
        const response = await simpleFetch(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getAllTeneesProfiles = async () => {
    try {
        const response = await simpleFetch(`${API_URL}/`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getTeneesProfileByUserId = async (userId) => {
    try {
        const response = await simpleFetch(`${API_URL}/user/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export {
    createTeneesProfile,
    updateTeneesProfile,
    deleteTeneesProfile,
    getTeneesProfileById,
    getAllTeneesProfiles,
    getTeneesProfileByUserId,
};

