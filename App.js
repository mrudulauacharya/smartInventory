import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddProductScreen from "./app/screens/AddProductScreen"; // Ensure this path is correct
import ProductListScreen from "./app/screens/ProductListScreen"; // Add a product list screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Product List">
        <Stack.Screen name="Product List" component={ProductListScreen} />
        <Stack.Screen name="Add Product" component={AddProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
