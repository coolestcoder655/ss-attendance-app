import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  Toast,
  ToastContainer,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Submission data type for Firestore
type SubmissionDataType = {
  submitterName: String;
  datetime: String | Date;
  submittedClasses: any;
  period: String;
};

function App() {
  // State for toast notifications
  const [showing, setShow] = useState(false);
  const [showError, setError] = useState(false);
  // New: Toasts for add/remove child
  const [showAddToast, setShowAddToast] = useState(false);
  const [showRemoveToast, setShowRemoveToast] = useState(false);
  // State to track which popover is open (for student notes)
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  // State for all classes and their students
  const [classes, setClasses] = useState<
    Record<
      string,
      {
        grade: string;
        students: { name: string; isAbsent: boolean; notes: string }[];
      }
    >
  >({});

  // State for selected class, period, login, and admin name
  const [selectedClass, setSelectedClass] = useState("none");
  const [selectedPeriod, setSelectedPeriod] = useState("none");
  const [isLoggedIn, setLogin] = useState(false);
  const [submitterName, setSubmitterName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // State for email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const auth = getAuth();

  // State for Add Child modal and new child name
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");

  // Variables for submission data
  let submissionData: SubmissionDataType;

  // Fetch classes from Firestore on mount
  useEffect(() => {
    const fetchClasses = async () => {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const classesData: Record<
        string,
        {
          grade: string;
          students: { name: string; isAbsent: boolean; notes: string }[];
        }
      > = {};
      querySnapshot.forEach((doc) => {
        classesData[doc.id] = doc.data() as {
          grade: string;
          students: { name: string; isAbsent: boolean; notes: string }[];
        };
      });
      setClasses(classesData);
    };
    fetchClasses();
  }, []);

  // Handle attendance form submission
  function handleAttendenceSubmission(): void {
    let today: Date = new Date();
    // Validate required fields
    if (
      selectedClass === "none" ||
      selectedPeriod === "none" ||
      submitterName === ""
    ) {
      setError(true);
      return;
    }
    // Prepare submission data
    submissionData = {
      submitterName: submitterName,
      datetime: String(today),
      submittedClasses: classes[selectedClass],
      period: selectedPeriod,
    };
    console.log(submissionData);
    // Upload to Firestore
    const uploadSubmission = async () => {
      const customId = `${submissionData.submitterName}_${Date.now()}`;
      const docRef = doc(db, "submissions", customId);
      await setDoc(docRef, submissionData);
    };
    uploadSubmission();
    // Show success toast and reset form
    setShow(true);
    setSelectedClass("none");
    setSelectedPeriod("none");
    setSubmitterName("");
    setLogin(false);
    return;
  }

  // Email sign-in handler
  const handleEmailSignIn = async () => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, passcode);
      setLogin(true);
      setIsAdmin(true);
      setShowEmailModal(false);
      setEmail("");
      setPasscode("");
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed");
    }
  };

  return (
    <>
      {/* IALFM Logo at the top */}
      <div className="d-flex flex-column align-items-center mt-3">
        <img
          src="/ialfmLogo.svg"
          alt="IALFM Logo"
          style={{ maxWidth: 120, marginBottom: 8 }}
        />
        <h1>Sunday School Attendance Form</h1>
      </div>
      <br />

      {/* Login Form (only if not logged in) */}
      {!isLoggedIn && (
        <div className="container my-4">
          <div className="input-group d-flex justify-content-center">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Enter your name..."
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
              <label htmlFor="floatingInput">Admin Name</label>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setLogin(true);
              }}
            >
              Login
            </button>
            <button
              className="btn btn-outline-secondary ms-2"
              onClick={() => setShowEmailModal(true)}
            >
              Admin Login
            </button>
          </div>
        </div>
      )}

      {/* Email Auth Modal */}
      <div
        className={`modal fade${showEmailModal ? " show d-block" : ""}`}
        tabIndex={-1}
        style={{ background: showEmailModal ? "rgba(0,0,0,0.5)" : undefined }}
        aria-modal={showEmailModal ? "true" : undefined}
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Admin Login</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEmailModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoFocus
                />
                <label htmlFor="emailInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="passcodeInput"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Passcode"
                />
                <label htmlFor="passcodeInput">Passcode</label>
              </div>
              {authError && (
                <div className="alert alert-danger">{authError}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEmailSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message (only if logged in) */}
      <div className="d-flex justify-content-center">
        {isLoggedIn && (
          <h1>
            Welcome <span style={{ fontStyle: "italic" }}>{submitterName}</span>
          </h1>
        )}
      </div>
      {/* Log Out button above selectors */}
      {(isLoggedIn || isAdmin) && (
        <div className="d-flex flex-column align-items-center mt-3">
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => {
              setLogin(false);
              setIsAdmin(false);
              setSubmitterName("");
              setEmail("");
              setPasscode("");
            }}
          >
            Log Out
          </button>
        </div>
      )}
      <br />

      <br />
      <br />

      {/* Class and Period Dropdowns (only if logged in) */}
      {isLoggedIn && (
        <div className="d-flex justify-content-center">
          <div className="btn-group" role="group">
            {/* Class Dropdown */}
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
              {/* Render class options grouped by grade */}
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
                          <h6 className="dropdown-header">
                            Grade {data.grade}
                          </h6>
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
            {/* Period Dropdown */}
            <button
              className="btn btn-outline-dark dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedPeriod !== "none" ? selectedPeriod : "Period"}
            </button>
            <ul
              className="dropdown-menu"
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Render period options */}
              {["Period 1", "Period 2", "Period 3"].map((period) => (
                <li
                  key={period}
                  className={`dropdown-item ${
                    selectedPeriod === period ? "active" : ""
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Helper text below dropdowns */}
      <div
        className="form-text d-flex justify-content-center"
        id="basic-addon4"
      >
        {isLoggedIn
          ? "Please select your class and period."
          : "Please enter your name."}
      </div>
      {/* Student list for selected class */}
      <div className="d-flex justify-content-center">
        {selectedClass !== "none" && (
          <>
            <ul className="list-group mt-4">
              {selectedClass &&
                classes[selectedClass]?.students.map(
                  (
                    student: { name: string; isAbsent: boolean; notes: string },
                    index: number
                  ) => (
                    // OverlayTrigger for student notes popover
                    <OverlayTrigger
                      key={index}
                      trigger="click"
                      placement="left"
                      show={openPopoverIndex === index}
                      onToggle={(isOpen) =>
                        setOpenPopoverIndex(isOpen ? index : null)
                      }
                      overlay={
                        <Popover
                          id={`popover-${index}`}
                          style={{ zIndex: 1040 }}
                        >
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
                        {isAdmin && (
                          <button
                            className="btn btn-outline-danger btn-sm ms-2"
                            title="Remove Child"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const updatedStudents = classes[
                                selectedClass
                              ].students.filter((s) => s.name !== student.name);
                              // Update Firestore
                              await setDoc(doc(db, "classes", selectedClass), {
                                ...classes[selectedClass],
                                students: updatedStudents,
                              });
                              // Update local state
                              setClasses({
                                ...classes,
                                [selectedClass]: {
                                  ...classes[selectedClass],
                                  students: updatedStudents,
                                },
                              });
                              setShowRemoveToast(true); // Show remove toast
                            }}
                          >
                            Remove
                          </button>
                        )}
                        {/* Button to toggle absent/present */}
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
                              }) =>
                                s.name === student.name ? updatedStudent : s
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
            {/* Add Child Modal */}
            <div
              className={`modal fade${
                showAddChildModal ? " show d-block" : ""
              }`}
              tabIndex={-1}
              style={{
                background: showAddChildModal ? "rgba(0,0,0,0.5)" : undefined,
              }}
              aria-modal={showAddChildModal ? "true" : undefined}
              role="dialog"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Add Child to {selectedClass}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddChildModal(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="childNameInput"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        placeholder="Child Name"
                        autoFocus
                      />
                      <label htmlFor="childNameInput">Child Name</label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddChildModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={async () => {
                        if (!newChildName.trim()) return;
                        const updatedStudents = [
                          ...classes[selectedClass].students,
                          {
                            name: newChildName.trim(),
                            isAbsent: false,
                            notes: "",
                          },
                        ];
                        // Update Firestore
                        await setDoc(doc(db, "classes", selectedClass), {
                          ...classes[selectedClass],
                          students: updatedStudents,
                        });
                        // Update local state
                        setClasses({
                          ...classes,
                          [selectedClass]: {
                            ...classes[selectedClass],
                            students: updatedStudents,
                          },
                        });
                        setShowAddChildModal(false);
                        setNewChildName("");
                        setShowAddToast(true); // Show add toast
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <br></br>
      {/* Grouped Submit and Add Child Buttons (below student list) */}
      {selectedClass !== "none" && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          <button
            type="button"
            className="btn btn-warning btn-lg"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Submit
          </button>
          {isAdmin && (
            <button
              className="btn btn-success"
              onClick={() => setShowAddChildModal(true)}
            >
              Add Child
            </button>
          )}
        </div>
      )}

      {/* Modal for submit confirmation */}
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

      {/* Toast notification for success */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        containerPosition="fixed"
      >
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

      {/* Toast notification for error */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        containerPosition="fixed"
      >
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
              <li>Period</li>
            </ul>
            <span>If this error keeps occuring, please try again later.</span>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Toast notification for add child */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        containerPosition="fixed"
      >
        <Toast
          onClose={() => setShowAddToast(false)}
          show={showAddToast}
          delay={2500}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto" style={{ color: "green" }}>
              Child Added
            </strong>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>
            Child was successfully added to the class.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Toast notification for remove child */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        containerPosition="fixed"
      >
        <Toast
          onClose={() => setShowRemoveToast(false)}
          show={showRemoveToast}
          delay={2500}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto" style={{ color: "red" }}>
              Child Removed
            </strong>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>
            Child was successfully removed from the class.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
