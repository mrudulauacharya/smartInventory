import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple clicks

  const handleAddProduct = async () => {
    if (!name || !quantity || !price || !expiryDate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setIsSubmitting(true); // Disable button

    try {
      const docRef = await addDoc(collection(db, "products"), {
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        expiryDate,
      });

      console.log("Product added successfully! ID:", docRef.id);

      Alert.alert("Success", "Product added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }, // Navigate after alert
      ]);

      // Reset form fields
      setName("");
      setQuantity("");
      setPrice("");
      setExpiryDate("");
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product.");
    } finally {
      setIsSubmitting(false); // Enable button after completion
    }
  };

  return (
    <View style={styles.container}>
      <Text>Product Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Quantity:</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <Text>Price:</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Text>Expiry Date (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} value={expiryDate} onChangeText={setExpiryDate} />
      <Button title="Add Product" onPress={handleAddProduct} disabled={isSubmitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
});

export default AddProductScreen;
