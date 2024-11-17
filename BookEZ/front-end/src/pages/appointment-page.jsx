import "../css/appointment-page.css";
import { useEffect, useState } from "react";
// import employees from "../data/employees-mock-data";
import { useParams } from "react-router-dom";
// import employeeTimeSlots from "../data/employee-appointment";
import {
  bookThisTimeslot,
  getAnEmployeeById,
  getTimeSlotOfAnEmployeeByEmployeeId,
} from "../services/employeeAPI";
import { reserveThisTimeSlot } from "../services/timeslotAPI";

const AppointmentPage = ({ currentUserId }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeId, setEmployeeId] = useState();
  const [SalonId, setSalonId] = useState();
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [errorEmployee, setErrorEmployee] = useState("");
  const [reservedOnce, setReservedOnce] = useState(false);

  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotId, setTimeSlotId] = useState();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(true);
  const [errorTimeSlots, setErrorTimeSlots] = useState("");

  const { eid } = useParams();

  useEffect(() => {
    // We will replace endpoint to get employee details here
    const getAnEmployee = async () => {
      setLoadingEmployee(true);
      try {
        const employee = await getAnEmployeeById(eid);
        setEmployeeName(employee.name);
        setEmployeeRole(employee.role);
        setEmployeeId(employee.id);
        setSalonId(employee.salon_id);
        // console.log(employee);
        // setEmployeeList(employees);
      } catch (err) {
        setErrorEmployee("Failed to fetch this employee for this salon!");
      } finally {
        setLoadingEmployee(false);
      }
    };

    getAnEmployee();
  }, [eid]);

  useEffect(() => {
    const getEmployeeTimeSlot = async () => {
      setSelectedTimeSlot("");
      setLoadingTimeSlots(true);
      try {
        const timeSlotList = await getTimeSlotOfAnEmployeeByEmployeeId(eid);
        // const slots = timeSlotList.map(slot => );
        setTimeSlots(timeSlotList);
      } catch (err) {
        setErrorTimeSlots("Failed to fetch this employee for this salon!");
      } finally {
        setLoadingTimeSlots(false);
        console.log(timeSlots);
      }
    };

    getEmployeeTimeSlot();
  }, [eid, reservedOnce]);

  const reserveAppointment = async () => {
    alert(
      "You reserved timeslot " +
        selectedTimeSlot +
        " for worker " +
        employeeName
    );

    const timeSlotBody = {
      user_id: currentUserId,
      salon_id: SalonId,
      employee_id: employeeId,
      time_slot_id: timeSlotId
    }

    try {
      await bookThisTimeslot(timeSlotBody);
      await reserveThisTimeSlot(timeSlotId);
      console.log("Booking added successfully", timeSlotBody);
      setReservedOnce(true);
    } catch (error) {
      console.error("Error adding booking", error);
    }
  };

  return (
    <>
      <div className="appointment-page-employee-details">
        {
          loadingEmployee 
          ?
          <h1>Loading employee list...</h1>
          : errorEmployee ?
          <h1>Loading employee list error!!</h1>
          :
          <>
            <h1>{employeeName}</h1>
            <h3>{employeeRole}</h3>
          </>
        }
      </div>
      
      <div className="appointment-reservation">
        <div className="list-of-timeSlot">
          {loadingTimeSlots 
            ? 
            <h1>Loading time slots...</h1>
            : errorTimeSlots ? 
            <h1>Fetching time slots error!!</h1>
            :
            <>
              {timeSlots.map((timeslot, index) => (
                <div
                  className= {timeslot.is_booked ? "timeslot timeslot-booked" : "timeslot"}
                  key={index}
                  onClick={() => {setSelectedTimeSlot(`${timeslot.start_time} - ${timeslot.end_time}`); console.log(timeslot); setTimeSlotId(timeslot.id)}}
                >
                  {`${timeslot.start_time.substring(11, 16)} - ${timeslot.end_time.substring(11, 16)}`}
                </div>
              ))}
            </>
          }
        </div>

        <div className="reserve-a-timeSlot">
          <h4 style={{ marginBottom: "15px" }}>Your selected time slot is:</h4>
          <input
            type="text"
            className="input-box"
            value={selectedTimeSlot}
            unselectable="true"
          />
          <button className="button-info" onClick={() => reserveAppointment()}>
            Reserve
          </button>
        </div>
      </div>
    </>
  );
};

export default AppointmentPage;