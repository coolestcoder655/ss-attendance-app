import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  Toast,
  ToastContainer,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function App() {
  const [showing, setShow] = useState(false);
  const [showError, setError] = useState(false);

  const [classes, setClasses] = useState<
    Record<
      string,
      {
        grade: string;
        students: { name: string; isAbsent: boolean; notes: string }[];
      }
    >
  >({
    "1A": {
      grade: "1",
      students: [
        { name: "Alice", isAbsent: false, notes: "" },
        { name: "Bob", isAbsent: false, notes: "" },
        { name: "Charlie", isAbsent: false, notes: "" },
        { name: "Diana", isAbsent: false, notes: "" },
        { name: "Eve", isAbsent: false, notes: "" },
        { name: "Frank", isAbsent: false, notes: "" },
        { name: "Grace", isAbsent: false, notes: "" },
        { name: "Hank", isAbsent: false, notes: "" },
        { name: "Ivy", isAbsent: false, notes: "" },
        { name: "Jack", isAbsent: false, notes: "" },
        { name: "Karen", isAbsent: false, notes: "" },
        { name: "Leo", isAbsent: false, notes: "" },
        { name: "Mona", isAbsent: false, notes: "" },
        { name: "Nina", isAbsent: false, notes: "" },
        { name: "Oscar", isAbsent: false, notes: "" },
        { name: "Paul", isAbsent: false, notes: "" },
        { name: "Quinn", isAbsent: false, notes: "" },
        { name: "Rose", isAbsent: false, notes: "" },
        { name: "Steve", isAbsent: false, notes: "" },
        { name: "Tina", isAbsent: false, notes: "" },
        { name: "Uma", isAbsent: false, notes: "" },
        { name: "Victor", isAbsent: false, notes: "" },
        { name: "Wendy", isAbsent: false, notes: "" },
        { name: "Xander", isAbsent: false, notes: "" },
        { name: "Yara", isAbsent: false, notes: "" },
      ],
    },
    "1B": {
      grade: "1",
      students: [
        { name: "Aaron", isAbsent: false, notes: "" },
        { name: "Bella", isAbsent: false, notes: "" },
        { name: "Cody", isAbsent: false, notes: "" },
        { name: "Daisy", isAbsent: false, notes: "" },
        { name: "Ethan", isAbsent: false, notes: "" },
        { name: "Fiona", isAbsent: false, notes: "" },
        { name: "Gavin", isAbsent: false, notes: "" },
        { name: "Holly", isAbsent: false, notes: "" },
        { name: "Ian", isAbsent: false, notes: "" },
        { name: "Jill", isAbsent: false, notes: "" },
        { name: "Kyle", isAbsent: false, notes: "" },
        { name: "Luna", isAbsent: false, notes: "" },
        { name: "Mason", isAbsent: false, notes: "" },
        { name: "Nora", isAbsent: false, notes: "" },
        { name: "Owen", isAbsent: false, notes: "" },
        { name: "Piper", isAbsent: false, notes: "" },
        { name: "Quincy", isAbsent: false, notes: "" },
        { name: "Riley", isAbsent: false, notes: "" },
        { name: "Sam", isAbsent: false, notes: "" },
        { name: "Tara", isAbsent: false, notes: "" },
        { name: "Ulysses", isAbsent: false, notes: "" },
        { name: "Vera", isAbsent: false, notes: "" },
        { name: "Will", isAbsent: false, notes: "" },
        { name: "Xena", isAbsent: false, notes: "" },
        { name: "Yvonne", isAbsent: false, notes: "" },
      ],
    },
    "2A": {
      grade: "2",
      students: [
        { name: "Abby", isAbsent: false, notes: "" },
        { name: "Ben", isAbsent: false, notes: "" },
        { name: "Clara", isAbsent: false, notes: "" },
        { name: "Derek", isAbsent: false, notes: "" },
        { name: "Elsa", isAbsent: false, notes: "" },
        { name: "Felix", isAbsent: false, notes: "" },
        { name: "Gloria", isAbsent: false, notes: "" },
        { name: "Harvey", isAbsent: false, notes: "" },
        { name: "Isla", isAbsent: false, notes: "" },
        { name: "Jonah", isAbsent: false, notes: "" },
        { name: "Kylie", isAbsent: false, notes: "" },
        { name: "Liam", isAbsent: false, notes: "" },
        { name: "Maya", isAbsent: false, notes: "" },
        { name: "Noah", isAbsent: false, notes: "" },
        { name: "Olive", isAbsent: false, notes: "" },
        { name: "Preston", isAbsent: false, notes: "" },
        { name: "Queenie", isAbsent: false, notes: "" },
        { name: "Reed", isAbsent: false, notes: "" },
        { name: "Sophie", isAbsent: false, notes: "" },
        { name: "Travis", isAbsent: false, notes: "" },
        { name: "Ursula", isAbsent: false, notes: "" },
        { name: "Vince", isAbsent: false, notes: "" },
        { name: "Whitney", isAbsent: false, notes: "" },
        { name: "Ximena", isAbsent: false, notes: "" },
        { name: "Yusuf", isAbsent: false, notes: "" },
      ],
    },
    "2B": {
      grade: "2",
      students: [
        { name: "Aiden", isAbsent: false, notes: "" },
        { name: "Brenda", isAbsent: false, notes: "" },
        { name: "Caleb", isAbsent: false, notes: "" },
        { name: "Delia", isAbsent: false, notes: "" },
        { name: "Emmett", isAbsent: false, notes: "" },
        { name: "Frida", isAbsent: false, notes: "" },
        { name: "Gabe", isAbsent: false, notes: "" },
        { name: "Hazel", isAbsent: false, notes: "" },
        { name: "Irene", isAbsent: false, notes: "" },
        { name: "Julian", isAbsent: false, notes: "" },
        { name: "Kara", isAbsent: false, notes: "" },
        { name: "Logan", isAbsent: false, notes: "" },
        { name: "Mila", isAbsent: false, notes: "" },
        { name: "Nico", isAbsent: false, notes: "" },
        { name: "Orla", isAbsent: false, notes: "" },
        { name: "Peter", isAbsent: false, notes: "" },
        { name: "Quinn", isAbsent: false, notes: "" },
        { name: "Rosa", isAbsent: false, notes: "" },
        { name: "Sebastian", isAbsent: false, notes: "" },
        { name: "Tess", isAbsent: false, notes: "" },
        { name: "Uriel", isAbsent: false, notes: "" },
        { name: "Violet", isAbsent: false, notes: "" },
        { name: "Warren", isAbsent: false, notes: "" },
        { name: "Xavi", isAbsent: false, notes: "" },
        { name: "Yelena", isAbsent: false, notes: "" },
      ],
    },
    "3A": {
      grade: "3",
      students: [
        { name: "Amy", isAbsent: false, notes: "" },
        { name: "Blake", isAbsent: false, notes: "" },
        { name: "Carmen", isAbsent: false, notes: "" },
        { name: "Dev", isAbsent: false, notes: "" },
        { name: "Eliza", isAbsent: false, notes: "" },
        { name: "Finn", isAbsent: false, notes: "" },
        { name: "Georgia", isAbsent: false, notes: "" },
        { name: "Hector", isAbsent: false, notes: "" },
        { name: "India", isAbsent: false, notes: "" },
        { name: "Jasper", isAbsent: false, notes: "" },
        { name: "Kate", isAbsent: false, notes: "" },
        { name: "Lucas", isAbsent: false, notes: "" },
        { name: "Madeline", isAbsent: false, notes: "" },
        { name: "Neil", isAbsent: false, notes: "" },
        { name: "Opal", isAbsent: false, notes: "" },
        { name: "Perry", isAbsent: false, notes: "" },
        { name: "Quora", isAbsent: false, notes: "" },
        { name: "Ray", isAbsent: false, notes: "" },
        { name: "Sasha", isAbsent: false, notes: "" },
        { name: "Tom", isAbsent: false, notes: "" },
        { name: "Usha", isAbsent: false, notes: "" },
        { name: "Valerie", isAbsent: false, notes: "" },
        { name: "Wyatt", isAbsent: false, notes: "" },
        { name: "Xia", isAbsent: false, notes: "" },
        { name: "Yanni", isAbsent: false, notes: "" },
      ],
    },
    "3B": {
      grade: "3",
      students: [
        { name: "Aria", isAbsent: false, notes: "" },
        { name: "Brody", isAbsent: false, notes: "" },
        { name: "Cassie", isAbsent: false, notes: "" },
        { name: "Dylan", isAbsent: false, notes: "" },
        { name: "Eli", isAbsent: false, notes: "" },
        { name: "Freya", isAbsent: false, notes: "" },
        { name: "Gwen", isAbsent: false, notes: "" },
        { name: "Harris", isAbsent: false, notes: "" },
        { name: "Isabel", isAbsent: false, notes: "" },
        { name: "Jonas", isAbsent: false, notes: "" },
        { name: "Keira", isAbsent: false, notes: "" },
        { name: "Lars", isAbsent: false, notes: "" },
        { name: "Melody", isAbsent: false, notes: "" },
        { name: "Noel", isAbsent: false, notes: "" },
        { name: "Orion", isAbsent: false, notes: "" },
        { name: "Phoebe", isAbsent: false, notes: "" },
        { name: "Quaid", isAbsent: false, notes: "" },
        { name: "Rina", isAbsent: false, notes: "" },
        { name: "Silas", isAbsent: false, notes: "" },
        { name: "Talia", isAbsent: false, notes: "" },
        { name: "Ulrich", isAbsent: false, notes: "" },
        { name: "Vada", isAbsent: false, notes: "" },
        { name: "Wes", isAbsent: false, notes: "" },
        { name: "Xenia", isAbsent: false, notes: "" },
        { name: "Yuki", isAbsent: false, notes: "" },
      ],
    },
    "4A": {
      grade: "4",
      students: [
        { name: "Anya", isAbsent: false, notes: "" },
        { name: "Bryce", isAbsent: false, notes: "" },
        { name: "Cleo", isAbsent: false, notes: "" },
        { name: "Dante", isAbsent: false, notes: "" },
        { name: "Esther", isAbsent: false, notes: "" },
        { name: "Franklin", isAbsent: false, notes: "" },
        { name: "Greta", isAbsent: false, notes: "" },
        { name: "Hugo", isAbsent: false, notes: "" },
        { name: "Imani", isAbsent: false, notes: "" },
        { name: "Jake", isAbsent: false, notes: "" },
        { name: "Kayla", isAbsent: false, notes: "" },
        { name: "Logan", isAbsent: false, notes: "" },
        { name: "Monica", isAbsent: false, notes: "" },
        { name: "Nate", isAbsent: false, notes: "" },
        { name: "Odette", isAbsent: false, notes: "" },
        { name: "Parker", isAbsent: false, notes: "" },
        { name: "Quentin", isAbsent: false, notes: "" },
        { name: "Rory", isAbsent: false, notes: "" },
        { name: "Selena", isAbsent: false, notes: "" },
        { name: "Troy", isAbsent: false, notes: "" },
        { name: "Unity", isAbsent: false, notes: "" },
        { name: "Vanessa", isAbsent: false, notes: "" },
        { name: "Wayne", isAbsent: false, notes: "" },
        { name: "Xander", isAbsent: false, notes: "" },
        { name: "Yasmin", isAbsent: false, notes: "" },
      ],
    },
    "4B": {
      grade: "4",
      students: [
        { name: "Ariel", isAbsent: false, notes: "" },
        { name: "Brady", isAbsent: false, notes: "" },
        { name: "Camila", isAbsent: false, notes: "" },
        { name: "Darren", isAbsent: false, notes: "" },
        { name: "Emery", isAbsent: false, notes: "" },
        { name: "Faye", isAbsent: false, notes: "" },
        { name: "Graham", isAbsent: false, notes: "" },
        { name: "Helena", isAbsent: false, notes: "" },
        { name: "Isaac", isAbsent: false, notes: "" },
        { name: "Jada", isAbsent: false, notes: "" },
        { name: "Kian", isAbsent: false, notes: "" },
        { name: "Lara", isAbsent: false, notes: "" },
        { name: "Miles", isAbsent: false, notes: "" },
        { name: "Nadia", isAbsent: false, notes: "" },
        { name: "Omar", isAbsent: false, notes: "" },
        { name: "Paige", isAbsent: false, notes: "" },
        { name: "Quinn", isAbsent: false, notes: "" },
        { name: "Rafael", isAbsent: false, notes: "" },
        { name: "Sky", isAbsent: false, notes: "" },
        { name: "Tina", isAbsent: false, notes: "" },
        { name: "Uri", isAbsent: false, notes: "" },
        { name: "Vivian", isAbsent: false, notes: "" },
        { name: "Willa", isAbsent: false, notes: "" },
        { name: "Xochitl", isAbsent: false, notes: "" },
        { name: "Yaretzi", isAbsent: false, notes: "" },
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
        <h1>Sunday School Attendance Log</h1>
      </div>
      <br />
      <div className="container my-4">
        <div className="input-group d-flex justify-content-center">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Enter your name..."
            />
            <label htmlFor="floatingInput">Admin Name</label>
          </div>
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
                  student: { name: string; isAbsent: boolean; notes: string },
                  index: number
                ) => (
                  <OverlayTrigger
                    key={index}
                    trigger="click"
                    placement="right"
                    overlay={
                      <Popover id={`popover-${index}`}>
                        <Popover.Header as="h3">
                          Notes for {student.name}
                        </Popover.Header>
                        <Popover.Body>
                          <textarea
                            className="form-control"
                            placeholder="Enter notes here..."
                            value={student.notes}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...student,
                                notes: e.target.value,
                              };
                              const updatedClass = classes[
                                selectedClass
                              ].students.map((s) =>
                                s.name === student.name ? updatedStudent : s
                              );
                              setClasses({
                                ...classes,
                                [selectedClass]: {
                                  ...classes[selectedClass],
                                  students: updatedClass,
                                },
                              });
                            }}
                          ></textarea>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <li
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        student.isAbsent ? "list-group-item-warning" : ""
                      }`}
                    >
                      {student.name}
                      <button
                        className={`btn btn-outline-${
                          student.isAbsent === true ? "danger" : "primary"
                        }`}
                        style={{
                          marginLeft: "60px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent popover from opening
                          const updatedStudent: {
                            name: string;
                            isAbsent: boolean;
                            notes: string;
                          } = {
                            ...student,
                            isAbsent: !student.isAbsent,
                          };
                          const updatedClass = classes[
                            selectedClass
                          ].students.map(
                            (s: {
                              name: string;
                              isAbsent: boolean;
                              notes: string;
                            }) => (s.name === student.name ? updatedStudent : s)
                          );
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
                  </OverlayTrigger>
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
