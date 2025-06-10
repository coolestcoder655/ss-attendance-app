import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Link } from "expo-router";
import { Pressable } from "react-native";

const TabBarIcon = ({ name, color }: { name: string; color: string }) => (
  <Ionicons name={name as any} size={28} color={color} style={{ marginBottom: -3 }} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
          headerRight: () => (
            <Link href="/howToScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="(grading)"
        options={{
          title: "Grade",
          tabBarIcon: ({ color }) => <TabBarIcon name="school-outline" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}