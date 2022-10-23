import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";

export default function Navigation() {
  const [show, setShow] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{
        fontSize: "1rem",
        backgroundColor: "#5C6DE0",
      }}
    >
      <Navbar.Brand
        style={{ fontSize: "1.5rem", cursor: "pointer", fontWeight: "bold" }}
        className="m-0 p-0 px-5"
        onClick={() => navigate("/")}
      >
        ⚡Nikola Assistant
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto px-3">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShow(true)}
            className={`${
              location.pathname.includes("/browse") && "active"
            } nav-link`}
          >
            Instructions
          </div>
          {show && (
            <Modal show={show} setShow={setShow}>
              About
            </Modal>
          )}
          <div
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/about")}
            className={`${
              location.pathname.includes("/browse") && "active"
            } nav-link`}
          >
            About
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
