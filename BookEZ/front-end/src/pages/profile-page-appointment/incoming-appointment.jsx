import { useEffect, useState } from "react";
import { getSalonById } from "../../services/salonAPI";
import { getAnEmployeeById } from "../../services/employeeAPI";
import { getATimeSlotById } from "../../services/timeslotAPI";

import { Button } from "@mui/material";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
// import { sizing } from '@mui/system';


const IncomingAppointments = ({ appointmentCriteria }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const salonImage = "https://www.revealhairstudiorye.com/wp-content/uploads/2021/01/Untitled-design.jpg";


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
                        startTime: timeSlotDetail[0]?.start_time || "N/A",
                        endTime: timeSlotDetail[0]?.end_time || "N/A",
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
                            // <div className="appointment-box-inside" key={index}>
                                <Card sx={{ maxWidth: "max-width" }} className="appointment-box-inside" key={index}>
                                    <CardActionArea>
                                        <CardMedia
                                        component="img"
                                        height="140"
                                        image={salonImage}
                                        alt="green iguana"
                                        />

                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ color: '#1230AE' }}>
                                                <b>{app.salon}</b>
                                            </Typography>
                                            <Typography gutterBottom variant="h6" component="div">
                                                Employee: {app.employee}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                Date: {app.startTime.substring(0, 10)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                Start time: {app.startTime.substring(11, 16)}
                                            </Typography>

                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                End time: {app.endTime.substring(11, 16)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button variant="contained" size="small" color="error">
                                            Cancel appointment
                                        </Button>
                                    </CardActions>
                                </Card>
                            // </div>
                        ))
                    )}
                </>
            }
        </div>
    );
};

export default IncomingAppointments;
