import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Smart Inventory</Text>
      <Text style={styles.description}>
        Manage your inventory efficiently with expiry tracking.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color for better visibility
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Dark text for better readability
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default ExploreScreen;
