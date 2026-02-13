import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import AchieversPage from "./Pages/Achievers/AchieversPage";
import EventsPage from "./Pages/Events/EventsPage";
import Sidebar from "./component/Sidebar";
import UsersPage from "./Pages/User/UsersPage";
import APIPage from "./Pages/API";
import "./App.css";

import LoginPage from "./Pages/Auth/LoginPage";
import ProtectedRoute from "./component/ProtectedRoute";
import UnauthorizedPage from "./Pages/Auth/UnauthorizedPage";
import AchievementMangement from "./Pages/AchieveManager";
import AchievementDetails from "./Pages/Achievements/AchievementDetails";
import PointRulesPage from "./Pages/PointRules/PointRulesPage";
import StaffPage from "./Pages/Staff/StaffPage";
import SemesterPage from "./Pages/Semester/SemesterPage";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="page-content-wrapper">
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/" element={<AchieversPage />} />
              <Route path="/achievers" element={<AchieversPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/api-integration" element={<APIPage />} />
              <Route
                path="/achieve-management"
                element={<AchievementMangement />}
              />
              <Route
                path="/achieve-management/:achievementInfo"
                element={<AchievementDetails />}
              />
              {/* Admin Only Route */}

              <Route path="/users" element={<UsersPage />} />
              <Route path="/point-rules" element={<PointRulesPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/semester" element={<SemesterPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes (Accessible by 'user' and 'admin') */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/*" element={<MainLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
