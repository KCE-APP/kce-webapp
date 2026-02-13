import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Image, Dropdown } from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  // Get user info from local storage (optional, for display)
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
    email: "admin@kce.ac.in",
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm mb-4 ">
        <Container fluid={true}>
          <Navbar.Brand href="/" className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="Karpagam Logo"
              height="50"
              className="d-inline-block align-top"
            />
            <span
              className="fw-bold color1 d-none d-sm-block"
              style={{ fontSize: "1.25rem" }}
            >
              Karpagam SpotLight
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Dropdown align="end" className="profile-dropdown">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="profile-toggle d-flex align-items-center text-decoration-none border-0 p-1"
              >
                <div className="profile-info text-end me-2 d-none d-md-block">
                  <div className="profile-name fw-bold text-dark">
                    {user.name || "Admin User"}
                  </div>
                  <div className="profile-email text-muted small">
                    {user.email || "admin@kce.ac.in"}
                  </div>
                </div>
                <div className="avatar-wrapper shadow-sm">
                  <AccountCircleIcon className="avatar-icon theme-color" />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu shadow-lg border-0 mt-3 pt-0 overflow-hidden">
                <div className="profile-dropdown-header px-3 py-3 mb-2 bg-light border-bottom">
                  <div className="fw-bold text-dark">{user.name}</div>
                  <div className="text-muted small truncate-text">
                    {user.email}
                  </div>
                </div>

                <Dropdown.Item
                  onClick={handleLogout}
                  className="logout-item d-flex align-items-center gap-2 py-2 px-3 text-danger"
                >
                  <LogoutIcon fontSize="small" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
