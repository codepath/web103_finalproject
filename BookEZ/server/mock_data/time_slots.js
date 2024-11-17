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
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },
  {
    id: 3,
    employee_id: 1,
    is_booked: false,
    start_time: '2024-11-01T14:00:00',
    end_time: '2024-11-01T15:00:00',
  },

  // Michael Brown (Manicurist)
  {
    id: 4,
    employee_id: 2,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 5,
    employee_id: 2,
    is_booked: false,
    start_time: '2024-11-01T12:00:00',
    end_time: '2024-11-01T13:00:00',
  },
  {
    id: 6,
    employee_id: 2,
    is_booked: false,
    start_time: '2024-11-01T15:00:00',
    end_time: '2024-11-01T16:00:00',
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
    start_time: '2024-11-01T13:00:00',
    end_time: '2024-11-01T14:00:00',
  },
  {
    id: 9,
    employee_id: 4,
    is_booked: false,
    start_time: '2024-11-01T16:00:00',
    end_time: '2024-11-01T17:00:00',
  },

  // Emma Davis (Manicurist)
  {
    id: 10,
    employee_id: 5,
    is_booked: false,
    start_time: '2024-11-01T09:30:00',
    end_time: '2024-11-01T10:30:00',
  },
  {
    id: 11,
    employee_id: 5,
    is_booked: false,
    start_time: '2024-11-01T11:30:00',
    end_time: '2024-11-01T12:30:00',
  },
  {
    id: 12,
    employee_id: 5,
    is_booked: false,
    start_time: '2024-11-01T14:30:00',
    end_time: '2024-11-01T15:30:00',
  },

  // Olivia Martinez (Hairdresser)
  {
    id: 13,
    employee_id: 7,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 14,
    employee_id: 7,
    is_booked: false,
    start_time: '2024-11-01T12:00:00',
    end_time: '2024-11-01T13:00:00',
  },
  {
    id: 15,
    employee_id: 7,
    is_booked: false,
    start_time: '2024-11-01T15:00:00',
    end_time: '2024-11-01T16:00:00',
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
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },
  {
    id: 18,
    employee_id: 8,
    is_booked: false,
    start_time: '2024-11-01T13:00:00',
    end_time: '2024-11-01T14:00:00',
  },
  {
    id: 19,
    employee_id: 8,
    is_booked: false,
    start_time: '2024-11-01T16:00:00',
    end_time: '2024-11-01T17:00:00',
  },

  // Emily Lewis (Hairdresser)
  {
    id: 20,
    employee_id: 16,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 21,
    employee_id: 16,
    is_booked: false,
    start_time: '2024-11-01T13:00:00',
    end_time: '2024-11-01T14:00:00',
  },
  {
    id: 22,
    employee_id: 16,
    is_booked: false,
    start_time: '2024-11-01T15:00:00',
    end_time: '2024-11-01T16:00:00',
  },

  // Henry Martinez (Esthetician)
  {
    id: 23,
    employee_id: 17,
    is_booked: false,
    start_time: '2024-11-01T09:30:00',
    end_time: '2024-11-01T10:30:00',
  },
  {
    id: 24,
    employee_id: 17,
    is_booked: false,
    start_time: '2024-11-01T11:30:00',
    end_time: '2024-11-01T12:30:00',
  },
  {
    id: 25,
    employee_id: 17,
    is_booked: false,
    start_time: '2024-11-01T14:30:00',
    end_time: '2024-11-01T15:30:00',
  },
  // Ethan Anderson (Hairdresser)
  {
    id: 26,
    employee_id: 10,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 27,
    employee_id: 10,
    is_booked: false,
    start_time: '2024-11-01T11:00:00',
    end_time: '2024-11-01T12:00:00',
  },
  {
    id: 28,
    employee_id: 10,
    is_booked: false,
    start_time: '2024-11-01T14:00:00',
    end_time: '2024-11-01T15:00:00',
  },

  // Isabella Thomas (Manicurist)
  {
    id: 29,
    employee_id: 11,
    is_booked: false,
    start_time: '2024-11-01T09:30:00',
    end_time: '2024-11-01T10:30:00',
  },
  {
    id: 30,
    employee_id: 11,
    is_booked: false,
    start_time: '2024-11-01T12:30:00',
    end_time: '2024-11-01T13:30:00',
  },
  {
    id: 31,
    employee_id: 11,
    is_booked: false,
    start_time: '2024-11-01T15:30:00',
    end_time: '2024-11-01T16:30:00',
  },

  // Emma Clark (Hairdresser)
  {
    id: 32,
    employee_id: 13,
    is_booked: false,
    start_time: '2024-11-01T10:00:00',
    end_time: '2024-11-01T11:00:00',
  },
  {
    id: 33,
    employee_id: 13,
    is_booked: false,
    start_time: '2024-11-01T12:00:00',
    end_time: '2024-11-01T13:00:00',
  },
  {
    id: 34,
    employee_id: 13,
    is_booked: false,
    start_time: '2024-11-01T14:00:00',
    end_time: '2024-11-01T15:00:00',
  },

  // Daniel Johnson (Manicurist)
  {
    id: 35,
    employee_id: 14,
    is_booked: false,
    start_time: '2024-11-01T09:00:00',
    end_time: '2024-11-01T10:00:00',
  },
  {
    id: 36,
    employee_id: 14,
    is_booked: false,
    start_time: '2024-11-01T11:30:00',
    end_time: '2024-11-01T12:30:00',
  },
  {
    id: 37,
    employee_id: 14,
    is_booked: false,
    start_time: '2024-11-01T14:30:00',
    end_time: '2024-11-01T15:30:00',
  },
];

export default timeSlots;
