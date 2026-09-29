import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';

const MOCK_PROMOS = [
  { id: 1, businessName: "Joe's Plumbing", service: "Plumber", area: "Randburg", offer: "20% OFF Callout - This Week Only", price: "R399 (was R500)", phone: "0821234567", coinsNeeded: 100, isTrial: true, trialDaysLeft: 29 },
  { id: 2, businessName: "Sarah's Electrical", service: "Electrician", area: "Sandton", offer: "Free Quote + R200 OFF First Job", price: "From R1,800", phone: "0712345678", coinsNeeded: 150, isTrial: true, trialDaysLeft: 29 },
  { id: 3, businessName: "James K Builders", service: "Builder", area: "Fourways", offer: "10% OFF - 15k Homes Special", price: "R15k", phone: "0831234567", coinsNeeded: 200, isTrial: false, trialDaysLeft: 0 },
];

export default function Index() {
  const [coins, setCoins] = useState(130);
  const [streak, setStreak] = useState(3);
  const handleClaim = (promo: any) => {
    if (coins >= promo.coinsNeeded) {
      setCoins(c => c - promo.coinsNeeded);
      Alert.alert("🎉 Discount Unlocked!", `${promo.businessName} gives you extra R${promo.coinsNeeded/10} OFF. Code: RAY${promo.id}`);
    }
    Linking.openURL(`tel:${promo.phone}`);
  };
  const handleDailyBonus = () => {
    setCoins(c => c + 10);
    Alert.alert(`🔥 +10 Coins!`, `You now have ${coins + 10} coins`);
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <View style={{ backgroundColor: "#FFD700", padding: 14, borderRadius: 12, marginBottom: 14 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>🪙 {coins} Coins = R{coins/10} OFF • 🔥 Day {streak} streak</Text>
        <TouchableOpacity onPress={handleDailyBonus} style={{ backgroundColor: "black", padding: 8, borderRadius: 6, marginTop: 8 }}>
          <Text style={{ color: "#FFD700", textAlign: "center", fontWeight: "bold", fontSize: 12 }}>Tap to claim daily +10 coins</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Raymedia</Text>
      <Text style={{ color: "white", marginBottom: 14, fontSize: 11 }}>Deals & Promos Near You • 1 Month FREE Trial</Text>
      {MOCK_PROMOS.map(promo => (
        <View key={promo.id} style={{ backgroundColor: "#1e1e1e", padding: 15, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: promo.isTrial ? "#00ff88" : "#FFD700" }}>
          <Text style={{ color: "#FFD700", fontWeight: "bold", fontSize: 11 }}>{promo.service.toUpperCase()} • {promo.area} {promo.isTrial ? "• 🆓 FREE TRIAL" : "• ✅ SUBSCRIBED"}</Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, marginTop: 4 }}>{promo.businessName}</Text>
          <Text style={{ color: "#ccc", marginTop: 2 }}>{promo.offer}</Text>
          <Text style={{ color: "white", fontWeight: "bold", marginTop: 4 }}>{promo.price}</Text>
          <TouchableOpacity onPress={() => handleClaim(promo)} style={{ backgroundColor: promo.isTrial ? "#00ff88" : "#FFD700", padding: 12, borderRadius: 8, marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", textAlign: 'center', color: "black" }}>📞 Get Discount & Call</Text>
          </TouchableOpacity>
          <Text style={{ color: "#888", fontSize: 9, marginTop: 6, textAlign: 'center' }}>{promo.isTrial ? `FREE trial - ${promo.trialDaysLeft} days left` : "Business pays R30"}</Text>
        </View>
      ))}
    </ScrollView>
  );
                      }
