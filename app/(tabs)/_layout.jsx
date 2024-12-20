import React, { useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  const iconSize = 25;

  const colorScheme = useColorScheme();
  const darkStyle = "#ffffff";
  const lightStyle = "#000";
  const focusedIconBackground = {
    width: 80,
    height: 70,
    borderRadius: 20,
    backgroundColor: colorScheme === "dark" ? "#080808" : "#f5f5f5",
    justifyContent: "flex-start",
    paddingTop: 10,
    alignItems: "center",
    marginTop: 10,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 100,
          paddingBottom: 30,
          paddingTop: 30,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIconStyle: { marginTop: -10 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="selling"
        options={{
          title: "Seller",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? focusedIconBackground : null}>
              <MaterialIcons
                name={focused ? "workspaces" : "workspaces-outline"}
                color={colorScheme == "dark" ? darkStyle : lightStyle}
                size={iconSize}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: colorScheme == "dark" ? darkStyle : lightStyle,
                fontSize: 14,
              }}
            >
              Seller
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "LENS",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? focusedIconBackground : null}>
              <TabBarIcon
                name={focused ? "camera" : "camera-outline"}
                color={colorScheme == "dark" ? darkStyle : lightStyle}
                size={iconSize}
              />
            </View>
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: colorScheme == "dark" ? darkStyle : lightStyle,
                fontSize: 14,
              }}
            >
              LENS
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Scans",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? focusedIconBackground : null}>
              <MaterialCommunityIcons
                name={focused ? "layers-triple" : "layers-triple-outline"}
                color={colorScheme == "dark" ? darkStyle : lightStyle}
                size={iconSize}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: colorScheme == "dark" ? darkStyle : lightStyle,
                fontSize: 14,
              }}
            >
              Scans
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
