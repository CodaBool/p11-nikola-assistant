import React, { useState, useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import mapsImg from "./assets/maps.png";

export default function menu() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
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

  function play() {
    navigate("/game");
  }

  return (
    <>
      {/* <Button className="nameButton ms-auto d-block" onClick={() => setShow(true)}>{`${name ? name : 'Click to Enter Name'}`}</Button>
      <Button onClick={play}>Play</Button> */}

      <div
        className="menuPage"
        style={{
          backgroundImage: `url(${mapsImg})`,
          height: "90vh",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Col className="pt-5 m-0">
          <Row className="my-3">
            <Button
              className="nameButton ms-auto d-block w-50 mx-auto"
              onClick={() => setShow(true)}
            >{`${name ? name : "Click to Enter Name"}`}</Button>
          </Row>
          <Row>
            <Button
              className="rightOtherButton me-auto d-block w-50 mx-auto"
              onClick={() => navigate("/game")}
            >
              Play
            </Button>
          </Row>
        </Col>

        <Row className="p-0 m-0">
          <video
            autoPlay
            loop
            src="/video/title.mp4"
            className="w-75 mx-auto"
          ></video>
        </Row>
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
