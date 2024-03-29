import React, { useState, useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Navigation from '../../components/Navigation.jsx'
import mapsImg from "/maps.png";

export default function menu() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [show, setShow] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    // if (localStorage.getItem('wins')) {
    //   setWins(localStorage.getItem('wins'))
    // }
    if (!localStorage.getItem("name")) {
      setShow(true);
    } else {
      setName(localStorage.getItem("name"));
    }
  }, []);

  function handleName(e) {
    if (e.target.value.length > 11) {
      setNameError("Names must be max 12 characters");
    } else if (e.target.value.length == 0) {
      setNameError("Please Enter a Name");
      setName("");
    } else {
      setNameError(null);
      const char = e.target.value.slice(-1);
      if (
        (char >= "A" && char <= "Z") ||
        (char >= "a" && char <= "z") ||
        char == " "
      ) {
        localStorage.setItem("name", e.target.value);
        setName(e.target.value);
      } else {
        setNameError("Only letter characters Allowed");
      }
    }
  }

  function checkAndNavigate() {
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
      // is Google Chrome on IOS
      navigate("/game")
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      // is Google Chrome
      navigate("/game")
    } else { 
      window.alert('Unfortunately this site only works on Google Chrome')
    }
  }

  return (
    <>
      {/* <Button className="nameButton ms-auto d-block" onClick={() => setShow(true)}>{`${name ? name : 'Click to Enter Name'}`}</Button>
      <Button onClick={play}>Play</Button> */}
      <Navigation />
      <div
        className="menuPage"
        style={{
          backgroundImage: `url(${mapsImg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Col className="pt-5 m-0">
          <Row className="my-3 w-100">
            <Button
              className="nameButton ms-auto d-block w-50 mx-auto"
              onClick={() => setShow(true)}
            >{`${name ? name : "Click to Enter Name"}`}</Button>
          </Row>
          <Row className="my-3 w-100">
            <Button
              className="rightOtherButton me-auto d-block w-50 mx-auto"
              onClick={checkAndNavigate}
            >
              Play
            </Button>
          </Row>
        </Col>
        <Modal
          show={show}
          onHide={() => {
            if (name.length > 0) setShow(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter your username</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-danger">{nameError}</p>
            <input
              className="form-control"
              value={name}
              placeholder="Name"
              onChange={handleName}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              className="w-100"
              disabled={name.length == 0}
              onClick={() => setShow(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
