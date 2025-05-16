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
import "bootstrap-icons/font/bootstrap-icons.css";
import Cookies from "js-cookie";

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

  // State for remove confirmation modal
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);

  // State for name login modal
  const [showNameModal, setShowNameModal] = useState(false);

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

  // On mount, check for login cookies
  useEffect(() => {
    const savedLogin = Cookies.get("ss_login");
    const savedAdmin = Cookies.get("ss_admin");
    const savedName = Cookies.get("ss_name");
    if (savedLogin === "true") {
      setLogin(true);
      if (savedAdmin === "true") setIsAdmin(true);
      if (savedName) setSubmitterName(savedName);
    }
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
      setSubmitterName(email);
      setEmail("");
      setPasscode("");
      // Set cookies
      Cookies.set("ss_login", "true");
      Cookies.set("ss_admin", "true");
      Cookies.set("ss_name", email);
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed");
    }
  };

  return (
    <>
      {/* Admin Login button at the top right */}
      <div
        className="position-absolute top-0 end-0 m-3 d-flex flex-row align-items-center gap-3"
        style={{ zIndex: 1050 }}
      >
        {isLoggedIn && (
          <span style={{ fontWeight: 500, fontSize: 18, color: "#333" }}>
            Welcome <span style={{ fontStyle: "italic" }}>{submitterName}</span>
          </span>
        )}
        {!isAdmin && !isLoggedIn && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowEmailModal(true)}
          >
            Admin Login
          </button>
        )}
        {(isLoggedIn || isAdmin) && (
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              setLogin(false);
              setIsAdmin(false);
              setSubmitterName("");
              setEmail("");
              setPasscode("");
              setSelectedClass("none");
              setSelectedPeriod("none");
              // Remove cookies
              Cookies.remove("ss_login");
              Cookies.remove("ss_admin");
              Cookies.remove("ss_name");
            }}
          >
            Log Out
          </button>
        )}
      </div>
      {/* IALFM Logo and Title */}
      {isLoggedIn ? (
        <div
          className="position-absolute top-0 start-0 m-3 d-flex flex-row align-items-center logo-title-loggedin"
          style={{ zIndex: 1049 }}
        >
          <img
            src="\Big_IALFM_Logo.png"
            alt="IALFM Logo"
            className="logo-img-transition"
            style={{ maxWidth: 60, marginRight: 12 }}
          />
          <h1
            className="title-transition"
            style={{
              fontSize: 20,
              margin: 0,
              textAlign: "left",
              whiteSpace: "nowrap",
              transform: "translateY(-8px)",
            }}
          >
            Sunday School Attendance Form
          </h1>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center mt-3">
          <img
            src="\Big_IALFM_Logo.png"
            alt="IALFM Logo"
            style={{ maxWidth: 120, marginBottom: 8 }}
          />
          <h1>Sunday School Attendance Form</h1>
        </div>
      )}
      <br />

      {/* Login Form (only if not logged in) */}
      {!isLoggedIn && !isAdmin && (
        <>
          <div className="container my-4">
            <div className="input-group d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => setShowNameModal(true)}
              >
                Login
              </button>
            </div>
          </div>
          {/* Name Login Modal */}
          <div
            className={`modal fade${showNameModal ? " show d-block" : ""}`}
            tabIndex={-1}
            style={{
              background: showNameModal ? "rgba(0,0,0,0.5)" : undefined,
            }}
            aria-modal={showNameModal ? "true" : undefined}
            role="dialog"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Login</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowNameModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nameInput"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      placeholder="Enter your name..."
                      autoFocus
                    />
                    <label htmlFor="nameInput">Your Name</label>
                  </div>
                  {showError && (
                    <div className="alert alert-danger">
                      Please enter your name.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowNameModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (submitterName.trim() === "") {
                        setError(true);
                      } else {
                        setLogin(true);
                        // Set cookies
                        Cookies.set("ss_login", "true");
                        Cookies.set("ss_admin", "false");
                        Cookies.set("ss_name", submitterName);
                        setShowNameModal(false);
                      }
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
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
              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <div className="form-floating mb-3">
                  <input
                    type={showPasscode ? "text" : "password"}
                    className="form-control"
                    id="passcodeInput"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Passcode"
                  />
                  <label htmlFor="passcodeInput">Passcode</label>
                </div>
                <button
                  className="btn btn-outline-secondary position-absolute top-0 end-0"
                  style={{ marginTop: "8px", marginRight: "8px" }}
                  onClick={() => setShowPasscode(!showPasscode)}
                >
                  <i
                    className={`bi bi-${showPasscode ? "eye-slash" : "eye"}`}
                  ></i>
                </button>
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

      {/* Class and Period Dropdowns (only if logged in) */}
      {isLoggedIn && (
        <div className="d-flex justify-content-center gap-3">
          {/* Class Dropdown */}
          <div className="btn-group" role="group">
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
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              {/* Render class options grouped by grade */}
              {(() => {
                return Object.entries(classes)
                  .sort(([, a], [, b]) => a.grade.localeCompare(b.grade))
                  .flatMap(([name, data], index, arr) => {
                    const nextItem = arr[index + 1];
                    const isLastOfGrade =
                      !nextItem || nextItem[1].grade !== data.grade;
                    const elements = [];
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
          {/* Period Dropdown */}
          <div className="btn-group" role="group">
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
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
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
      {selectedClass !== "none" && (
        <div className="d-flex flex-column align-items-center w-100 mt-4">
          <div
            className="d-flex flex-column align-items-center w-100 mb-3"
            style={{ marginTop: "24px" }}
          >
            <div className="d-flex flex-row justify-content-center mb-2 gap-2">
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
                  className="btn btn-success btn-lg"
                  onClick={() => setShowAddChildModal(true)}
                >
                  Add Child
                </button>
              )}
            </div>
            <ul
              className="list-group mt-2 w-100"
              style={{ maxWidth: 600, marginTop: "18px" }}
            >
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
                              style={{ minHeight: "60px", fontSize: "14px" }}
                            ></textarea>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <li
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          student.isAbsent ? "list-group-item-warning" : ""
                        }`}
                        style={{
                          fontSize: "15px",
                        }}
                      >
                        <span style={{ marginRight: "12px" }}>
                          {student.name}
                        </span>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ gap: "6px" }}
                        >
                          {isAdmin && (
                            <>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Remove Child"
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.2,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStudentToRemove(student.name);
                                  setShowRemoveModal(true);
                                }}
                              >
                                Remove
                              </button>
                              {/* Remove Confirmation Modal */}
                              {showRemoveModal &&
                                studentToRemove === student.name && (
                                  <div
                                    className="modal fade show d-block"
                                    tabIndex={-1}
                                    style={{
                                      background: "rgba(0,0,0,0.5)",
                                    }}
                                    aria-modal="true"
                                    role="dialog"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h5 className="modal-title">
                                            Remove Student
                                          </h5>
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              setShowRemoveModal(false)
                                            }
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          Are you sure you want to remove{" "}
                                          <strong>{student.name}</strong> from
                                          this class?
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                              setShowRemoveModal(false)
                                            }
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={async () => {
                                              const updatedStudents = classes[
                                                selectedClass
                                              ].students.filter(
                                                (s) => s.name !== student.name
                                              );
                                              await setDoc(
                                                doc(
                                                  db,
                                                  "classes",
                                                  selectedClass
                                                ),
                                                {
                                                  ...classes[selectedClass],
                                                  students: updatedStudents,
                                                }
                                              );
                                              setClasses({
                                                ...classes,
                                                [selectedClass]: {
                                                  ...classes[selectedClass],
                                                  students: updatedStudents,
                                                },
                                              });
                                              setShowRemoveModal(false);
                                              setShowRemoveToast(true);
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </>
                          )}
                          <button
                            className={`btn btn-outline-${
                              student.isAbsent === true
                                ? "secondary"
                                : "primary"
                            } btn-sm`}
                            style={{
                              fontSize: "13px",
                              lineHeight: 1.2,
                              marginLeft: 0,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
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
                        </div>
                      </li>
                    </OverlayTrigger>
                  )
                )}
            </ul>

            {/* Secondary submit button */}
            <div className="d-flex flex-row justify-content-center mb-2 mt-3 gap-2">
              <button
                type="button"
                className="btn btn-warning btn-lg"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Submit
              </button>
            </div>
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
          </div>
        </div>
      )}

      <br></br>
      {/* Grouped Submit and Add Child Buttons (below student list) */}
      {/* Removed old button group from below the list */}

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
