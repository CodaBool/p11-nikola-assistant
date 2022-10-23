import Modal from "react-bootstrap/Modal";

export default function SampleModal({ show, setShow }) {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Rules of the game:</b>
        <br></br>
        <br></br>
        <ul>
          <li>You have 1 minute to finish the game</li>
          <li>You have 5 commands</li>
        </ul>

        <b>Commands:</b>
        <br></br>
        <br></br>
        <ul>
          <li>"Up"</li>
          <li>"Right"</li>
          <li>"Down"</li>
          <li>"Left"</li>
          <li>"Stop"</li>
        </ul>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
