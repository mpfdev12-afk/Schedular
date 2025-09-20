export const AdvisorList = [
  {
    id: "1",
    title: "Dr.",
    fullName: "Anand Kumar Goyal",
    specialization: "Orthopaedics",
    qualification: "MBBS, MS Ortho",
    experienceYears: 30,
    languagesSpoken: ["English", "हिंदी"],
    category: "Psychiatrist",
    description: "Expert in mental health with a strong orthopedic background.",
    contact: {
      email: "anand.goyal@example.com",
      phone: "9876543210"
    },
    availability: {
      workingDays: { startDay: "Monday", endDay: "Friday" },
      slotStartTime: "11:00",
      slotEndTime: "18:00",
      breakSlots: [13],
      slotDurationMinutes: 30
    },
    imageUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    bookedSlots: {
      "24062025": [
        { slotTime: 11, users: [1, 2], details: "Group Discussion" },
        { slotTime: 13, users: [3], details: "Follow-up Session" }
      ],
      "25062025": [
        { slotTime: 14, users: [4], details: "First-time Consultation" }
      ]
    }
  },
  {
    id: "2",
    title: "Prof.",
    fullName: "Rekha Mehra",
    specialization: "Clinical Psychology",
    qualification: "PhD in Psychology",
    experienceYears: 22,
    languagesSpoken: ["English", "हिंदी"],
    category: "Psychiatrist",
    description: "Specializes in cognitive behavioral therapy and trauma recovery.",
    contact: {
      email: "rekha.mehra@example.com",
      phone: "9812345678"
    },
    availability: {
      workingDays: { startDay: "Tuesday", endDay: "Saturday" },
      slotStartTime: "10:00",
      slotEndTime: "17:00",
      breakSlots: [14],
      slotDurationMinutes: 45
    },
    imageUrl: "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    bookedSlots: {
      "24062025": [
        { slotTime: 10, users: [5], details: "Stress Counseling" }
      ]
    }
  },
  {
    id: "3",
    title: "Dr.",
    fullName: "Ravi Shankar Verma",
    specialization: "Physiotherapy",
    qualification: "BPT, MPT",
    experienceYears: 18,
    languagesSpoken: ["English", "हिंदी"],
    category: "Physiotherapist",
    description: "Expert in sports injuries and rehabilitation therapy.",
    contact: {
      email: "ravi.verma@example.com",
      phone: "9123456780"
    },
    availability: {
      workingDays: { startDay: "Monday", endDay: "Thursday" },
      slotStartTime: "09:00",
      slotEndTime: "15:00",
      breakSlots: [12],
      slotDurationMinutes: 30
    },
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    bookedSlots: {
      "24062025": [
        { slotTime: 9, users: [2, 6], details: "Sports Injury Assessment" }
      ],
      "26062025": [
        { slotTime: 11, users: [7], details: "Knee Therapy" }
      ]
    }
  },
  {
    id: "4",
    title: "Dr.",
    fullName: "Nisha Agarwal",
    specialization: "Neurology",
    qualification: "MBBS, MD Neuro",
    experienceYears: 25,
    languagesSpoken: ["English", "हिंदी", "मराठी"],
    category: "Psychiatrist",
    description: "Deals with neurological disorders and associated psychiatric conditions.",
    contact: {
      email: "nisha.agarwal@example.com",
      phone: "9988776655"
    },
    availability: {
      workingDays: { startDay: "Wednesday", endDay: "Sunday" },
      slotStartTime: "13:00",
      slotEndTime: "19:00",
      breakSlots: [15],
      slotDurationMinutes: 20
    },
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
    bookedSlots: {
      "25062025": [
        { slotTime: 13, users: [8], details: "Neuro Consult" },
        { slotTime: 16, users: [1, 9], details: "Migraine Follow-up" }
      ]
    }
  },
  {
    id: "5",
    title: "Prof.",
    fullName: "Meera Joshi",
    specialization: "Finance & Investment",
    qualification: "MBA, CFA",
    experienceYears: 15,
    languagesSpoken: ["English", "ગુજરાતી"],
    category: "FinancialAdvisor",
    description: "Advises on wealth management and retirement planning.",
    contact: {
      email: "meera.joshi@example.com",
      phone: "9321456780"
    },
    availability: {
      workingDays: { startDay: "Tuesday", endDay: "Friday" },
      slotStartTime: "12:00",
      slotEndTime: "18:00",
      breakSlots: [15],
      slotDurationMinutes: 30
    },
    imageUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    bookedSlots: {
      "24062025": [
        { slotTime: 12, users: [3], details: "Investment Planning" },
        { slotTime: 16, users: [5], details: "Tax Advice" }
      ],
      "25062025": [
        { slotTime: 13, users: [4], details: "Mutual Fund Portfolio Review" }
      ]
    }
  },
  {
    id: 6,
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
  }
];
