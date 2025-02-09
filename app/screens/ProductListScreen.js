import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "expo-router";  
import { Picker } from "@react-native-picker/picker";

const ProductListScreen = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);
        showExpiryNotifications(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === "name-asc") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      results.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "expiry-asc") {
      results.sort((a, b) => moment(a.expiryDate, "YYYY-MM-DD") - moment(b.expiryDate, "YYYY-MM-DD"));
    } else if (sortOption === "expiry-desc") {
      results.sort((a, b) => moment(b.expiryDate, "YYYY-MM-DD") - moment(a.expiryDate, "YYYY-MM-DD"));
    }

    setFilteredProducts(results);
  }, [searchQuery, products, sortOption]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully! ✅");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product ❌");
    }
  };

  const checkExpiryStatus = (expiryDate) => {
    const today = moment();
    const expDate = moment(expiryDate, "YYYY-MM-DD");
    const diffDays = expDate.diff(today, "days");

    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "near-expiry";
    return "valid";
  };

  const showExpiryNotifications = async (productsList) => {
    if (!("Notification" in window)) {
      console.warn("Browser notifications not supported.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return;
    }

    productsList.forEach((product) => {
      const status = checkExpiryStatus(product.expiryDate);
      let message = "";

      if (status === "expired") {
        message = `⚠️ ${product.name} has expired!`;
        toast.error(message);
      } else if (status === "near-expiry") {
        message = `⚠️ ${product.name} will expire soon!`;
        toast.warn(message);
      } else {
        return;
      }

      new Notification("Product Expiry Alert", { body: message });
    });
  };

  return (
    <View style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Text style={styles.title}>Product List</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Picker
        selectedValue={sortOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSortOption(itemValue)}
      >
        <Picker.Item label="Sort by Name (A-Z)" value="name-asc" />
        <Picker.Item label="Sort by Name (Z-A)" value="name-desc" />
        <Picker.Item label="Sort by Expiry (Nearest First)" value="expiry-asc" />
        <Picker.Item label="Sort by Expiry (Farthest First)" value="expiry-desc" />
      </Picker>

      <TouchableOpacity
        style={styles.analyticsButton}
        onPress={() => router.push("/screens/AnalyticsScreen")}
      >
        <Text style={styles.analyticsText}>📊 View Analytics</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const expiryStatus = checkExpiryStatus(item.expiryDate);
          return (
            <View
              style={[
                styles.productItem,
                expiryStatus === "expired"
                  ? styles.expired
                  : expiryStatus === "near-expiry"
                  ? styles.nearExpiry
                  : {},
              ]}
            >
              <Text>Name: {item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Expiry Date: {item.expiryDate}</Text>

              <TouchableOpacity onPress={() => router.push(`/screens/EditProductScreen?id=${item.id}`)}>
                <Text style={styles.editText}>✏️ Edit</Text>
              </TouchableOpacity>

              {expiryStatus === "expired" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(item.id)}
                >
                  <Text style={styles.deleteText}>❌ Delete</Text>
                </TouchableOpacity>
              )}

              {expiryStatus === "expired" && <Text style={styles.alertText}>⚠️ Expired!</Text>}
              {expiryStatus === "near-expiry" && <Text style={styles.alertText}>⚠️ Expires Soon!</Text>}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  searchBar: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    elevation: 3,
  },
  expired: { backgroundColor: "#ffcccc" },
  nearExpiry: { backgroundColor: "#fffae6" },
  alertText: { fontWeight: "bold", color: "red", textAlign: "center" },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
  deleteText: { color: "white", fontWeight: "bold", textAlign: "center" },
  editText: { color: "blue", fontWeight: "bold", marginTop: 5 },
  analyticsButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  analyticsText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProductListScreen;
