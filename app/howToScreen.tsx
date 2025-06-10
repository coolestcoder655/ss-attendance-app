import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router/build/hooks";

const HowToModal = () => {
  const router = useRouter();

  const renderStep = (
    stepNumber: number,
    title: string,
    description: string,
    imagePath: any
  ) => {
    return (
      <View key={stepNumber} style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>{stepNumber}</Text>
          </View>
          <View style={styles.stepTitleContainer}>
            <Text style={styles.stepTitle}>{title}</Text>
            <Text style={styles.stepSubtitle}>Tutorial Step</Text>
          </View>
        </View>
        <Text style={styles.stepDescription}>{description}</Text>
        <View style={styles.imageContainer}>
          <Image source={imagePath} style={styles.stepImage} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>How to Submit Attendance</Text>
          <Text style={styles.headerSubtitle}>Step-by-step tutorial guide</Text>
        </View>
        <View style={styles.tutorialCard}>
          <Text style={styles.tutorialIcon}>📚</Text>
          <Text style={styles.tutorialLabel}>Tutorial Guide</Text>
          <Text style={styles.tutorialSteps}>5 Easy Steps</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.introTitle}>Getting Started</Text>
          </View>
          <Text style={styles.introText}>
            Follow these simple steps to successfully submit attendance for your
            class.
          </Text>
        </View>

        {/* Steps */}
        {renderStep(
          1,
          "Open Login",
          'Open the app and press the yellow "Login" button.',
          require("../images/tutorial_images/openLoginWindow.jpg")
        )}

        {renderStep(
          2,
          "Enter Credentials",
          'Enter your name and press "Login."',
          require("../images/tutorial_images/enterName.jpg")
        )}

        {renderStep(
          3,
          "Select Class & Period",
          'Once logged in, you will see a "Class" dropdown and a "Period" dropdown. Select your class and period.',
          require("../images/tutorial_images/selectClassPeriod.jpg")
        )}

        {renderStep(
          4,
          "Mark Attendance",
          'Press the "Present" text in order to mark a student absent and vice versa. Press the dropdown to open a notes section.',
          require("../images/tutorial_images/toggleAttendance.jpg")
        )}

        {renderStep(
          5,
          "Submit Attendance",
          'Once you have finished marking attendance, press the "Submit" button.',
          require("../images/tutorial_images/submitAttendance.jpg")
        )}

        {/* Additional Information Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💡</Text>
          <Text style={styles.sectionTitle}>Additional Information</Text>
        </View>

        <View style={styles.additionalCard}>
          <View style={styles.additionalHeader}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <View style={styles.additionalTitleContainer}>
              <Text style={styles.additionalTitle}>Logout Process</Text>
              <Text style={styles.additionalSubtitle}>Account Management</Text>
            </View>
          </View>
          <Text style={styles.additionalDescription}>
            If you need to logout of your account, press the "Logout" button.
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={require("../images/tutorial_images/logout.jpg")}
              style={styles.stepImage}
            />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.summaryTitle}>Quick Summary</Text>
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>
              • Login with your credentials{"\n"}• Select your class and period
              {"\n"}• Mark student attendance{"\n"}• Submit your attendance
              record{"\n"}• Logout when finished
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HowToModal;

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
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c7d2fe",
    marginTop: 4,
  },
  tutorialCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tutorialIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tutorialLabel: {
    fontSize: 12,
    color: "#c7d2fe",
    marginBottom: 4,
  },
  tutorialSteps: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  introCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e7ff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  introHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  introText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  stepCard: {
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
    overflow: "hidden",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  stepSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    padding: 16,
    paddingTop: 12,
  },
  imageContainer: {
    padding: 16,
    paddingTop: 8,
    alignItems: "center",
  },
  stepImage: {
    width: "100%",
    maxWidth: 280,
    height: 160,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#f3f4f6",
  },
  additionalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 2,
    borderColor: "#fbbf24",
    overflow: "hidden",
  },
  additionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fffbeb",
    borderBottomWidth: 1,
    borderBottomColor: "#fed7aa",
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  additionalTitleContainer: {
    flex: 1,
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  additionalSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  additionalDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    padding: 16,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#10b981",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  checkIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  summaryContent: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#059669",
    lineHeight: 22,
    fontWeight: "500",
  },
});
