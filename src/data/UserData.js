const user = {
  id: 1,
  fullName: "John Dugulous",
  dateOfBirth: "2004-04-20",
  gender: "Male",
  contact: {
    email: "john.dugulous@example.com",
    phone: "9876543210"
  },
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  emergencyContact: {
    name: "Jane Dugulous",
    relation: "Mother",
    phone: "9123456789"
  },
  bloodGroup: "B+",
  languagesSpoken: ["English"],
  createdAt: "2025-06-21T12:00:00Z",

  // Active Booked Slots
  bookedSlots: {
    "24062025": [
      {
        slotTime: 11,
        doctorId: "1",
        details: "Group Discussion",
        status: "confirmed" // confirmed, cancelled, pending
      }
    ],
    "25062025": [
      {
        slotTime: 14,
        doctorId: "2",
        details: "Consultation Follow-up",
        status: "pending"
      }
    ]
  },

  // Learning Materials
  learningMaterial: [
    {
      id: "mat101",
      title: "Understanding Mental Health",
      type: "video",
      url: "https://example.com/materials/mental-health",
      completed: false
    },
    {
      id: "mat102",
      title: "Financial Planning Basics",
      type: "pdf",
      url: "https://example.com/materials/finance-planning",
      completed: true
    }
  ],

  // History of Past Sessions
  historySessions: [
    {
      date: "18062025",
      slotTime: 10,
      doctorId: "1",
      details: "Initial Discussion",
      feedbackGiven: true,
      status: "completed"
    },
    {
      date: "19062025",
      slotTime: 13,
      doctorId: "3",
      details: "Therapy Session",
      feedbackGiven: false,
      status: "completed"
    }
  ]
};
