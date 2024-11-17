import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField, Box } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";

const MyDatePicker = () => {
  // Timeslot data
  const timeslots = [
    {
      id: 3,
      employee_id: 2,
      is_booked: false,
      start_time: "2024-11-01T10:00:00",
      end_time: "2024-11-01T11:00:00",
    },
    {
      id: 4,
      employee_id: 2,
      is_booked: false,
      start_time: "2024-11-01T14:00:00",
      end_time: "2024-11-01T15:00:00",
    },
    {
      id: 5,
      employee_id: 2,
      is_booked: false,
      start_time: "2024-11-03T09:00:00",
      end_time: "2024-11-03T10:00:00",
    },
  ];

  // Extracting days with timeslots
  const daysWithTimeslots = timeslots.map((slot) =>
    dayjs(slot.start_time).format("YYYY-MM-DD")
  );
  console.log("Days with timeslots:", daysWithTimeslots); // Debugging output

  // Helper function to check if a day has a timeslot
  const isDayWithTimeslot = (day) => {
    const formattedDay = day.format("YYYY-MM-DD");
    const isAvailable = daysWithTimeslots.includes(formattedDay);
    console.log(formattedDay, "has timeslot:", isAvailable); // Debugging output
    return isAvailable;
  };

  // Custom render function for calendar days
  const renderDay = (day, selectedDates, pickersDayProps) => {
    const hasTimeslot = isDayWithTimeslot(day);

    return (
      <Box position="relative">
        <PickersDay
          {...pickersDayProps}
          sx={{
            ...(hasTimeslot && {
              backgroundColor: "green", // Highlight the day
              color: "white",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }),
          }}
        />
        {hasTimeslot && (
          <Box
            sx={{
              width: 8,
              height: 8,
              backgroundColor: "green", // Small circle below the day
              borderRadius: "50%",
              position: "absolute",
              bottom: 4,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </Box>
    );
  };

  // Testing static rendering of a single day (e.g., November 1, 2024)
  const testRenderDay = (day, selectedDates, pickersDayProps) => {
    const isTestDay = day.format("YYYY-MM-DD") === "2024-11-01"; // Static test

    console.log("Testing static rendering for", day.format("YYYY-MM-DD")); // Debugging

    return (
      <Box position="relative">
        <PickersDay {...pickersDayProps} />
        {isTestDay && (
          <Box
            sx={{
              width: 8,
              height: 8,
              backgroundColor: "blue", // Static test color
              borderRadius: "50%",
              position: "absolute",
              bottom: 4,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select a date"
        renderInput={(params) => <TextField {...params} />}
        renderDay={(day, selectedDates, pickersDayProps) =>
          // Switch between testRenderDay and renderDay for debugging
          renderDay(day, selectedDates, pickersDayProps)
        }
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
