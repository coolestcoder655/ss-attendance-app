import { Text, View } from '@/components/Themed';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { GradingContext } from '@/app/(tabs)/(grading)/gradingContext';
import React, {useContext, useState} from "react";
import { Button } from '@rneui/themed';
import { Link } from 'expo-router';

const ViewGrades = () => {
    const { selectedStudent } = useContext(GradingContext) ?? [];
    const [expandedSemester, setExpandedSemester] = useState(null);
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [grades, setGrades] = useState({
        semester1: {
            'Mathematics': {'Homework': 85, 'Quizzes': 78, 'Exams': 92},
            'Science': {'Lab Reports': 88, 'Projects': 91, 'Tests': 84},
            'English': {'Essays': 90, 'Reading': 87, 'Participation': 95}
        },
        semester2: {
            'Mathematics': {'Homework': 82, 'Quizzes': 85, 'Exams': 89},
            'Science': {'Lab Reports': 90, 'Projects': 88, 'Tests': 87},
            'English': {'Essays': 93, 'Reading': 89, 'Participation': 92}
        }
    })

    const calculateSubjectAverage = (subject) => {
        const components = Object.values(subject);
        return Math.round(components.reduce((sum, grade) => sum + grade, 0) / components.length);
    };

    const calculateSemesterAverage = (semester) => {
        const subjects = Object.values(semester);
        const averages = subjects.map(calculateSubjectAverage);
        return Math.round(averages.reduce((sum, avg) => sum + avg, 0) / averages.length);
    };

    const calculateOverallGPA = () => {
        const sem1Avg = calculateSemesterAverage(grades.semester1);
        const sem2Avg = calculateSemesterAverage(grades.semester2);
        return Math.round((sem1Avg + sem2Avg) / 2);
    };

    const updateGrade = (semester, subject, component, value) => {
        const newGrades = {...grades};
        newGrades[semester][subject][component] = parseInt(value) || 0;
        setGrades(newGrades);
    };

    const getGradeColor = (grade) => {
        if (grade >= 90) return '#16a34a'; // green-600
        if (grade >= 80) return '#2563eb'; // blue-600
        if (grade >= 70) return '#ca8a04'; // yellow-600
        return '#dc2626'; // red-600
    };

    const getGradeBgColor = (grade) => {
        if (grade >= 90) return '#f0fdf4'; // green-50
        if (grade >= 80) return '#eff6ff'; // blue-50
        if (grade >= 70) return '#fefce8'; // yellow-50
        return '#fef2f2'; // red-50
    };

    const getGradeBorderColor = (grade) => {
        if (grade >= 90) return '#bbf7d0'; // green-200
        if (grade >= 80) return '#bfdbfe'; // blue-200
        if (grade >= 70) return '#fef3c7'; // yellow-200
        return '#fecaca'; // red-200
    };

    const ChevronDown = () => (
        <Text style={styles.chevron}>▼</Text>
    );

    const ChevronRight = () => (
        <Text style={styles.chevron}>▶</Text>
    );

    const renderSemester = (semesterKey, semesterName) => {
        const semester = grades[semesterKey];
        const semesterAvg = calculateSemesterAverage(semester);
        const isExpanded = expandedSemester === semesterKey;

        return (
            <View key={semesterKey} style={styles.semesterContainer}>
                <TouchableOpacity
                    style={[
                        styles.semesterHeader,
                        {
                            backgroundColor: getGradeBgColor(semesterAvg),
                            borderColor: getGradeBorderColor(semesterAvg)
                        }
                    ]}
                    onPress={() => setExpandedSemester(isExpanded ? null : semesterKey)}
                >
                    <View style={styles.semesterHeaderContent}>
                        <View style={styles.semesterInfo}>
                            <Text style={styles.bookIcon}>📚</Text>
                            <View>
                                <Text style={styles.semesterTitle}>{semesterName}</Text>
                                <Text style={styles.semesterSubtitle}>3 Subjects</Text>
                            </View>
                        </View>
                        <View style={styles.semesterGradeContainer}>
                            <Text style={[styles.semesterGrade, {color: getGradeColor(semesterAvg)}]}>
                                {semesterAvg}%
                            </Text>
                            {isExpanded ? <ChevronDown/> : <ChevronRight/>}
                        </View>
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.subjectsContainer}>
                        {Object.entries(semester).map(([subjectName, components]) => {
                            const subjectAvg = calculateSubjectAverage(components);
                            const subjectExpanded = expandedSubject === `${semesterKey}-${subjectName}`;

                            return (
                                <View key={subjectName} style={styles.subjectCard}>
                                    <TouchableOpacity
                                        style={styles.subjectHeader}
                                        onPress={() => setExpandedSubject(subjectExpanded ? null : `${semesterKey}-${subjectName}`)}
                                    >
                                        <View style={styles.subjectHeaderContent}>
                                            <View>
                                                <Text style={styles.subjectTitle}>{subjectName}</Text>
                                                <Text style={styles.subjectSubtitle}>3 Components</Text>
                                            </View>
                                            <View style={styles.subjectGradeContainer}>
                                                <Text style={[styles.subjectGrade, {color: getGradeColor(subjectAvg)}]}>
                                                    {subjectAvg}%
                                                </Text>
                                                {subjectExpanded ? <ChevronDown/> : <ChevronRight/>}
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {subjectExpanded && (
                                        <View style={styles.componentsContainer}>
                                            {Object.entries(components).map(([componentName, grade]) => (
                                                <View key={componentName} style={styles.componentRow}>
                                                    <Text style={styles.componentLabel}>{componentName}</Text>
                                                    <View style={styles.gradeInputContainer}>
                                                        <TextInput
                                                            style={[
                                                                styles.gradeInput,
                                                                {
                                                                    color: getGradeColor(grade),
                                                                    backgroundColor: getGradeBgColor(grade),
                                                                    borderColor: getGradeBorderColor(grade)
                                                                }
                                                            ]}
                                                            value={grade.toString()}
                                                            onChangeText={(value) => updateGrade(semesterKey, subjectName, componentName, value)}
                                                            keyboardType="numeric"
                                                            maxLength={3}
                                                        />
                                                        <Text style={styles.percentSign}>%</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    const overallGPA = calculateOverallGPA();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4f46e5"/>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Gradebook</Text>
                        <Text style={styles.headerSubtitle}>Academic Year 2024-2025</Text>
                    </View>
                    <Text style={styles.calculatorIcon}>🧮</Text>
                </View>

                <View style={styles.overallGradeCard}>
                    <Text style={styles.overallLabel}>Overall Average</Text>
                    <Text style={styles.overallGrade}>{overallGPA}%</Text>
                    <Text style={styles.overallStatus}>
                        {overallGPA >= 90 ? 'Excellent' : overallGPA >= 80 ? 'Good' : overallGPA >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderSemester('semester1', 'Fall Semester')}
                {renderSemester('semester2', 'Spring Semester')}

                {/* Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.calculatorIcon}>🧮</Text>
                        <Text style={styles.summaryTitle}>Summary</Text>
                    </View>
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Fall Semester Average:</Text>
                            <Text
                                style={[styles.summaryValue, {color: getGradeColor(calculateSemesterAverage(grades.semester1))}]}>
                                {calculateSemesterAverage(grades.semester1)}%
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Spring Semester Average:</Text>
                            <Text
                                style={[styles.summaryValue, {color: getGradeColor(calculateSemesterAverage(grades.semester2))}]}>
                                {calculateSemesterAverage(grades.semester2)}%
                            </Text>
                        </View>
                        <View style={styles.summaryDivider}/>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabelBold}>Overall Average:</Text>
                            <Text style={[styles.summaryValueBold, {color: getGradeColor(overallGPA)}]}>
                                {overallGPA}%
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewGrades;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 24,
        paddingVertical: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#c7d2fe',
    },
    calculatorIcon: {
        fontSize: 24,
    },
    overallGradeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    overallLabel: {
        fontSize: 12,
        color: '#c7d2fe',
        marginBottom: 4,
    },
    overallGrade: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    overallStatus: {
        fontSize: 10,
        color: '#c7d2fe',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    semesterContainer: {
        marginBottom: 16,
    },
    semesterHeader: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    semesterHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    semesterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    semesterTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    semesterSubtitle: {
        fontSize: 12,
        color: '#6b7280',
    },
    semesterGradeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    semesterGrade: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
    },
    chevron: {
        fontSize: 16,
        color: '#6b7280',
    },
    subjectsContainer: {
        marginTop: 12,
        marginLeft: 16,
    },
    subjectCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    subjectHeader: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    subjectHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
    },
    subjectSubtitle: {
        fontSize: 10,
        color: '#6b7280',
    },
    subjectGradeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subjectGrade: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    componentsContainer: {
        padding: 12,
    },
    componentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    componentLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        flex: 1,
    },
    gradeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gradeInput: {
        width: 60,
        height: 40,
        textAlign: 'center',
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    percentSign: {
        fontSize: 12,
        color: '#6b7280',
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginLeft: 8,
    },
    summaryContent: {
        gap: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#374151',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    summaryLabelBold: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    summaryValueBold: {
        fontSize: 16,
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 4,
    },
});