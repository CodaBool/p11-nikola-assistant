import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import logo from "./assets/group.jpg";
import screenshot from "./assets/go-left.png";

export default function About() {
  return (
    <>
      <Container>
        <h1 className="my-3"></h1>
        <Row>
          <Col md={6} className="aboutSummary p-3">
            <h5 className="display-4">About the project</h5>
            <Row>
              <Col md={10}>
                <p style={{ fontSize: "1.1rem" }}>
                  We built a voice recognition software that is able to navigate
                  based on auditory input. The objective is to traverse the map
                  avoiding pedestrians along the way that are represented by red
                  triangles. We do this while collecting green dots which
                  represent reaching a destination safely. The game is over when
                  it arrives at the green dot without contacting any barriers.
                  <a href="https://github.com/DyroZang/VoiceDrivingGameHackathon">
                    {" "}
                    github.com
                  </a>
                </p>
                Used technologies: React, Radisys, Three.js, Figma
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <img src={logo} className="rounded shadow w-100 mb-3" />
          </Col>
          <Col md={6}>
            <div className="aboutTech">
              <img src={screenshot} className="rounded w-100 mt-3" />
            </div>
          </Col>
          <Col md={6} className="aboutSummary p-3">
            <Row>
              <Col md={10}>
                <p>Team members:</p>
                <ul>
                  <li>Doug</li>
                  <li>Haritha</li>
                  <li>Gabriel</li>
                  <li>Daryl</li>
                  <li>Hasan</li>
                  <li>Christine</li>
                  <li>Zachary</li>
                  <li>Sierra</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row></Row>
      </Container>
    </>
  );
}


// react timer

function TimerComponent() {

currentTime = 60;

function startTimer() {
  while (currentTime > 0) {
    currentTime -= currentTime;
    setTimeout(() => {
      console.log(`You have ${currentTime} remaining!`)
    }, 1000);
  }

  console.log(`Time's up!`);
}

startTimer();

}

export { TimerComponent }
