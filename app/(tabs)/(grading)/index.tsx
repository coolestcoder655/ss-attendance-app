import { useState, useEffect, useContext } from "react";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from '@rneui/themed';
import { GradingContext } from "@/app/(tabs)/(grading)/gradingContext";
import { Link } from 'expo-router';

interface Student {
    name: string;
    isAbsent: boolean;
    notes: string;
}

const Index = () => {
    const [classesOpen, setClassesOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([]);
    const [classes, setClasses] = useState<
        Record<string, { grade: string; students: Student[] }>
    >({});
    const [students, setStudents] = useState<Student[]>([]);
    const { selectedStudent, setSelectedStudent } = useContext(GradingContext) ?? []

    const handleSelectStudent = (student: Student) => {
        if (selectedStudent && selectedStudent.name === student.name) {
            setSelectedStudent(null);
        } else {
            setSelectedStudent(student);
        }
    };

    const handleChangeClass = (className: string | null) => {
        setSelectedClass(className);
        setSelectedStudent(null);
    }

    useEffect(() => {
        const fetchClasses = async () => {
            const snapshot = await getDocs(collection(db, "classes"));
            const classesData: Record<
                string,
                { grade: string; students: Student[] }
            > = {};
            snapshot.forEach((doc) => {
                classesData[doc.id] = doc.data() as { grade: string; students: Student[] };
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
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                backgroundColor: "#fff",
                paddingBottom: 40,
                paddingTop: Platform.OS === "android" ? 50 : 25,
            }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={styles.title}>Grade Screen</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <DropDownPicker
                    open={classesOpen}
                    value={selectedClass}
                    items={classOptions}
                    setOpen={setClassesOpen}
                    setValue={setSelectedClass}
                    setItems={setClassOptions}
                    onChangeValue={handleChangeClass}
                    placeholder="Select a class"
                    containerStyle={{ width: "80%", marginBottom: 20 }}
                    zIndex={1000}
                    dropDownDirection='BOTTOM'
                />
                {selectedClass && (
                    <View style={styles.studentListContainer}>
                        <Text style={styles.subtitle}>Students in {selectedClass}:</Text>
                        {selectedStudent && (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                                <Link href='/(tabs)/(grading)/viewGrades' asChild style = {styles.buttonContainer} >
                                    <Button
                                        title="View Grades"
                                        buttonStyle={styles.primaryButton}
                                        containerStyle={styles.buttonContainer}

                                    />
                                </Link>
                                <Link href='/(tabs)/(grading)/addNewGrade' asChild style = {styles.buttonContainer}>
                                    <Button
                                    title="Add New Grade"
                                    buttonStyle={styles.successButton}
                                    containerStyle={styles.buttonContainer}
                                />
                                </Link>
                            </View>
                        )}
                        {students.length === 0 ? (
                            <Text style={styles.studentItem}>No students found</Text>
                        ) : (
                            students.map((student, idx) => (
                                <View
                                    key={student.name + idx}
                                    style={selectedStudent && selectedStudent.name === student.name ? styles.selectedStudentRow : styles.studentRow }>
                                <Text style={styles.studentName}>{student.name}</Text>
                                    <Text style={styles.studentStatus}>
                                        Status: {student.isAbsent ? "Absent" : "Present"}
                                    </Text>
                                    {student.notes ? (
                                        <Text style={styles.studentNotes}>Notes: {student.notes}</Text>
                                    ) : null}
                                    <Pressable onPress={() => handleSelectStudent(student)} style={selectedStudent && selectedStudent.name === student.name ? styles.unselectButton : styles.selectButton}>
                                        <Text style={styles.selectButtonText}>{selectedStudent && selectedStudent.name === student.name ? "Unselect" : "Select"}</Text>
                                    </Pressable>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({
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
    studentListContainer: {
        width: "100%",
        alignItems: "center",
    },
    studentRow: {
        marginBottom: 14,
        padding: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },
    studentName: {
        fontSize: 15,
        fontWeight: "bold",
    },
    studentStatus: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
    },
    studentNotes: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
        fontStyle: "italic",
    },
    studentItem: {
        fontSize: 15,
        paddingVertical: 6,
        color: "#333",
    },
    selectButton: {
        padding: 10,
        backgroundColor: "#0385ff",
        borderRadius: 8,
        width: "20%",
        alignItems: "center",
        alignSelf: "flex-end",
        marginTop: 20,
    },
    unselectButton: {
        padding: 10,
        backgroundColor: "#ff0a2b",
        borderRadius: 8,
        width: "20%",
        alignItems: "center",
        alignSelf: "flex-end",
        marginTop: 20,
    },
    selectButtonText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
    },
    selectedStudentRow: {
        marginBottom: 14,
        outlineWidth: 2,
        outlineColor: "#0385ff",

        padding: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },
    primaryButton: {
        backgroundColor: '#007bff', // Bootstrap blue
        borderRadius: 10
    },
    successButton: {
        backgroundColor: '#28a745', // Bootstrap green
        borderRadius: 10
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
});