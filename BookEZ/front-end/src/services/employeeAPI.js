// Define functions to call API to getAllCars, getCar, createCar, editCar, deleteCar
const API_BASE_URL = "https://bookez-server.up.railway.app"; // Updated base URL with /api prefix

// Get an employee's details by 
export const getAnEmployeeById= async (eid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employee/${eid}`);
        if (!response.ok) {
            // console.log("having error");
          throw new Error(`Error fetching employee details: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching employee detail:", error);
        throw error;
      }
};

// Get all timeslot of an employee (fetch by employee_id) 
// Display list of timeslots  in appointment-page
export const getTimeSlotOfAnEmployeeByEmployeeId = async (eid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/timeslot/free/${eid}`);
        if (!response.ok) {
            // console.log("having error");
          throw new Error(`Error fetching timeslots: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching timeslot:", error);
        throw error;
      }
};

// Book the timeslot
// Adding a booking to booking database
export const bookThisTimeslot = async (timeSlotBody) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeSlotBody),
    });
    if (!response.ok) {
      throw new Error(`Error booking this timeslot: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log(timeSlotBody);
    return data;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
};

// Update a timeslot is booked