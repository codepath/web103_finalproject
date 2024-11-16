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

// Cancel the reservation
// Display list of Salons in homepage
export const cancelThisTimeSlot = async (timeSlotId, bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/timeslot/cancel/${timeSlotId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(timeSlotBody),
    });
    if (!response.ok) {
      throw new Error(`Error cancel this timeslot from time_slots tablet: ${response.statusText}`);
    }

    const response1 = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
      method: "DELETE",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify(timeSlotBody),
    });
    if (!response1.ok) {
      throw new Error(`Error cancel this reservation from booking tablet: ${response.statusText}`);
    }

    // const data = await response.json();
    // console.log(timeSlotId);
  //   console.log(timeSlotBody);
    // return data;
  } catch (error) {
    console.error("Error canceling reservation from booking table:", error);
    throw error;
  }
};

// Get a timeslot by id
export const getATimeSlotById = async (tid) => {
  try {
      const response = await fetch(`${API_BASE_URL}/api/timeslot/${tid}`);
      if (!response.ok) {
          // console.log("having error");
        throw new Error(`Error fetching timeslot: ${response.statusText}`);
      }
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching timeslot:", error);
      throw error;
    }
};