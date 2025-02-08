import { Stack } from "expo-router";
import AnalyticsScreen from "../screens/AnalyticsScreen"; // ✅ Ensure correct path

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="screens/AddProductScreen" options={{ title: "Add Product" }} />
      <Stack.Screen name="screens/ProductListScreen" options={{ title: "Product List" }} />
      <Stack.Screen name="screens/AnalyticsScreen" options={{ title: "Analytics" }} />

    </Stack>
  );
}
