import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const icons = {
    achievers: "https://cdn-icons-png.flaticon.com/512/3113/3113025.png",
    events: "https://cdn-icons-png.flaticon.com/512/10691/10691802.png",
    users: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    arena: "https://cdn-icons-png.flaticon.com/512/19022/19022138.png",
    rules: "https://cdn-icons-png.flaticon.com/512/1055/1055644.png",
    staff: "https://cdn-icons-png.flaticon.com/512/912/912318.png",
    semester: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
    catalog: "https://cdn-icons-png.flaticon.com/512/3081/3081648.png",
    history: "https://cdn-icons-png.flaticon.com/512/3503/3503786.png",
    verfication: "https://cdn-icons-png.flaticon.com/512/9521/9521251.png",
  };

  return (
    <div className="sidebar bg-white border-end h-100 pt-3">
      <Nav className="flex-column gap-2 px-2">
        <Nav.Link
          as={NavLink}
          to="/achievers"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.achievers}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Achievers</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/events"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.events}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Events</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/users"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.users}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Users</span>
        </Nav.Link>
        {/* <Nav.Link as={NavLink} to="/announcements" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Announcements</span>
            </Nav.Link> */}
        <Nav.Link
          as={NavLink}
          to="/api-integration"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.arena}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Arena</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/point-rules"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.rules}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Point Rules</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/staff"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.staff}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Manage Staff</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/semester"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.semester}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Manage Semester</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/reward-catalog"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.catalog}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Reward Catalog</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/redemption-history"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.history}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Redemption History</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/achieve-management"
          className="sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
        >
          <img
            src={icons.verfication}
            alt="icon"
            style={{ width: "24px", height: "24px", objectFit: "contain" }}
          />
          <span className="fw-medium">Submission Approval</span>
        </Nav.Link>
      </Nav>
    </div>
  );
}
export default Sidebar;
