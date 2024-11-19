import { useEffect, useState } from "react";
import { getSalonById } from "../../services/salonAPI";
import { getAnEmployeeById } from "../../services/employeeAPI";
import {
  cancelThisTimeSlot,
  getATimeSlotById,
} from "../../services/timeslotAPI";

import { getAllUpcomingAppointments } from "../../services/profileAPI";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from "@mui/material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// To convert a timeslot from ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) to Google Calendar format (YYYYMMDDTHHmmssZ)
function convertToGoogleCalendarFormat(isoDate) {
    // Create a Date object from the ISO string
    const date = new Date(isoDate);

    // Extract the date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    const returnTime = `${year}${month}${day}T${hours}${minutes}${seconds}`;
    // console.log("Convert " + isoDate + " to " + returnTime);

    // Construct the Google Calendar format string
    return returnTime;
}

const IncomingAppointments = ({ currentUserId, onDataChange }) => {
  const [appointments, setAppointments] = useState([]);

  // Elements for getting upcomming appoinemtnt
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);
  const [isErrorAppointment, setIsErrorAppointment] = useState(true);
  const [cancelOnce, setCancelOnce] = useState(false);

  const navigate = useNavigate();

  const salonImage =
  "https://www.revealhairstudiorye.com/wp-content/uploads/2021/01/Untitled-design.jpg";

  useEffect(() => {
      const getAllAppointments = async () => {
          try {
              const result = await getAllUpcomingAppointments(currentUserId);
              // console.log(result.length);
              onDataChange(result.length);
              
              if (result.length >0) {
                  const fetchedAppointments = [];
                  
                  for (const appointment of result) {
                      const salonDetail = await getSalonById(appointment.salon_id);
                      const employeeDetail = await getAnEmployeeById(
                          appointment.employee_id
                      );
                      const timeSlotDetail = await getATimeSlotById(
                          appointment.time_slot_id
                      );

                      const appointmentDetail = {
                          salon: salonDetail.name,
                          address: salonDetail.address + ", " + salonDetail.city + ", " + salonDetail.state + " " + salonDetail.zip_code,
                          employee: employeeDetail.name,
                          startTime: timeSlotDetail[0]?.start_time || "N/A",
                          endTime: timeSlotDetail[0]?.end_time || "N/A",
                          bookingId: appointment.id,
                          timeSlotId: appointment.time_slot_id,
                      };

                      fetchedAppointments.push(appointmentDetail);
                  }
                  setAppointments(fetchedAppointments);
              } else {
                setAppointments([]);
              }
          } catch (err) {
              console.error("Error fetching list of upcoming appointments");
          } finally {
              setIsLoadingAppointment(false);
              setIsErrorAppointment(false);
          }
      };
  
      getAllAppointments();
  }, [cancelOnce, currentUserId])

  const cancelThisAppointment = (time_slotid, bookingsid) => {
    Swal.fire({
      title: "Confirming...",
      text: "Do you want to cancel this appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const cancel = async () => {
          try {
            await cancelThisTimeSlot(time_slotid, bookingsid);
          //   console.log("Booking added successfully", time_slotid, " ", bookingsid);
          } catch (error) {
            console.error("Error adding booking", error);
          }
          setCancelOnce(!cancelOnce);
        }
        cancel();
        Swal.fire("Confirmed!", "You have successfully cancel this appointment!", "success");
        // Add logic for "Yes" action here
        onDataChange(appointments.length);
      } else if (result.isDismissed) {
        Swal.fire("Cancelled", "Stop successfully!", "error");
        // Add logic for "No" action here
      }
    });
  };

  return (
    <div className="appointment-box">
      {isLoadingAppointment ? (
        <h3>Loading...</h3>
      ) : isErrorAppointment ? (
        <h3>Error loading list of appointment</h3>
      ) :
      appointments.length <= 0 ? (
        // <h3>There is currently no appointments</h3>
        <div className="no-appointment-add-more" onClick={() => navigate("/#salon")}>
          <h3>There is currently no appointments</h3>
          <h4> <span>Book a new reservation</span> <AddCircleIcon /> </h4>
        </div>
      ) : (
        <>
          {appointments.length > 0 &&
            appointments.map((app, index) => (
              // <div className="appointment-box-inside" key={index}>
              <Card
                sx={{ width: "80%", p: 4 }}
                className="appointment-box-inside"
                key={index}
              >
                <CardActionArea sx={{ with: "100%" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={salonImage}
                    alt="green iguana"
                  />

                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: "#1230AE" }}
                    >
                      <b>{app.salon}</b>
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      Employee: {app.employee}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Date: <b>{app.startTime.substring(0, 10)}</b>
                    </Typography>

                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Time:{" "}
                      <b>
                        <i>
                          {app.startTime.substring(11, 16)} -{" "}
                          {app.endTime.substring(11, 16)}
                        </i>
                      </b>
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions
                  className="abi-selection"
                  sx={{ justifyContent: "center", width: "100%" }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{ m: 1 }}
                    >
                        <a className="add-to-calendar" href={`https://www.google.com/calendar/render?action=TEMPLATE&text=Appointment+at+salon+${app.salon}&dates=${convertToGoogleCalendarFormat(app.startTime)}/${convertToGoogleCalendarFormat(app.endTime)}&details=Appointment+at+salon+${app.salon}+with+employee+${app.employee}&location=${app.address}&sf=true&output=xml`} rel="noreferrer" target="_blank">
                            Add to Google Calendar
                        </a>
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{ m: 1 }}
                        onClick={() =>
                        cancelThisAppointment(app.timeSlotId, app.bookingId)
                        }
                    >
                        Cancel appointment
                    </Button>
                </CardActions>
              </Card>
              // </div>
            ))}
        </>
      )}
    </div>
  );
};

export default IncomingAppointments;
