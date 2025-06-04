import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router/build/hooks";

export default function ModalScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>Done</Text>
      </Pressable>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How to Submit Attendance?</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.header}>
          To submit attendance, please follow these steps:
        </Text>
        <View style={styles.stepContainer}>
          <Text style={styles.subHeader}>Step 1</Text>
          <Text style={styles.stepText}>
            Open the app and press the yellow "Login" button.
          </Text>
          <Image
            source={require("../images/tutorial_images/openLoginWindow.jpg")}
            style={styles.stepImage}
          />
        </View>
        <View style={styles.stepContainer}>
          <Text style={styles.subHeader}>Step 2</Text>
          <Text style={styles.stepText}>
            Enter your name and press "Login."
          </Text>
          <Image
            source={require("../images/tutorial_images/enterName.jpg")}
            style={styles.stepImage}
          />
        </View>
        <View style={styles.stepContainer}>
          <Text style={styles.subHeader}>Step 3</Text>
          <Text style={styles.stepText}>
            Once logged in, you will see a "Class" dropdown and a "Period"
            dropdown. Select your class and period.
          </Text>
          <Image
            source={require("../images/tutorial_images/selectClassPeriod.jpg")}
            style={styles.stepImage}
          />
        </View>
        <View style={styles.stepContainer}>
          <Text style={styles.subHeader}>Step 4</Text>
          <Text style={styles.stepText}>
            Press the "Present" text in order to mark a student absent and vice
            versa. Press the dropdown to open a notes section.
          </Text>
          <Image
            source={require("../images/tutorial_images/toggleAttendance.jpg")}
            style={styles.stepImage}
          />
        </View>
        <View style={styles.stepContainer}>
          <Text style={styles.subHeader}>Step 5</Text>
          <Text style={styles.stepText}>
            Once you have finished marking attendance, press the "Submit"
            button.
          </Text>
          <Image
            source={require("../images/tutorial_images/submitAttendance.jpg")}
            style={styles.stepImage}
          />
        </View>
        <Text style={styles.title}>Additional Information</Text>
        <View style={styles.separator} />
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>
            If you need to logout of your account, press the "Logout" button.
          </Text>
          <Image
            source={require("../images/tutorial_images/logout.jpg")}
            style={styles.stepImage}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  separator: {
    marginVertical: 20,
    height: 2,
    width: "90%",
    backgroundColor: "#eee",
    alignSelf: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 18,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 6,
    textAlign: "center",
    color: "#222",
  },
  stepContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: "#a1a1a1",
  },
  stepText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  stepImage: {
    width: 260,
    height: 140,
    borderRadius: 8,
    marginVertical: 8,
    resizeMode: "contain",
    backgroundColor: "#eaeaea",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 24,
    zIndex: 10,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
