import { useEffect, useState } from "react";
import { getSalonById } from "../../services/salonAPI";
import { getAnEmployeeById } from "../../services/employeeAPI";
import { getATimeSlotById } from "../../services/timeslotAPI";

const IncomingAppointments = ({ appointmentCriteria }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAppointments = async () => {
            const fetchedAppointments = [];

            for (const appointment of appointmentCriteria) {
                try {
                    const salonDetail = await getSalonById(appointment.salon_id);
                    const employeeDetail = await getAnEmployeeById(appointment.employee_id);
                    const timeSlotDetail = await getATimeSlotById(appointment.time_slot_id);

                    const appointmentDetail = {
                        salon: salonDetail.name,
                        employee: employeeDetail.name,
                        time: timeSlotDetail[0]?.start_time || "N/A",
                    };

                    fetchedAppointments.push(appointmentDetail);
                } catch (err) {
                    console.log("Error fetching appointments: " + err);
                } finally {
                    setLoading(false)
                }
            }

            setAppointments(fetchedAppointments);
        };

        getAppointments();
    }, [appointmentCriteria]);

    return (
        <div className="appointment-box">
            {loading ? 
                <h1>Loading...</h1>    
                :
                <>
                    {appointments.length > 0 && (
                        appointments.map((app, index) => (
                            <div className="appointment-box-inside" key={index}>
                                <h3>Salon: {app.salon}</h3>
                                <h3>Employee: {app.employee}</h3>
                                <h3>Time: {app.time}</h3>
                            </div>
                        ))
                    )}
                </>
            }
        </div>
    );
};

export default IncomingAppointments;
