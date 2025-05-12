import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";

function App() {
  const [showing, setShow] = useState(false);

  const [classes, setClasses] = useState<
    Record<string, { name: string; isAbsent: boolean }[]>
  >({
    "1A": [
      { name: "Jason", isAbsent: false },
      { name: "Emily", isAbsent: false },
      { name: "Liam", isAbsent: false },
      { name: "Sophia", isAbsent: false },
    ],
    "1B": [
      { name: "Noah", isAbsent: false },
      { name: "Olivia", isAbsent: false },
      { name: "Ethan", isAbsent: false },
      { name: "Ava", isAbsent: false },
    ],
    "2A": [
      { name: "Mason", isAbsent: false },
      { name: "Isabella", isAbsent: false },
      { name: "Logan", isAbsent: false },
      { name: "Mia", isAbsent: false },
    ],
    "2B": [
      { name: "Lucas", isAbsent: false },
      { name: "Charlotte", isAbsent: false },
      { name: "Aiden", isAbsent: false },
      { name: "Amelia", isAbsent: false },
    ],
    "3A": [
      { name: "Elijah", isAbsent: false },
      { name: "Harper", isAbsent: false },
      { name: "James", isAbsent: false },
      { name: "Evelyn", isAbsent: false },
    ],
    "3B": [
      { name: "Benjamin", isAbsent: false },
      { name: "Abigail", isAbsent: false },
      { name: "Henry", isAbsent: false },
      { name: "Ella", isAbsent: false },
    ],
  });

  const [selectedClass, setSelectedClass] = useState("none");

  function handleAttendenceSubmission(): void {
    // Submitting Code Here
    console.log("Form Submitted");
    setShow(true);
  }

  return (
    <>
      <br></br>
      <div className="d-flex justify-content-center">
        <h1>Attendance Log</h1>
      </div>
      <div className="input-group d-flex justify-content-center">
        <input
          type="text"
          className="form-control-lg"
          placeholder="Enter your name"
        />
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Options
        </button>
        <ul className="dropdown-menu">
          <li
            className="dropdown-item"
            key={-1}
            onClick={() => setSelectedClass("none")}
          >
            --Select className--
          </li>
          {Object.entries(classes).map(([name, _]) => (
            <li
              key={name}
              className="dropdown-item"
              onClick={() => setSelectedClass(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="d-flex justify-content-center">
        {selectedClass !== "none" && (
          <ul className="list-group mt-4">
            {selectedClass &&
              classes[selectedClass]?.map((student, index) => (
                <li
                  className={`list-group-item d-flex justify-content-between align-items-center mb-2 ${
                    student.isAbsent ? "list-group-item-warning" : ""
                  }`}
                  key={index}
                >
                  {student.name}
                  <button
                    className={`btn btn-${
                      student.isAbsent === true ? "danger" : "primary"
                    }`}
                    style={{
                      marginLeft: "60px",
                    }}
                    onClick={() => {
                      // Update the student's absence status in a non-mutating way
                      const updatedStudent = {
                        ...student, // Spread the current student's properties
                        isAbsent: !student.isAbsent, // Toggle the isAbsent value
                      };

                      // Create a new array with the updated student object
                      const updatedClass = classes[selectedClass].map((s) =>
                        s.name === student.name ? updatedStudent : s
                      );

                      // Update the state with the modified className list
                      setClasses({
                        ...classes,
                        [selectedClass]: updatedClass,
                      });

                      console.log(
                        `${student.name}: ${updatedStudent.isAbsent}`
                      );
                    }}
                  >
                    {student.isAbsent ? "Mark Present" : "Mark Absent"}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <br></br>
      {selectedClass !== "none" && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-outline-warning"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Submit
          </button>
        </div>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Submit Confirmation
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you would like to submit the attendance form?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleAttendenceSubmission}
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShow(false)}
          show={showing}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body>Form Submitted Successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
