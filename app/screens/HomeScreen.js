import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    checkExpiry();
  }, []);

  // Load products from AsyncStorage
  const loadProducts = async () => {
    const storedProducts = await AsyncStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  // Check for expired products and send notifications
  const checkExpiry = async () => {
    const storedProducts = await AsyncStorage.getItem("products");
    if (!storedProducts) return;

    const products = JSON.parse(storedProducts);
    const today = new Date().toISOString().split("T")[0];

    products.forEach((product) => {
      if (product.expiryDate === today) {
        Notifications.scheduleNotificationAsync({
          content: { title: "Expiry Alert!", body: `${product.name} expires today!` },
          trigger: null,
        });
      }
    });
  };

  // Delete a product
  const deleteProduct = async (id) => {
    const storedProducts = await AsyncStorage.getItem("products");
    if (!storedProducts) return;

    const updatedProducts = JSON.parse(storedProducts).filter((item) => item.id !== id);
    await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts); // Update state
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text>{item.name} - Expires: {item.expiryDate}</Text>
            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Add Product")}>
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  product: { padding: 10, backgroundColor: "#ddd", marginVertical: 5, flexDirection: "row", justifyContent: "space-between" },
  deleteText: { color: "red", fontWeight: "bold" },
  addButton: { padding: 10, backgroundColor: "blue", alignItems: "center", marginTop: 20 },
  addButtonText: { color: "white", fontSize: 18 },
});

export default HomeScreen;
