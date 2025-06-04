import {
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  FlatList, // Add FlatList import
} from "react-native";
import { Text, View } from "@/components/Themed";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import classes from "@/constants/Classes";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

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
  const [selectedClassData, setSelectedClassData] = useState<
    { name: string; isAbsent: boolean; notes: string }[]
  >([]);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [loginInput, setLoginInput] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prepare class names for dropdown
  useEffect(() => {
    // classes is now a flat object: { [className]: { grade, students: [...] } }
    const classNames = Object.entries(classes).map(([className, value]) => ({
      label: className,
      value: className,
    }));
    setClassOptions(classNames);
  }, []);

  // Update student list when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSelectedClassData([]);
      return;
    }
    // classes[selectedClass] is { grade, students: [...] }
    const classObj = (
      classes as Record<string, { grade: string; students: any[] }>
    )[selectedClass];
    if (classObj && Array.isArray(classObj.students)) {
      setSelectedClassData(
        classObj.students.map((student: any) => ({
          name: student.name,
          isAbsent: !!student.isAbsent, // use isAbsent directly
          notes: student.notes || "",
        }))
      );
    } else {
      setSelectedClassData([]);
    }
  }, [selectedClass]);

  // Load userName from SecureStore on mount
  useEffect(() => {
    (async () => {
      const storedName = await SecureStore.getItemAsync("userName");
      if (storedName) {
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

  interface Student {
    name: string;
    isAbsent: boolean;
    notes: string;
  }

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
    // Here you would typically send the attendance data to your backend
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

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        paddingBottom: 40, // for safe area
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <View style={{ margin: 15 }} />
        <Text style={styles.title}>Sunday School Attendance</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {!userName && (
          <Pressable
            style={styles.submitButton}
            onPress={() => setShowLoginModal(true)}
          >
            <Text style={styles.submitButtonText}>Login</Text>
          </Pressable>
        )}
        <Modal visible={showLoginModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setShowLoginModal(false)}
                hitSlop={10}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#888",
                  }}
                >
                  ×
                </Text>
              </Pressable>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
              >
                Login
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 6,
                  padding: 10,
                  backgroundColor: "#fff",
                  fontSize: 16,
                  width: 200,
                  marginBottom: 16,
                }}
                placeholder="Enter your name..."
                value={loginInput}
                onChangeText={setLoginInput}
                autoFocus
              />
              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: loginInput.trim() ? "#FFD600" : "#eee",
                  },
                ]}
                onPress={() => {
                  if (loginInput.trim()) {
                    setUserName(loginInput.trim());
                    setShowLoginModal(false);
                  }
                }}
                disabled={!loginInput.trim()}
              >
                <Text style={{ fontWeight: "bold", color: "#333" }}>Login</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {userName && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "80%",
                justifyContent: "space-between",
                marginBottom: 10,
                backgroundColor: "#eee",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#eee",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginRight: 12,
                  }}
                >
                  Logged in as: {userName}
                </Text>
              </View>
              <Pressable
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 24,
                overflow: "visible",
              }}
            >
              <DropDownPicker
                open={classesOpen}
                value={selectedClass}
                items={classOptions}
                setOpen={setClassesOpen}
                setValue={setSelectedClass}
                setItems={setClassOptions}
                placeholder="Class"
                containerStyle={{ width: 150, marginRight: 10, zIndex: 3000 }}
                style={{ backgroundColor: "#fff" }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  zIndex: 3000,
                }}
                zIndex={3000}
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
                placeholder="Period"
                containerStyle={{ width: 150, marginLeft: 10, zIndex: 2000 }}
                style={{ backgroundColor: "#fff" }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  zIndex: 2000,
                }}
                zIndex={2000}
                modalTitle="Select Period"
                dropDownDirection="BOTTOM"
              />
            </View>
            {selectedClass && (
              <View style={{ marginTop: 20, width: "80%" }}>
                <Pressable
                  style={styles.submitButton}
                  onPress={handleSubmitAttendance}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </Pressable>
                <Text style={styles.subtitle}>Students in {selectedClass}</Text>
                <FlatList
                  data={selectedClassData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item: student, index }) => (
                    <View
                      style={{
                        flexDirection: "column",
                        marginVertical: 5,
                        backgroundColor: "#f9f9f9",
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Text style={{ fontSize: 18 }}>{student.name}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <Pressable
                            onPress={() => handleAbsenceToggle(student)}
                            style={{ marginRight: 10 }}
                          >
                            <Text>
                              {student.isAbsent ? "❌ Absent" : "✅ Present"}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() =>
                              setOpenNoteIndex(
                                openNoteIndex === index ? null : index
                              )
                            }
                          >
                            <Text style={{ fontSize: 18 }}>
                              {openNoteIndex === index ? "▲" : "▼"}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                      {openNoteIndex === index && (
                        <View style={{ marginTop: 10 }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              borderColor: "#ccc",
                              borderRadius: 6,
                              padding: 8,
                              backgroundColor: "#fff",
                              fontSize: 16,
                            }}
                            placeholder="Add notes..."
                            value={student.notes}
                            onChangeText={(text) => {
                              setSelectedClassData((prevData) =>
                                prevData.map((s, i) =>
                                  i === index ? { ...s, notes: text } : s
                                )
                              );
                            }}
                            multiline
                          />
                        </View>
                      )}
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text
                      style={{
                        color: "#888",
                        fontStyle: "italic",
                        marginTop: 10,
                      }}
                    >
                      No students in this class.
                    </Text>
                  }
                  contentContainerStyle={{ paddingBottom: 40 }}
                />
              </View>
            )}
            <Modal visible={showConfirmModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 16,
                    }}
                  >
                    Confirm Submission
                  </Text>
                  <Text style={{ marginBottom: 24 }}>
                    Are you sure you want to submit attendance for{" "}
                    {selectedClass} ({selectedPeriod})?
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pressable
                      style={[
                        styles.modalButton,
                        { backgroundColor: "#FFD600" },
                      ]}
                      onPress={confirmSubmit}
                    >
                      <Text style={{ fontWeight: "bold", color: "#333" }}>
                        Yes, Submit
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.modalButton, { backgroundColor: "#eee" }]}
                      onPress={cancelSubmit}
                    >
                      <Text style={{ fontWeight: "bold", color: "#333" }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal visible={showLogoutModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 16,
                    }}
                  >
                    Confirm Logout
                  </Text>
                  <Text style={{ marginBottom: 24 }}>
                    Are you sure you want to logout?
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pressable
                      style={[
                        styles.modalButton,
                        { backgroundColor: "#FFD600" },
                      ]}
                      onPress={() => {
                        setUserName("");
                        setLoginInput("");
                        setSelectedClass(null);
                        setSelectedPeriods(null);
                        setSelectedClassData([]);
                        setShowLogoutModal(false);
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#333" }}>
                        Yes, Logout
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.modalButton, { backgroundColor: "#eee" }]}
                      onPress={() => setShowLogoutModal(false)}
                    >
                      <Text style={{ fontWeight: "bold", color: "#333" }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 25, // Adjust for Android status bar
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  submitButton: {
    backgroundColor: "#FFD600",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "#f3f3f3", // match main background
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutButtonText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
