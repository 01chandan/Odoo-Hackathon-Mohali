<div align="center">
  <br />
  <img src="https://github.com/user-attachments/assets/35d042f2-e0a6-4572-8260-327581e55bb5" alt="CityFix Logo"  />
  <br />
  <p>
    <em>Empowering communities to report and resolve civic issues, one fix at a time.</em>
  </p>
  <br />
</div>

---

**CityFix** is a modern, full-stack web application designed to bridge the gap between citizens and municipal authorities. It provides a seamless platform for users to report local civic problems—like potholes, broken streetlights, or overflowing bins—and an intuitive dashboard for administrators to manage, prioritize, and track these issues to resolution.


---

## 🚀 Key Features

The CityFix platform is divided into two main components: a user-facing reporting application and a powerful admin dashboard.

| Feature                  | User App                                       | Admin Dashboard                                |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------- |
| **📱 Issue Reporting** | Intuitive form to report issues with photos & GPS location. | Detailed view of all reported issues.          |
| **🗺️ Interactive Map** | View reported issues on a live map.            | Visualize issue locations for better planning. |
| **🔔 Status Tracking** | Get real-time updates on your reported issues. | Update issue status, priority, and category.   |
| **📊 Data Analytics** | N/A                                            | View statistics and trends on issue resolution. |
| **⚙️ Admin Controls** | N/A                                            | Manage, assign, and resolve incoming reports.  |
| **✅ User Verification** | Secure sign-up with email verification.        | Manage user accounts and permissions.          |

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (using Hooks and functional components)
-   **Backend:** [Supabase](https://supabase.io/) (PostgreSQL Database, Authentication, and Storage)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a utility-first approach.
-   **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid UI animations.
-   **Charts & Data Viz:** [Recharts](https://recharts.org/) for the admin dashboard analytics.

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your machine.
-   **Node.js** (v18.x or later)
-   **npm** (v9.x or later)

### Installation & Setup

1.  **Fork the repository** by clicking the 'Fork' button on the top right of this page. This creates a copy of the repository under your GitHub account.

2.  **Clone your forked repository** to your local machine:
    ```sh
    git clone https://github.com/01chandan/Odoo-Hackathon-Mohali.git
    ```

3.  **Navigate to the project directory:**
    ```sh
    cd cityfix
    ```

4.  **Install all the necessary NPM packages:**
    ```sh
    npm install
    ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will start in development mode and should automatically open in your browser at [http://localhost:3000](http://localhost:3000). The page will reload if you make edits.

---

## 📝 Implementation Notes

This section provides additional details about the implementation and architecture of the application.

-   **Component-Based Architecture:** The application is built using a modular, component-based structure in React. Key components like `AdminDashboard`, `ReportIssueModal`, and `IssueDetailModal` are designed to be self-contained and reusable.
-   **State Management:** For simplicity and ease of maintenance, the application primarily uses React's built-in state management hooks (`useState`, `useEffect`). For more complex state logic, `useCallback` is used to optimize performance by memoizing functions.
-   **Mock Data:** The current version operates using static mock data (`initialIssues`) to simulate a backend and allow for rapid UI development. In a production environment, this would be replaced with API calls to a dedicated backend service.
-   **API Integration:** The "Report Issue" modal demonstrates integration with the Google Maps Geocoding API to fetch addresses from GPS coordinates and vice-versa. This serves as a template for future backend integrations.

### Extra Features & Optimizations

-   **Responsive Design:** The entire application, from the user reporting form to the admin dashboard, is fully responsive and designed to provide an optimal experience on all devices, including desktops, tablets, and mobile phones.
-   **Engaging UI/UX:** Fluid animations powered by **Framer Motion** are used throughout the app to enhance user interactions, such as modal pop-ups and list rendering. This creates a more polished and engaging user experience.
-   **Dynamic Map Previews:** The admin dashboard modal includes an interactive Google Maps preview for each issue, providing immediate geographical context without needing to leave the page.
-   **Optimized Image Handling:** The image uploader in the reporting modal generates instant client-side previews and handles multiple file uploads gracefully, providing a smooth user experience.

---

## 📬 Contact

Team Nmae - TeamCodeX

