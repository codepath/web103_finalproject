// Define functions to call API to getAllCars, getCar, createCar, editCar, deleteCar
const API_BASE_URL = "https://bookez-server.up.railway.app"; // Updated base URL with /api prefix

// Get all Salons 
// Display list of Salons in homepage
export const getAllSalons = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/salon`);
        if (!response.ok) {
            // console.log("having error");
          throw new Error(`Error fetching cars: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
      }
};

// Get a specific salon by ID
export const getSalonById = async (salonId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/salon/${salonId}`);
      if (!response.ok) {
        throw new Error(`Error fetching salon ${salonId}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching car:", error);
      throw error;
    }
};

// Get all employee of a salon
export const getEmployeesBySalonId = async (salonId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/salon/${salonId}`);
      if (!response.ok) {
        throw new Error(`Error fetching employees ${salonId}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching car:", error);
      throw error;
    }
};