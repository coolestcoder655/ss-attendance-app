import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function App() {
  const [showing, setShow] = useState(false);
  const [showError, setError] = useState(false);

  const [classes, setClasses] = useState<
    Record<
      string,
      { grade: string; students: { name: string; isAbsent: boolean }[] }
    >
  >({
    "1A": {
      grade: "1",
      students: [
        { name: "Jason", isAbsent: false },
        { name: "Emily", isAbsent: false },
        { name: "Liam", isAbsent: false },
        { name: "Sophia", isAbsent: false },
      ],
    },
    "1B": {
      grade: "1",
      students: [
        { name: "Noah", isAbsent: false },
        { name: "Olivia", isAbsent: false },
        { name: "Ethan", isAbsent: false },
        { name: "Ava", isAbsent: false },
      ],
    },
    "2A": {
      grade: "2",
      students: [
        { name: "Mason", isAbsent: false },
        { name: "Isabella", isAbsent: false },
        { name: "Logan", isAbsent: false },
        { name: "Mia", isAbsent: false },
      ],
    },
    "2B": {
      grade: "2",
      students: [
        { name: "Lucas", isAbsent: false },
        { name: "Charlotte", isAbsent: false },
        { name: "Aiden", isAbsent: false },
        { name: "Amelia", isAbsent: false },
      ],
    },
    "3A": {
      grade: "3",
      students: [
        { name: "Elijah", isAbsent: false },
        { name: "Harper", isAbsent: false },
        { name: "James", isAbsent: false },
        { name: "Evelyn", isAbsent: false },
      ],
    },
    "3B": {
      grade: "3",
      students: [
        { name: "Benjamin", isAbsent: false },
        { name: "Abigail", isAbsent: false },
        { name: "Henry", isAbsent: false },
        { name: "Ella", isAbsent: false },
      ],
    },
  });

  const [selectedClass, setSelectedClass] = useState("none");

  function handleAttendenceSubmission(): void {
    let today: Date = new Date();
    let submitterInput: HTMLInputElement = document.getElementById(
      "submitterInput"
    ) as HTMLInputElement;

    if (selectedClass === "none" || submitterInput.value === "") {
      setError(true);
      return;
    }

    const submissionData = {
      submitterName: submitterInput.value,
      datetime: today,
      submittedClass: classes[selectedClass],
    };

    console.log(submissionData);

    const uploadSubmission = async () => {
      const customId = `${submissionData.submitterName}_${Date.now()}`;
      const docRef = doc(db, "submissions", customId);
      await setDoc(docRef, submissionData);
    };

    uploadSubmission();

    // Post Submission
    console.log("Form Submitted");
    setShow(true);
    setSelectedClass("none");
    submitterInput.value = "";
    return;
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        <h1>Attendance Log</h1>
      </div>
      <br />
      <div className="input-group d-flex justify-content-center">
        <input
          type="text"
          className="form-control-lg"
          placeholder="Enter your name..."
          id="submitterInput"
          aria-describedby="basic-addon3 basic-addon4"
        />
        <button
          className="btn btn-outline-dark dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedClass !== "none" ? selectedClass : "Class"}
        </button>
        <ul
          className="dropdown-menu"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {(() => {
            let lastGrade = "";
            return Object.entries(classes)
              .sort(([, a], [, b]) => a.grade.localeCompare(b.grade))
              .flatMap(([name, data], index, arr) => {
                const isNewGrade = data.grade !== lastGrade;
                const nextItem = arr[index + 1];
                const isLastOfGrade =
                  !nextItem || nextItem[1].grade !== data.grade;
                lastGrade = data.grade;

                const elements = [];

                if (isNewGrade) {
                  elements.push(
                    <li key={`header-${data.grade}`}>
                      <h6 className="dropdown-header">Grade {data.grade}</h6>
                    </li>
                  );
                }

                elements.push(
                  <li
                    key={name}
                    className={`dropdown-item ${
                      selectedClass === name ? "active" : ""
                    }`}
                    onClick={() => setSelectedClass(name)}
                  >
                    {name}
                  </li>
                );

                if (isLastOfGrade) {
                  elements.push(
                    <li key={`divider-${data.grade}`}>
                      <hr className="dropdown-divider" />
                    </li>
                  );
                }

                return elements;
              });
          })()}
        </ul>
      </div>

      <div
        className="form-text d-flex justify-content-center"
        id="basic-addon4"
      >
        Please fill in your name and select your class.
      </div>
      <div className="d-flex justify-content-center">
        {selectedClass !== "none" && (
          <ul className="list-group mt-4">
            {selectedClass &&
              classes[selectedClass]?.students.map(
                (
                  student: { name: string; isAbsent: boolean },
                  index: number
                ) => (
                  <li
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      student.isAbsent ? "list-group-item-warning" : ""
                    }`}
                    key={index}
                  >
                    {student.name}
                    <button
                      className={`btn btn-outline-${
                        student.isAbsent === true ? "danger" : "primary"
                      }`}
                      style={{
                        marginLeft: "60px",
                      }}
                      onClick={() => {
                        // Update the student's absence status in a non-mutating way
                        const updatedStudent: {
                          name: string;
                          isAbsent: boolean;
                        } = {
                          ...student, // Spread the current student's properties
                          isAbsent: !student.isAbsent, // Toggle the isAbsent value
                        };
                        // Create a new array with the updated student object
                        const updatedClass = classes[
                          selectedClass
                        ].students.map(
                          (s: { name: string; isAbsent: boolean }) =>
                            s.name === student.name ? updatedStudent : s
                        );
                        // Update the state with the modified className list
                        setClasses({
                          ...classes,
                          [selectedClass]: {
                            ...classes[selectedClass],
                            students: updatedClass,
                          },
                        });
                        console.log(
                          `${student.name}: ${updatedStudent.isAbsent}`
                        );
                      }}
                    >
                      {student.isAbsent ? "Absent" : "Present"}
                    </button>
                  </li>
                )
              )}
          </ul>
        )}
      </div>

      <br></br>
      {selectedClass !== "none" && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-warning btn-lg"
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
            <strong className="me-auto" style={{ color: "green" }}>
              Success!
            </strong>
          </Toast.Header>
          <Toast.Body>Form Submitted Successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setError(false)}
          show={showError}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto" style={{ color: "red" }}>
              An error has occurred.
            </strong>
          </Toast.Header>
          <Toast.Body>
            <span>
              One or more fields are empty. Please check if the following fields
              are empty:{" "}
            </span>
            <ul style={{ color: "red" }}>
              <li>Name Input</li>
              <li>Class</li>
            </ul>
            <span>If this error keeps occuring, please try again later.</span>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
