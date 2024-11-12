// Define functions to call API to getAllCars, getCar, createCar, editCar, deleteCar
const API_BASE_URL = "http://localhost:3001"; // Updated base URL with /api prefix

// Get an employee's details
export const getAnEmployeeById= async (eid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employee/${eid}`);
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

// Get all Salons 
// Display list of Salons in homepage
export const getTimeSlotOfAnEmployeeByEmployeeId = async (eid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/timeslot/free/${eid}`);
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

// Get all Salons 
// Display list of Salons in homepage
export const bookASlot = async () => {
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