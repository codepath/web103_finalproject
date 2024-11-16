import "../css/appointment-page.css";
import { useEffect, useState } from "react";
import employees from "../data/employees-mock-data";
import { useParams } from "react-router-dom";
import employeeTimeSlots from "../data/employee-appointment";

const AppointmentPage = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const { eid, sid } = useParams();
  // console.log("employee id" + eid);
  // console.log("salon id" + sid)

  useEffect(() => {
    // We will replace endpoint to get employee details here
    const getAEmployees = () => {
      const employeesOfSalon = employees.filter(
        (em) => em.salon_id === Number(sid) && em.id === Number(eid)
      );
      setEmployeeName(employeesOfSalon[0].name);
      setEmployeeRole(employeesOfSalon[0].role);
      console.log(employeesOfSalon);
    };

    const getEmployeeTimeSlot = () => {
      const employeesOfSalon = employeeTimeSlots.filter(
        (em) => em.employee_id === Number(eid)
      );
      setTimeSlots(employeesOfSalon[0].time_slots);
      console.log(employeesOfSalon[0].time_slots);
    };

    getAEmployees();
    getEmployeeTimeSlot();
  }, [eid, sid]);

  const reserveAppointment = () => {
    alert(
      "You reserved timeslot " +
        selectedTimeSlot +
        " for worker " +
        employeeName
    );
  };

  return (
    <>
      <div className="appointment-page-employee-details">
        <h1>{employeeName}</h1>
        <h3>{employeeRole}</h3>
      </div>
      <div className="appointment-reservation">
        <div className="list-of-timeSlot">
          {timeSlots.map((timeslot, index) => (
            <div
              className="timeslot"
              key={index}
              onClick={() => setSelectedTimeSlot(timeslot)}
            >
              {timeslot}
            </div>
          ))}
        </div>

        <div className="reserve-a-timeSlot">
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
