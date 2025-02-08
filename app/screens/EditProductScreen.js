import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProductScreen = () => {
  const { productId } = useLocalSearchParams(); // ✅ Fix: Get params correctly
  const navigation = useNavigation();
  const [product, setProduct] = useState({ name: "", quantity: "", price: "", expiryDate: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          setProduct(productDoc.data());
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdateProduct = async () => {
    if (!productId) return;

    try {
      await updateDoc(doc(db, "products", productId), product);
      alert("Product updated successfully!");
      navigation.goBack(); // ✅ Go back after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={product.quantity}
        onChangeText={(text) => setProduct({ ...product, quantity: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={product.price}
        onChangeText={(text) => setProduct({ ...product, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={product.expiryDate}
        onChangeText={(text) => setProduct({ ...product, expiryDate: text })}
      />
      <Button title="Update Product" onPress={handleUpdateProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditProductScreen;
