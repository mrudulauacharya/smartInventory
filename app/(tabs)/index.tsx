import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";  // ✅ Removed duplicate import

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Inventory</Text>
      <Button title="Add Product" onPress={() => navigation.navigate("screens/AddProductScreen")} />
      <Button title="View Products" onPress={() => navigation.navigate("screens/ProductListScreen")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 20 },  // ✅ Fixed 'gap' issue
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

export default HomeScreen;
