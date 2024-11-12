const timeSlots = [
  // Alice Johnson (Hairdresser)
  {
    id: 1,
    employee_id: 1,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 2,
    employee_id: 1,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 3,
    employee_id: 1,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Michael Brown (Manicurist)
  {
    id: 4,
    employee_id: 2,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 5,
    employee_id: 2,
    is_booked: true,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 6,
    employee_id: 2,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // James Smith (Hairdresser)
  {
    id: 7,
    employee_id: 4,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 8,
    employee_id: 4,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 9,
    employee_id: 4,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Emma Davis (Manicurist)
  {
    id: 10,
    employee_id: 5,
    is_booked: true,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 11,
    employee_id: 5,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 12,
    employee_id: 5,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Olivia Martinez (Hairdresser)
  {
    id: 13,
    employee_id: 7,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 14,
    employee_id: 7,
    is_booked: true,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 15,
    employee_id: 7,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Noah Rodriguez (Manicurist)
  {
    id: 16,
    employee_id: 8,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 17,
    employee_id: 8,
    is_booked: true,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 18,
    employee_id: 8,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Ethan Anderson (Hairdresser)
  {
    id: 19,
    employee_id: 10,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 20,
    employee_id: 10,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 21,
    employee_id: 10,
    is_booked: true,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Isabella Thomas (Manicurist)
  {
    id: 22,
    employee_id: 11,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 23,
    employee_id: 11,
    is_booked: true,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 24,
    employee_id: 11,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Emily Lewis (Hairdresser)
  {
    id: 25,
    employee_id: 16,
    is_booked: true,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 26,
    employee_id: 16,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 27,
    employee_id: 16,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },

  // Henry Martinez (Esthetician)
  {
    id: 28,
    employee_id: 17,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 29,
    employee_id: 17,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 30,
    employee_id: 17,
    is_booked: true,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },
];

export default timeSlots;
