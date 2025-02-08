import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const AnalyticsScreen = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => doc.data());
        
        setTotalProducts(products.length);

        const today = new Date();
        let expired = 0;
        let nearExpiry = 0;

        products.forEach(product => {
          const expDate = new Date(product.expiryDate);
          const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

          if (diffDays < 0) expired++;
          if (diffDays >= 0 && diffDays <= 3) nearExpiry++;
        });

        setExpiredCount(expired);
        setNearExpiryCount(nearExpiry);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Analytics</Text>
      <Text>Total Products: {totalProducts}</Text>
      <Text>Expired Products: {expiredCount}</Text>
      <Text>Near Expiry: {nearExpiryCount}</Text>

      <BarChart
        data={{
          labels: ["Total", "Expired", "Near Expiry"],
          datasets: [{ data: [totalProducts, expiredCount, nearExpiryCount] }]
        }}
        width={Dimensions.get("window").width - 30}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`
        }}
        style={{ marginVertical: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default AnalyticsScreen;
