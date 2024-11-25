// Define functions to call API
// Updated base URL with /api prefix
const API_BASE_URL = "https://bookez-server.up.railway.app";

// Get an user's details (username, fullname, email, phone numbers)
export const getUserInfoById= async (uid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/${uid}`);
        if (!response.ok) {
            // console.log("having error");
          throw new Error(`Error fetching user details: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching user detail:", error);
        throw error;
      }
};

// Update user details (username, fullname, email, phone numbers)
export const submitEdittedInfo = async (timeSlotId, userInfoBody) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${timeSlotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfoBody),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
    //   console.log(timeSlotId);
    //   console.log(timeSlotBody);
      return data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
};

// Get all upcoming appointments of that user by userId
export const getAllUpcomingAppointments= async (uid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/booking/user/${uid}`);
        // console.log(response);
        if (!response.ok) {
            // console.log("having error");
          throw new Error(`Error fetching upcoming appointments details: ${response.statusText}`);
        } 
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching upcoming appointments detail:", error);
        throw error;
      }
};