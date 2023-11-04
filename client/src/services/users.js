import simpleFetch from "./simpleFetch.js";

const API_URL = "/api/users";

const signup = async (credentials) => {
    const { first_name, last_name, email, password } = credentials;
    const university = "";
    const school_year = "";
    const contact_info = "";
    const user_type = "";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            university,
            school_year,
            contact_info,
            user_type,
        }),
    };

    const response = await simpleFetch(`${API_URL}/`, options);
    return response.json();
};

const updateProfile = async (credentials) => {
    const {
        first_name,
        last_name,
        email,
        password,
        university,
        school_year,
        contact_info,
        user_type,
    } = credentials;
    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            university,
            school_year,
            contact_info,
            user_type,
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
