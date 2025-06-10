import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type CircleBackButtonProps = {
  onPress: () => void;
  size?: number;
  style?: "glass" | "solid" | "outline";
  color?: string;
  position?: "relative" | "absolute";
};

const CircleBackButton = ({
  onPress,
  size = 50,
  style = "glass", // 'glass', 'solid', 'outline'
  color = "#6366f1",
  position = "relative", // 'relative', 'absolute'
}: CircleBackButtonProps) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    };

    switch (style) {
      case "glass":
        return {
          ...baseStyle,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
        };
      case "solid":
        return {
          ...baseStyle,
          backgroundColor: "#fff",
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: "#fff",
        };
      default:
        return baseStyle;
    }
  };

  const getIconColor = () => {
    switch (style) {
      case "glass":
      case "outline":
        return "#fff";
      case "solid":
        return color;
      default:
        return "#fff";
    }
  };

  const getPositionStyle = () => {
    if (position === "absolute") {
      return {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 1000,
      };
    }
    return {};
  };

  return (
    <Animated.View
      style={{ position: "absolute", top: 50, left: 20, zIndex: 1000 }}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={size * 0.4} color={getIconColor()} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CircleBackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
