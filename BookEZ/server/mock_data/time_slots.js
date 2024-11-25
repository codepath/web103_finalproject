const timeSlots = [
  // Employee 1 (Alice Johnson - Hairdresser)
  {
    id: 1,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-01T09:00:00",
    end_time: "2024-11-01T10:00:00",
  },
  {
    id: 2,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-01T10:30:00",
    end_time: "2024-11-01T11:30:00",
  },
  {
    id: 3,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-02T13:00:00",
    end_time: "2024-11-02T14:00:00",
  },
  {
    id: 4,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-02T15:00:00",
    end_time: "2024-11-02T16:00:00",
  },
  {
    id: 5,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-03T09:30:00",
    end_time: "2024-11-03T10:30:00",
  },
  {
    id: 6,
    employee_id: 1,
    is_booked: false,
    start_time: "2024-11-03T11:00:00",
    end_time: "2024-11-03T12:00:00",
  },

  // Employee 2 (Michael Brown - Manicurist)
  {
    id: 7,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-04T09:00:00",
    end_time: "2024-11-04T10:00:00",
  },
  {
    id: 8,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-04T10:30:00",
    end_time: "2024-11-04T11:30:00",
  },
  {
    id: 9,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-05T12:00:00",
    end_time: "2024-11-05T13:00:00",
  },
  {
    id: 10,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-05T14:00:00",
    end_time: "2024-11-05T15:00:00",
  },
  {
    id: 11,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-06T09:30:00",
    end_time: "2024-11-06T10:30:00",
  },
  {
    id: 12,
    employee_id: 2,
    is_booked: false,
    start_time: "2024-11-06T11:00:00",
    end_time: "2024-11-06T12:00:00",
  },

  
  // Employee 4 (James Smith - Hairdresser)
  {
    id: 13,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-07T09:00:00",
    end_time: "2024-11-07T10:00:00",
  },
  {
    id: 14,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-07T11:00:00",
    end_time: "2024-11-07T12:00:00",
  },
  {
    id: 15,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-08T13:30:00",
    end_time: "2024-11-08T14:30:00",
  },
  {
    id: 16,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-08T15:00:00",
    end_time: "2024-11-08T16:00:00",
  },
  {
    id: 17,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-09T09:30:00",
    end_time: "2024-11-09T10:30:00",
  },
  {
    id: 18,
    employee_id: 4,
    is_booked: false,
    start_time: "2024-11-09T11:30:00",
    end_time: "2024-11-09T12:30:00",
  },

  // Employee 5 (Emma Davis - Manicurist)
  {
    id: 19,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-10T09:30:00",
    end_time: "2024-11-10T10:30:00",
  },
  {
    id: 20,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-10T11:00:00",
    end_time: "2024-11-10T12:00:00",
  },
  {
    id: 21,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-11T13:00:00",
    end_time: "2024-11-11T14:00:00",
  },
  {
    id: 22,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-11T15:00:00",
    end_time: "2024-11-11T16:00:00",
  },
  {
    id: 23,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-12T09:00:00",
    end_time: "2024-11-12T10:00:00",
  },
  {
    id: 24,
    employee_id: 5,
    is_booked: false,
    start_time: "2024-11-12T11:00:00",
    end_time: "2024-11-12T12:00:00",
  },


  // Employee 7 (Olivia Martinez - Hairdresser)
  {
    id: 25,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-13T09:00:00",
    end_time: "2024-11-13T10:00:00",
  },
  {
    id: 26,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-13T11:00:00",
    end_time: "2024-11-13T12:00:00",
  },
  {
    id: 27,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-14T13:00:00",
    end_time: "2024-11-14T14:00:00",
  },
  {
    id: 28,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-14T15:00:00",
    end_time: "2024-11-14T16:00:00",
  },
  {
    id: 29,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-15T09:30:00",
    end_time: "2024-11-15T10:30:00",
  },
  {
    id: 30,
    employee_id: 7,
    is_booked: false,
    start_time: "2024-11-15T11:30:00",
    end_time: "2024-11-15T12:30:00",
  },

  // Employee 8 (Noah Rodriguez - Manicurist)
  {
    id: 31,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-16T09:00:00",
    end_time: "2024-11-16T10:00:00",
  },
  {
    id: 32,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-16T11:00:00",
    end_time: "2024-11-16T12:00:00",
  },
  {
    id: 33,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-17T13:00:00",
    end_time: "2024-11-17T14:00:00",
  },
  {
    id: 34,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-17T15:00:00",
    end_time: "2024-11-17T16:00:00",
  },
  {
    id: 35,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-18T09:30:00",
    end_time: "2024-11-18T10:30:00",
  },
  {
    id: 36,
    employee_id: 8,
    is_booked: false,
    start_time: "2024-11-18T11:30:00",
    end_time: "2024-11-18T12:30:00",
  },


  // Employee 10 (Ethan Anderson - Hairdresser)
  {
    id: 37,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-22T09:00:00",
    end_time: "2024-11-22T10:00:00"
  },
  {
    id: 38,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-22T11:00:00",
    end_time: "2024-11-22T12:00:00"
  },
  {
    id: 39,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-23T13:30:00",
    end_time: "2024-11-23T14:30:00"
  },
  {
    id: 40,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-23T15:00:00",
    end_time: "2024-11-23T16:00:00"
  },
  {
    id: 41,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-24T09:30:00",
    end_time: "2024-11-24T10:30:00"
  },
  {
    id: 42,
    employee_id: 10,
    is_booked: false,
    start_time: "2024-11-24T11:30:00",
    end_time: "2024-11-24T12:30:00"
  },

  {
    id: 43,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-25T09:00:00",
    end_time: "2024-11-25T10:00:00"
  },
  {
    id: 44,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-25T11:00:00",
    end_time: "2024-11-25T12:00:00"
  },
  {
    id: 45,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-26T13:00:00",
    end_time: "2024-11-26T14:00:00"
  },
  {
    id: 46,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-26T15:00:00",
    end_time: "2024-11-26T16:00:00"
  },
  {
    id: 47,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-27T09:30:00",
    end_time: "2024-11-27T10:30:00"
  },
  {
    id: 48,
    employee_id: 11,
    is_booked: false,
    start_time: "2024-11-27T11:30:00",
    end_time: "2024-11-27T12:30:00"
  },


  {
    id: 49,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-28T10:00:00",
    end_time: "2024-11-28T11:00:00"
  },
  {
    id: 50,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-28T12:00:00",
    end_time: "2024-11-28T13:00:00"
  },
  {
    id: 51,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-29T14:30:00",
    end_time: "2024-11-29T15:30:00"
  },
  {
    id: 52,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-29T16:00:00",
    end_time: "2024-11-29T17:00:00"
  },
  {
    id: 53,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-30T09:30:00",
    end_time: "2024-11-30T10:30:00"
  },
  {
    id: 54,
    employee_id: 13,
    is_booked: false,
    start_time: "2024-11-30T11:00:00",
    end_time: "2024-11-30T12:00:00"
  },

  {
    id: 55,
    employee_id: 14,
    is_booked: false,
    start_time: "2024-12-01T09:00:00",
    end_time: "2024-12-01T10:00:00"
  },
  {
    id: 56,
    employee_id: 14,
    is_booked: false,
    start_time: "2024-12-01T11:00:00",
    end_time: "2024-12-01T12:00:00"
  },
  {
    id: 57,
    employee_id: 14,
    is_booked: false,
    start_time: "2024-12-02T13:00:00",
    end_time: "2024-12-02T14:00:00"
  },
  {
    id: 58,
    employee_id: 14,
    is_booked: false,
    start_time: "2024-12-02T15:00:00",
    end_time: "2024-12-02T16:00:00"
  },


  {
    id: 59,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-03T09:00:00",
    end_time: "2024-12-03T10:00:00"
  },
  {
    id: 60,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-03T11:00:00",
    end_time: "2024-12-03T12:00:00"
  },
  {
    id: 61,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-04T13:30:00",
    end_time: "2024-12-04T14:30:00"
  },
  {
    id: 62,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-04T15:00:00",
    end_time: "2024-12-04T16:00:00"
  },
  {
    id: 63,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-05T09:30:00",
    end_time: "2024-12-05T10:30:00"
  },
  {
    id: 64,
    employee_id: 16,
    is_booked: false,
    start_time: "2024-12-05T11:30:00",
    end_time: "2024-12-05T12:30:00"
  },

  {
    id: 65,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-01T09:30:00",
    end_time: "2024-12-01T10:30:00"
  },
  {
    id: 66,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-01T11:00:00",
    end_time: "2024-12-01T12:00:00"
  },
  {
    id: 67,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-02T13:30:00",
    end_time: "2024-12-02T14:30:00"
  },
  {
    id: 68,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-02T15:00:00",
    end_time: "2024-12-02T16:00:00"
  },
  {
    id: 69,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-03T09:00:00",
    end_time: "2024-12-03T10:00:00"
  },
  {
    id: 70,
    employee_id: 17,
    is_booked: false,
    start_time: "2024-12-03T11:00:00",
    end_time: "2024-12-03T12:00:00"
  }
];

export default timeSlots;
