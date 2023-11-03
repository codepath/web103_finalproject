import simpleFetch from "./simpleFetch.js";

const API_URL = "/api/users";

const login = async (credentials) => {
    const { first_name, last_name, email, password } = credentials;
    const response = await simpleFetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password, first_name, last_name }),
    });
    return response.json();
};
