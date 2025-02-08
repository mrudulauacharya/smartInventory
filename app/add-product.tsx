import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Ensure this path is correct

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const router = useRouter();

  const handleAddProduct = async () => {
    if (!name || !quantity || !price || !expiryDate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        expiryDate
      });
      Alert.alert("Success", "Product added successfully!");
      router.back();
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product.");
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
      <Button title="Save Product" onPress={handleAddProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
});
