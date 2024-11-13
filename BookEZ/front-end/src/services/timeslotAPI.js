// Define functions to call API to getAllCars, getCar, createCar, editCar, deleteCar
const API_BASE_URL = "http://localhost:3001"; // Updated base URL with /api prefix

// Get all Salons 
// Display list of Salons in homepage
export const reserveThisTimeSlot = async (timeSlotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timeslot/book/${timeSlotId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(timeSlotBody),
      });
      if (!response.ok) {
        throw new Error(`Error booking this timeslot: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(timeSlotId);
    //   console.log(timeSlotBody);
      return data;
    } catch (error) {
      console.error("Error adding booking:", error);
      throw error;
    }
  };
  