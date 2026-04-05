# 🏛️ Schedular: The Wellness Governance Platform

**Schedular** is a premium, high-performance wellness ecosystem designed to synchronize **Mental, Physical, and Financial** health for the modern generation. It bridges the gap between individual wellness seekers and expert advisors through a gamified, real-time platform governed by data-driven platform owners.

---

## 🏛️ Feature Analysis & User Flow

### 1. 🛰️ The Live Ecosystem (Real-Time Sync)
The platform uses a WebSocket-driven architecture (Socket.io) to eliminate dashboard latency. 

- **In-Batch Live Chat**:
    - **How to Access**: Once you join a Batch from the "Categories" page, a **"Batch Chat"** button appears on your `Positivity Vault` card in the main Dashboard.
    - **Functionality**: Features the **"Midnight Glass"** UI—a persistent, translucent overlay that synchronizes historical messages and broadcasts new ones instantly to all group members.
- **Instant Booking Triggers**:
    - **Advisor Notifications**: When a seeker books a session, the advisor receives a `NOTIFICATION_NEW_BOOKING` toast immediately.
    - **User Notifications**: When an advisor joins a seeker's "Quick Session," the seeker receives a `NOTIFICATION_BOOKING_CONFIRMED` success alert.

### 2. 💎 The Vitality Economy (Gamification)
Schedular uses a dual-layer reward system to drive consistent wellness habits.

- **How to Earn Vitality Points (VP)**:
    - **Session Booking**: +50 VP for every successfully booked wellness appointment.
    - **Community Co-Op**: Earn collective points by participating in batches. As the group hits milestones, the **Positivity Vault** fills with "Liquid Light."
    - **Daily Persistence**: Users tracking habits daily receive multipliers on their existing VP scores.
- **Visual Status**:
    - **The Wellness Pearl**: A high-fidelity, animated 3D visual on your dashboard that reflects your current VP level.
    - **Seeker Tiers**: Users progress through tiers (e.g., *Seeker, Guardian, Sage*) based on their total platform-wide points.

### 3. 🛡️ Owners' Governance (The War Room)
For platform owners, Schedular provides enterprise-level business intelligence.

- **How to Access**: Authenticated Admin accounts see a **"Control Hub"** shield icon in the sidebar.
- **Functionality**:
    - **Growth Analytics**: 6-month interactive charts showing user acquisition trends.
    - **Advisor Efficiency CRM**: A live-updating table ranking advisors by their active batch count and total audience reach, allowing owners to optimize human resources.

---

## 🎭 Detailed User Journey

### The Seeker's Path
1. **Discover**: Browse the **Mental, Physical, or Financial** domains in the Categories page.
2. **Engage**: Join a **Community Batch** to start collaborating with a group.
3. **Communicate**: Use the **Batch Chat** to sync progress with peers and the advisor.
4. **Grow**: Earn **VP** and watch your **Wellness Pearl** evolve as you fill the **Positivity Vault**.

### The Mentor's Path (Advisor)
1. **Architect**: Create high-density **Batches** for specific wellness topics.
2. **Respond**: Monitor real-time **Quick Session** requests from the "Advisor Dashboard".
3. **Coach**: Guide group chat discussions and provide valuable insights to seekers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Redux Toolkit, Framer Motion, Recharts |
| **Styling** | Vanilla SASS/SCSS, Midnight Glassmorphism |
| **Backend** | Node.js, Express 5.x, MongoDB, Mongoose |
| **Real-Time** | Socket.io (Universal Event Bus) |
| **Infrastructure** | JWT RBAC, Google Calendar API, Persistence Layer |

---

## Security, Privacy & Moderation 🛰️🛡️

To ensure the safety and quality of our community wellness batches, the following moderation policies are in place:

*   **Authorized Access**: Only enrolled Users and assigned Advisors are authorized to participate in batch conversations.
*   **Admin Oversight**: The **General Manager (Admin role)** has "Read-Only" access to all batch communications. This is strictly for safety monitoring, conflict resolution, and quality assurance.
*   **Input Blocking**: Admins cannot send messages or participate in conversations; their role is purely observational to maintain group integrity.
*   **Live Sync**: All authorization checks are performed in real-time via the Socket.io engine and secure REST endpoints.

---

## 🏛️ Deployment & Roles
- **Admins**: Must have `isAdmin: true` in the database to unlock the Owner's Hub.
- **Local Dev**: Ensure the backend `.env` has the correct `CORS_ORIGIN` to allow the frontend socket handshake.

---

**Built with Passion for Holistic Wellness and High-Performance Governance.**
