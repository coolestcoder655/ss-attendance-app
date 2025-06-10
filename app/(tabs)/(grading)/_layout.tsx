import React from "react";
import { Stack } from "expo-router";
import { GradingProvider } from "@/app/(tabs)/(grading)/gradingContext";

const TabLayout = () => {
  return (
      <GradingProvider>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Grade",
                    // Optionally, set tabBarShowLabel: false to hide label
                }}
            />
        </Stack>
      </GradingProvider>
  );
};

export default TabLayout;