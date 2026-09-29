import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_PROMOS = [
  { id: 1, businessName: "Joe's Plumbing", service: "Plumber", area: "Randburg", offer: "20% OFF", price: "R150", phone: "0123456789", isTrial: true, coinsNeeded: 0 },
  { id: 2, businessName: "Sarah's Electrical", service: "Electrician", area: "Sandton", offer: "Free Quote", price: "R200", phone: "0123456789", isTrial: false, coinsNeeded: 20 },
  { id: 3, businessName: "James K Builders", service: "Builder", area: "Fourways", offer: "10% OFF", price: "R500", phone: "0123456789", isTrial: false, coinsNeeded: 30 },
];

export default function Index() {
  const [coins, setCoins] = useState(130);
  const [streak, setStreak] = useState(3);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedCoins = await AsyncStorage.getItem('coins');
    if (savedCoins) setCoins(parseInt(savedCoins));
    const today = new Date().toDateString();
    const last = await AsyncStorage.getItem('lastClaimDate');
    if (last === today) setClaimedToday(true);
    const savedStreak = await AsyncStorage.getItem('streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  };

  const handleClaim = (promo: any) => {
    if (promo.isTrial || coins >= promo.coinsNeeded) {
      if (!promo.isTrial) {
        const newCoins = coins - promo.coinsNeeded;
        setCoins(newCoins);
        AsyncStorage.setItem('coins', newCoins.toString());
      }
      Alert.alert("Discount Unlocked!", `${promo.businessName} gives you ${promo.offer}`);
    }
    Linking.openURL(`tel:${promo.phone}`);
  };

  const handleDailyBonus = async () => {
    const today = new Date().toDateString();
    const last = await AsyncStorage.getItem('lastClaimDate');
    if (last === today) {
      Alert.alert('Already claimed today!', 'Come back tomorrow to keep your streak!');
      return;
    }
    const newCoins = coins + 10;
    const newStreak = streak + 1;
    setCoins(newCoins);
    setStreak(newStreak);
    setClaimedToday(true);
    await AsyncStorage.setItem('coins', newCoins.toString());
    await AsyncStorage.setItem('lastClaimDate', today);
    await AsyncStorage.setItem('streak', newStreak.toString());
    Alert.alert('🔥 +10 Coins!', `Day ${newStreak} streak! You now have ${newCoins} coins`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <View style={{ backgroundColor: "#FFD700", padding: 14, borderRadius: 12, marginBottom: 14 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{coins} Coins = R{coins/10} OFF</Text>
        <TouchableOpacity onPress={handleDailyBonus} style={{ backgroundColor: "black", padding: 12, borderRadius: 8, marginTop: 8, opacity: claimedToday ? 0.6 : 1 }} disabled={claimedToday}>
          <Text style={{ color: "#FFD700", textAlign: "center", fontWeight: "bold", fontSize: 12 }}>
            {claimedToday ? "✅ Claimed today - come back tomorrow" : `🔥 Day ${streak} streak - Tap to claim daily +10 coins`}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Raymedia</Text>
      <Text style={{ color: "white", marginBottom: 14, fontSize: 11 }}>Deals & Promos Near You • Randburg</Text>
      {MOCK_PROMOS.map(promo => (
        <View key={promo.id} style={{ backgroundColor: "#1e1e1e", padding: 15, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ color: "#FFD700", fontWeight: "bold", fontSize: 11 }}>{promo.service.toUpperCase()} • {promo.area}</Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, marginTop: 4 }}>{promo.businessName}</Text>
          <Text style={{ color: "#ccc", marginTop: 2 }}>{promo.offer}</Text>
          <Text style={{ color: "white", fontWeight: "bold", marginTop: 4 }}>{promo.price}</Text>
          <TouchableOpacity onPress={() => handleClaim(promo)} style={{ backgroundColor: promo.isTrial ? "#FFD700" : "white", padding: 10, borderRadius: 8, marginTop: 8 }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", color: "black" }}>📞 Get Discount - Call Now</Text>
          </TouchableOpacity>
          <Text style={{ color: "#888", fontSize: 9, marginTop: 6, textAlign: "center" }}>{promo.isTrial ? "FREE TRIAL" : "SUBSCRIBED"}</Text>
        </View>
      ))}
    </ScrollView>
  );
   }
