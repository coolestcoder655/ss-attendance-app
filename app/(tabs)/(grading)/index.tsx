import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Text, View } from "@/components/Themed";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { GradingContext } from "@/app/(tabs)/(grading)/gradingContext";
import { Link, router } from "expo-router";

interface Student {
  name: string;
  notes: string;
}

const Index = () => {
  const [classesOpen, setClassesOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classes, setClasses] = useState<
    Record<string, { grade: string; students: Student[] }>
  >({});
  const [students, setStudents] = useState<Student[]>([]);
  const gradingContext = useContext(GradingContext) as unknown as {
    selectedStudent: Student | null;
    setSelectedStudent: (student: Student | null) => void;
  };
  const selectedStudent = gradingContext.selectedStudent;
  const setSelectedStudent = gradingContext.setSelectedStudent;

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleChangeClass = (className: string | null) => {
    setSelectedClass(className);
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      const snapshot = await getDocs(collection(db, "classes"));
      const classesData: Record<
        string,
        { grade: string; students: Student[] }
      > = {};
      snapshot.forEach((doc) => {
        classesData[doc.id] = doc.data() as {
          grade: string;
          students: Student[];
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

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
    } else {
      const classObj = classes[selectedClass];
      setStudents(classObj?.students ?? []);
    }
  }, [selectedClass, classes]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4f46e5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerContent, { backgroundColor: "#4f46e5" }]}>
          <View
            style={[
              styles.headerTitleContainer,
              { backgroundColor: "#4f46e5" },
            ]}
          >
            <Text style={styles.headerTitle}>Grade Management</Text>
            <Text style={styles.headerSubtitle}>Academic Year 2024-2025</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Class Selection Card */}
        <View style={styles.selectionCard}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionIcon}>🏫</Text>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionTitle}>Select Class</Text>
              <Text style={styles.selectionSubtitle}>
                {selectedClass || "Choose a class to view students"}
              </Text>
            </View>
          </View>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={classesOpen}
              value={selectedClass}
              items={classOptions}
              setOpen={setClassesOpen}
              setValue={setSelectedClass}
              setItems={setClassOptions}
              onChangeValue={handleChangeClass}
              placeholder="Select a class"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={1000}
              zIndexInverse={3000}
              dropDownDirection="BOTTOM"
            />
          </View>
        </View>

        {/* Dropdown Spacer - adds space when dropdown is open */}
        {classesOpen && <View style={styles.dropdownSpacer} />}

        {/* Students List */}
        {selectedClass && (
          <View style={[styles.studentsCard, { zIndex: 50 }]}>
            <View style={styles.studentsHeader}>
              <Text style={styles.studentsIcon}>👥</Text>
              <View style={styles.studentsInfo}>
                <Text style={styles.studentsTitle}>
                  Students in {selectedClass}
                </Text>
                <Text style={styles.studentsSubtitle}>
                  {students.length} student{students.length !== 1 ? "s" : ""}{" "}
                  enrolled
                </Text>
              </View>
            </View>

            <View style={styles.studentsContainer}>
              {students.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📚</Text>
                  <Text style={styles.emptyStateText}>No students found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    This class appears to be empty
                  </Text>
                </View>
              ) : (
                students.map((student, idx) => {
                  return (
                    <View key={student.name + idx} style={[styles.studentItem]}>
                      <View style={[styles.studentCardContent]}>
                        <View style={[styles.studentInfo]}>
                          <Text style={styles.studentName}>{student.name}</Text>
                          {student.notes && (
                            <Text style={styles.studentNotes}>
                              📝 {student.notes}
                            </Text>
                          )}
                        </View>
                        <View style={styles.studentActions}>
                          <Link href="/(tabs)/(grading)/viewGrades" asChild>
                            <TouchableOpacity
                              style={styles.inlineActionButton}
                              onPress={() => {
                                setSelectedStudent(student);
                                router.navigate("/(tabs)/(grading)/viewGrades");
                              }}
                            >
                              <Text style={styles.inlineActionText}>
                                View Grades
                              </Text>
                            </TouchableOpacity>
                          </Link>
                          <Link href="/(tabs)/(grading)/addNewGrade" asChild>
                            <TouchableOpacity
                              style={styles.inlineActionButton}
                              onPress={() => {
                                setSelectedStudent(student);
                                router.navigate(
                                  "/(tabs)/(grading)/addNewGrade"
                                );
                              }}
                            >
                              <Text style={styles.inlineActionText}>
                                Add Grade
                              </Text>
                            </TouchableOpacity>
                          </Link>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c7d2fe",
  },
  headerStudentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "#a5b4fc",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // Selection Card Styles
  selectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    zIndex: 1000,
  },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  selectionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  dropdownContainer: {
    padding: 16,
    paddingTop: 0,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    zIndex: 1000,
  },
  dropdownList: {
    borderColor: "#e5e7eb",
    borderRadius: 8,
    zIndex: 1000,
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Action Card Styles
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  buttonRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  actionButtonContainer: {
    flex: 1,
  },
  viewButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  addButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  viewButtonIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  addButtonIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Students Card Styles
  studentsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  studentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  studentsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  studentsInfo: {
    flex: 1,
  },
  studentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  studentsSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  studentsContainer: {
    padding: 16,
  },

  // Student Card Styles
  studentItem: {
    marginBottom: 12,
  },
  selectedStudentItem: {
    // Container for selected student styling if needed
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedStudentCard: {
    borderColor: "#16a34a",
    borderWidth: 2,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  studentCardContent: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  studentNotes: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  studentActions: {
    flexDirection: "row",
    gap: 8,
  },
  inlineActionButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  inlineActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  // Empty State Styles
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Dropdown Spacer
  dropdownSpacer: {
    height: 150, // Adjust this value based on your dropdown height
    marginBottom: 16,
  },
});
