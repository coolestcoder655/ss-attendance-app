import {
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Text, View } from "@/components/Themed";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState, useContext } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { UserContext } from "@/context/userContext";

interface Student {
  name: string;
  isAbsent: boolean;
  notes: string;
}

const IndexPage = () => {
  const [classesOpen, setClassesOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [periodsOpen, setPeriodsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriods] = useState<string | null>(null);
  const [periodOptions, setPeriodOptions] = useState<
    { label: string; value: string }[]
  >([
    { label: "Period 1", value: "Period 1" },
    { label: "Period 2", value: "Period 2" },
    { label: "Period 3", value: "Period 3" },
  ]);
  const [selectedClassData, setSelectedClassData] = useState<Student[]>([]);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { userName, setUserName } = useContext(UserContext) ?? {};
  const [loginInput, setLoginInput] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [classes, setClasses] = useState<
    Record<
      string,
      {
        grade: string;
        students: { name: string; isAbsent: boolean; notes: string }[];
      }
    >
  >({});

  // Fetch classes from Firestore on mount
  useEffect(() => {
    const fetchClasses = async () => {
      const snapshot = await getDocs(collection(db, "classes"));
      const classesData: Record<
        string,
        {
          grade: string;
          students: { name: string; isAbsent: boolean; notes: string }[];
        }
      > = {};
      snapshot.forEach((doc) => {
        classesData[doc.id] = doc.data() as {
          grade: string;
          students: { name: string; isAbsent: boolean; notes: string }[];
        };
      });
      setClasses(classesData);
      const classNames = Object.entries(classesData).map(([className]) => ({
        label: className,
        value: className,
      }));
      setClassOptions(classNames);
    };
    fetchClasses();
  }, []);

  // Update student list when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSelectedClassData([]);
      return;
    }
    const classObj = classes[selectedClass];
    if (classObj && Array.isArray(classObj.students)) {
      setSelectedClassData(
        classObj.students.map((student: any) => ({
          name: student.name,
          isAbsent: !!student.isAbsent,
          notes: student.notes || "",
        }))
      );
    } else {
      setSelectedClassData([]);
    }
  }, [selectedClass, classes]);

  // Load userName from SecureStore on mount
  useEffect(() => {
    (async () => {
      const storedName = await SecureStore.getItemAsync("userName");
      if (storedName && setUserName) {
        setUserName(storedName);
      }
    })();
  }, []);

  // Save userName to SecureStore when it changes
  useEffect(() => {
    if (userName) {
      SecureStore.setItemAsync("userName", userName);
    } else {
      SecureStore.deleteItemAsync("userName");
    }
  }, [userName]);

  // Dynamic color functions (following the grade pattern)
  const getAttendanceColor = (isPresent: boolean) => {
    return isPresent ? "#16a34a" : "#dc2626"; // green-600 : red-600
  };

  const getAttendanceBgColor = (isPresent: boolean) => {
    return isPresent ? "#f0fdf4" : "#fef2f2"; // green-50 : red-50
  };

  const getAttendanceBorderColor = (isPresent: boolean) => {
    return isPresent ? "#bbf7d0" : "#fecaca"; // green-200 : red-200
  };

  const handleAbsenceToggle = (student: Student) => {
    setSelectedClassData((prevData: Student[]) =>
      prevData.map((s: Student) =>
        s.name === student.name ? { ...s, isAbsent: !s.isAbsent } : s
      )
    );
  };

  const handleSubmitAttendance = () => {
    if (!selectedClass || !selectedPeriod) {
      alert("Please select a class and period.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const submissionData = {
      class: selectedClass,
      period: selectedPeriod,
      attendance: selectedClassData.map((student) => ({
        name: student.name,
        isAbsent: student.isAbsent,
        notes: student.notes,
      })),
      date: new Date().toISOString(),
      submitterName: userName,
    };

    const submitAttendance = async () => {
      try {
        const docRef = await addDoc(
          collection(db, "submissions"),
          submissionData
        );
        console.log("Attendance submitted with ID: ", docRef.id);
        alert("Attendance submitted successfully!");
      } catch (error) {
        console.error("Error submitting attendance: ", error);
        alert("Failed to submit attendance. Please try again.");
      }
    };

    submitAttendance();

    // Reset the form after submission
    setSelectedClass(null);
    setSelectedPeriods(null);
    setSelectedClassData([]);
    setShowConfirmModal(false);
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Calculate attendance stats
  const presentCount = selectedClassData.filter((s) => !s.isAbsent).length;
  const totalCount = selectedClassData.length;
  const attendanceRate =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const ChevronDown = () => <Text style={styles.chevron}>▼</Text>;
  const ChevronRight = () => <Text style={styles.chevron}>▶</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />

      {/* Main Heading (removed old mainHeadingContainer) */}
      <View style={styles.header}>
        <View style={[styles.headerContent, { backgroundColor: "#4f46e5" }]}>
          <Text style={[styles.headerTitle, { backgroundColor: "#4f46e5" }]}>
            Attendance Tracker
          </Text>
        </View>
        <Text style={styles.mainSubheading}>📚 IALFM Sunday School</Text>
        {selectedClass && selectedPeriod && (
          <View style={styles.attendanceCard}>
            <Text style={styles.attendanceLabel}>Current Session</Text>
            <Text style={styles.attendanceClass}>
              {selectedClass} - {selectedPeriod}
            </Text>
            <View style={styles.attendanceStats}>
              <Text
                style={[
                  styles.attendanceRate,
                  { color: getAttendanceColor(attendanceRate >= 80) },
                ]}
              >
                {attendanceRate}%
              </Text>
              <Text style={styles.attendanceCount}>
                {presentCount}/{totalCount} Present
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!userName && (
          <>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../images/Big_IALFM_Logo.png")}
                style={styles.logo}
              />
            </View>
            <Pressable
              style={styles.primaryButton}
              onPress={() => setShowLoginModal(true)}
            >
              <Text style={styles.primaryButtonText}>🔑 Login to Continue</Text>
            </Pressable>
          </>
        )}

        {userName && (
          <>
            {/* User Status Card */}
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userIcon}>👤</Text>
                <View>
                  <Text style={styles.userLabel}>Logged in as</Text>
                  <Text style={styles.userName}>{userName}</Text>
                </View>
              </View>
              <Pressable
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>

            {/* Selection Card */}
            <View style={[styles.selectionCard, { zIndex: 5000 }]}>
              <View style={styles.selectionHeader}>
                <Text style={styles.selectionIcon}>⚙️</Text>
                <Text style={styles.selectionTitle}>Class Selection</Text>
              </View>

              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={classesOpen}
                  value={selectedClass}
                  items={classOptions}
                  setOpen={setClassesOpen}
                  setValue={setSelectedClass}
                  setItems={setClassOptions}
                  placeholder="Select Class"
                  containerStyle={styles.dropdownWrapper}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownList}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  zIndex={4000}
                  zIndexInverse={1000}
                  modalTitle="Select Class"
                  dropDownDirection="BOTTOM"
                />

                <DropDownPicker
                  open={periodsOpen}
                  value={selectedPeriod}
                  items={periodOptions}
                  setOpen={setPeriodsOpen}
                  setValue={setSelectedPeriods}
                  setItems={setPeriodOptions}
                  placeholder="Select Period"
                  containerStyle={styles.dropdownWrapper}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownList}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  zIndex={3000}
                  zIndexInverse={2000}
                  modalTitle="Select Period"
                  dropDownDirection="BOTTOM"
                />
              </View>
            </View>

            {/* Students List */}
            {selectedClass && (
              <View style={[styles.studentsSection, { zIndex: 1 }]}>
                <View style={styles.studentsHeader}>
                  <Text style={styles.studentsIcon}>👥</Text>
                  <Text style={styles.studentsTitle}>
                    Students in {selectedClass}
                  </Text>
                </View>

                <FlatList
                  data={selectedClassData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item: student, index }) => {
                    const isExpanded = openNoteIndex === index;
                    const isPresent = !student.isAbsent;

                    return (
                      <View
                        style={[
                          styles.studentCard,
                          {
                            backgroundColor: getAttendanceBgColor(isPresent),
                            borderColor: getAttendanceBorderColor(isPresent),
                          },
                        ]}
                      >
                        <Pressable
                          style={styles.studentHeader}
                          onPress={() => handleAbsenceToggle(student)}
                        >
                          <View
                            style={[
                              styles.studentInfo,
                              {
                                backgroundColor:
                                  getAttendanceBgColor(isPresent),
                              },
                            ]}
                          >
                            <Text style={styles.studentName}>
                              {student.name}
                            </Text>
                            <Text
                              style={[
                                styles.studentStatus,
                                { color: getAttendanceColor(isPresent) },
                              ]}
                            >
                              {isPresent ? "✅ Present" : "❌ Absent"}
                            </Text>
                          </View>

                          <Pressable
                            style={[
                              styles.notesToggle,
                              {
                                backgroundColor:
                                  getAttendanceBgColor(isPresent),
                              },
                            ]}
                            onPress={(e) => {
                              e.stopPropagation();
                              setOpenNoteIndex(isExpanded ? null : index);
                            }}
                          >
                            {isExpanded ? <ChevronDown /> : <ChevronRight />}
                          </Pressable>
                        </Pressable>

                        {isExpanded && (
                          <View style={styles.notesContainer}>
                            <Text style={styles.notesLabel}>Notes:</Text>
                            <TextInput
                              style={styles.notesInput}
                              placeholder="Add notes for this student..."
                              value={student.notes}
                              onChangeText={(text) => {
                                setSelectedClassData((prevData) =>
                                  prevData.map((s, i) =>
                                    i === index ? { ...s, notes: text } : s
                                  )
                                );
                              }}
                              multiline
                              numberOfLines={3}
                            />
                          </View>
                        )}
                      </View>
                    );
                  }}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>📋</Text>
                      <Text style={styles.emptyText}>
                        No students in this class
                      </Text>
                    </View>
                  }
                  scrollEnabled={false}
                />

                {selectedClassData.length > 0 && (
                  <Pressable
                    style={styles.submitButton}
                    onPress={handleSubmitAttendance}
                  >
                    <Text style={styles.submitButtonText}>
                      📤 Submit Attendance
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        )}

        {/* Login Modal */}
        <Modal visible={showLoginModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable
                style={styles.modalClose}
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </Pressable>

              <Text style={styles.modalIcon}>🔐</Text>
              <Text style={styles.modalTitle}>Welcome Back</Text>
              <Text style={styles.modalSubtitle}>
                Enter your name to continue
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Enter your name..."
                value={loginInput}
                onChangeText={setLoginInput}
                autoFocus
              />

              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: loginInput.trim() ? "#4f46e5" : "#e5e7eb",
                  },
                ]}
                onPress={() => {
                  if (loginInput.trim()) {
                    if (setUserName) setUserName(loginInput.trim());
                    setShowLoginModal(false);
                    setLoginInput("");
                  }
                }}
                disabled={!loginInput.trim()}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: loginInput.trim() ? "#fff" : "#9ca3af" },
                  ]}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalIcon}>📋</Text>
              <Text style={styles.modalTitle}>Confirm Submission</Text>
              <Text style={styles.modalSubtitle}>
                Submit attendance for {selectedClass} ({selectedPeriod})?
              </Text>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#16a34a" }]}
                  onPress={confirmSubmit}
                >
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    Yes, Submit
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#e5e7eb" }]}
                  onPress={cancelSubmit}
                >
                  <Text style={[styles.modalButtonText, { color: "#374151" }]}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout Modal */}
        <Modal visible={showLogoutModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalIcon}>👋</Text>
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to logout?
              </Text>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#dc2626" }]}
                  onPress={() => {
                    if (setUserName) setUserName("");
                    setLoginInput("");
                    setSelectedClass(null);
                    setSelectedPeriods(null);
                    setSelectedClassData([]);
                    setShowLogoutModal(false);
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    Yes, Logout
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#e5e7eb" }]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: "#374151" }]}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  mainSubheading: {
    fontSize: 16,
    color: "#c7d2fe",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },

  // Header styles
  header: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 24,
    paddingVertical: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitleContainer: {
    backgroundColor: "#4f46e5",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  attendanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  attendanceLabel: {
    fontSize: 12,
    color: "#c7d2fe",
    marginBottom: 4,
  },
  attendanceClass: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  attendanceStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  attendanceRate: {
    fontSize: 28,
    fontWeight: "bold",
  },
  attendanceCount: {
    fontSize: 12,
    color: "#c7d2fe",
  },

  // Content styles
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // Logo styles
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  // Card styles
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  userIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  userLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },

  selectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  selectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  dropdownContainer: {
    flexDirection: "row",
    gap: 12,
    zIndex: 1000,
  },
  dropdownWrapper: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "#f9fafb",
    borderColor: "#d1d5db",
    borderRadius: 8,
    minHeight: 48,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Students section
  studentsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  studentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  studentsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  studentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },

  // Student card styles
  studentCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  studentHeader: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  studentStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  notesToggle: {
    padding: 8,
    borderRadius: 6,
  },
  notesContainer: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#374151",
    textAlignVertical: "top",
    minHeight: 80,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },

  // Button styles
  primaryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#fef2f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },

  // Chevron styles
  chevron: {
    fontSize: 16,
    color: "#6b7280",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6b7280",
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#f9fafb",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
});
