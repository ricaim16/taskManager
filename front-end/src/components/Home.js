import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Col, Row, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BiEdit, BiTrash, BiPin } from "react-icons/bi";

function Home() {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const statusFilter = query.get("status");
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    axios
      .get("http://localhost:3002/tasks")
      .then((response) => setTasks(response.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3002/delete/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const handlePin = async (id, status) => {
    const newStatus = status === 0 ? 1 : 0;

    try {
      await axios.put(`http://localhost:3002/Pin/${id}`, { status: newStatus });
      // Refresh the tasks after updating the pin status
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating pin status:", err.message);
    }
  };

  // Filter tasks based on the status parameter
  const filteredTasks = statusFilter
    ? tasks.filter((task) => task.status.toString() === statusFilter)
    : tasks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <Navbar className="bg-success">
        <Container>
          <Navbar.Brand href="#home" className="text-white">
            TaskManager
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button variant="light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="p-4">
        <Row>
          <Col xs={12} md={3} className="sidebar">
            <Button variant="success" onClick={() => setShow(true)}>
              <h1> > </h1>
            </Button>
          </Col>
          <Col xs={12} md={9}>
            <h1>Welcome to TaskManager</h1>
            <div className="task-container">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task._id} className="task-box">
                    <p className="text-success task-label">
                      <b>Title</b>
                    </p>
                    <h4 className="task-title">{task.title}</h4>
                    <p className="text-success task-label">
                      <b>Note</b>
                    </p>
                    <p className="task-note">{task.note}</p>

                    <Link to={`/edit/${task._id}`} className="btn-edit-link">
                      <Button variant="link" className="btn-edit">
                        <BiEdit />
                      </Button>
                    </Link>

                    <Button
                      variant="link"
                      className="btn-remove"
                      onClick={() => handleDelete(task._id)}
                    >
                      <BiTrash />
                    </Button>

                    <Button
                      variant="link"
                      className="btn-pin"
                      onClick={() => handlePin(task._id, task.status)}
                    >
                      <BiPin />
                    </Button>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <Offcanvas
        placement="start"
        show={show}
        onHide={() => setShow(false)}
        className="sidebar-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          <Nav className="flex-column mb-auto">
            <Nav.Item>
              <Link
                to={{ pathname: "/home", search: "?status=0" }}
                className="btn btn-success mb-2"
              >
                Incomplete Tasks
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to={{ pathname: "/home", search: "?status=1" }}
                className="btn btn-success mb-2"
              >
                Complete Tasks
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/home" className="btn btn-success">
                All Tasks
              </Link>
            </Nav.Item>
          </Nav>
          <Link
            to="/create"
            className="btn btn-success mt-auto add-task-button d-flex align-items-center justify-content-center"
          >
            +
          </Link>
        </Offcanvas.Body>
      </Offcanvas>

      <style>
        {`

.add-task-button {
  width: 50px; /* Width of the button */
  height: 50px; /* Height of the button */
  border-radius: 50%; /* Make it a circle */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Font size for the icon */
  position: absolute;
  bottom: 20px; /* Distance from the bottom of the Offcanvas */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* Ensure it stays on top of other content */
}


          .sidebar {
            position: relative;
            top: 56px; /* Adjust this to match the height of the Navbar */
          }
          .sidebar-offcanvas {
            width: 250px; /* Adjust the width as needed */
          }
          .add-task-button {
            width: 50px;
            height: 50px;
            border-radius: 10%; /* Make it a circle */
            position: absolute;
            bottom: 200px; /* Adjust to fit your design */
            left: 50%;
            transform: translateX(-50%);
          }
.task-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Space between boxes */
}

.task-box {
  background-color: #f8f9fa; /* Light background for the box */
  border: 1px solid #dee2e6; /* Border color */
  border-radius: 4px; /* Rounded corners */
  padding: 16px; /* Padding inside the box */
  width: calc(33.333% - 16px); /* Adjust box width for responsive layout */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  position: relative;
  max-height: 200px; /* Set a maximum height for the task box */
  overflow: auto; /* Enable scrolling if content overflows */
}

.task-label {
  margin: 0; /* Remove default margin */
}

.task-title {
  font-weight: bold; /* Title in bold */
  margin-bottom: 8px; /* Space between title and note */
}

.task-note {
  margin: 0; /* Remove default margin */
}

.btn-edit,
.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-right: 8px;
}

.btn-edit {
  color: #ffc107; /* Edit icon color */
}

.btn-remove {
  color: #dc3545; /* Delete icon color */
}

.btn-pin {
  color: #007bff; /* Pin icon color */
}



 `}
      </style>
    </div>
  );
}

export default Home;
