import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import House from "react-native-bootstrap-icons/icons/house";
import Person from "react-native-bootstrap-icons/icons/person";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={({ navigation }: { navigation: any }) => ({
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <House color={color} size={size ?? 28} />
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate("modal")}>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        })}
      />
      <Tabs.Screen
        name="adminDashboard"
        options={{
          title: "Admin Dashboard",
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Person color={color} size={size ?? 28} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="code" color={color} />
          ), // fixed typing
        }}
      />
    </Tabs>
  );
}
