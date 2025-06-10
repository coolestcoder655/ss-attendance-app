import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { GradingContext } from '@/app/(tabs)/(grading)/gradingContext';
import { useContext } from "react";
import { Button } from '@rneui/themed';
import { Link } from 'expo-router';

const ViewGrades = () => {
    const { selectedStudent } = useContext(GradingContext) ?? [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View {selectedStudent.name}'s Grades</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
    );
};

export default ViewGrades;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    viewButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})