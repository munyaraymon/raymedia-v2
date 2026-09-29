import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_PROMOS = [
  { id: 1, businessName: "Joe's Plumbing", service: "Plumber", area: "Randburg", offer: "20% OFF Callout - This Week Only", price: "R399 (was R500)", phone: "0821234567", coinsNeeded: 100, isTrial: true, trialDaysLeft: 29 },
  { id: 2, businessName: "Sarah's Electrical", service: "Electrician", area: "Sandton", offer: "Free Quote + R200 OFF First Job", price: "From R1,800", phone: "0712345678", coinsNeeded: 150, isTrial: true, trialDaysLeft: 29 },
  { id: 3, businessName: "James K Builders", service: "Builder", area: "Fourways", offer: "Get 10% OFF - 15k Homes Special", price: "R15k", phone: "0831234567", coinsNeeded: 200, isTrial: false, trialDaysLeft: 0 },
  { id: 4, businessName: "Lerato P Painters", service: "Painter", area: "Roodepoort", offer: "2 Rooms Painted - Special", price: "R4k", phone: "LOCKED", coinsNeeded: 100, isTrial: true, trialDaysLeft: 15 },
];

export default function Index() {
  const [coins, setCoins] = useState(130);
  const [streak, setStreak] = useState(3);

  useEffect(() => {
    checkDailyCoins();
  }, []);

  const checkDailyCoins = async () => {
    const today = new Date().toDateString();
    const lastLogin = await AsyncStorage.getItem('lastLogin');
    if (lastLogin !== today) {
      const earned = streak >= 7 ? 50 : 10;
      setCoins(c => c + earned);
      await AsyncStorage.setItem('lastLogin', today);
      Alert.alert(`🔥 Day ${streak} Streak!`, `+${earned} coins! You have ${coins + earned} coins = R${(coins+earned)/10} OFF`);
    }
  };

  const handleClaim = (promo: any) => {
    const canUseCoins = coins >= promo.coinsNeeded;
    const discount = promo.coinsNeeded / 10;
    
    if (canUseCoins) {
      setCoins(c => c - promo.coinsNeeded);
      Alert.alert("Discount Unlocked! 🎉", `${promo.businessName} will give you extra R${discount} OFF. Code: RAY${promo.id}. Calling now... Business pays us R30.`);
    } else {
      Alert.alert("Calling Business", `${promo.businessName} - You need ${promo.coinsNeeded} coins for extra discount. You have ${coins}. Still calling...`);
    }
    
    // If not trial, this is where you bill business R30. If trial, it's free lead.
    const billing = promo.isTrial ? `FREE TRIAL LEAD - ${promo.trialDaysLeft} days left` : `BILL R30 to ${promo.businessName}`;
    console.log(billing);
    
    if (promo.phone !== "LOCKED") {
      Linking.openURL(`tel:${promo.phone}`);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      
      {/* COINS WALLET - NEW */}
      <View style={{ backgroundColor: "#FFD700", padding: 14, borderRadius: 12, marginBottom: 14 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>🪙 {coins} Coins = R{coins/10} OFF • 🔥 Day {streak} streak</Text>
        <Text style={{ fontSize: 11, marginTop: 2 }}>Login daily = +10 coins. Use coins at any subscribed business!</Text>
      </View>

      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Raymedia</Text>
      <Text style={{ color: "white", marginBottom: 14, fontSize: 12 }}>Deals & Promos Near You • {MOCK_PROMOS.length} live • 1 Month FREE Trial for businesses</Text>
      
      {MOCK_PROMOS.map(promo => (
        <View key={promo.id} style={{ backgroundColor: "#1e1e1e", padding: 15, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: promo.isTrial ? "#00ff88" : "#FFD700" }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: "#FFD700", fontWeight: "bold", fontSize: 11 }}>{promo.service.toUpperCase()} • {promo.area} {promo.isTrial ? "• 🆓 FREE TRIAL" : "• ✅ SUBSCRIBED"}</Text>
            {promo.isTrial && <Text style={{ color: "#00ff88", fontSize: 10 }}>{promo.trialDaysLeft}d left FREE</Text>}
          </View>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, marginTop: 4 }}>{promo.businessName}</Text>
          <Text style={{ color: "#ccc", marginTop: 2 }}>{promo.offer}</Text>
          <Text style={{ color: "white", fontWeight: "bold", marginTop: 4 }}>{promo.price}</Text>
          
          <TouchableOpacity onPress={() => handleClaim(promo)} style={{ backgroundColor: promo.isTrial ? "#00ff88" : "#FFD700", padding: 12, borderRadius: 8, marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", textAlign: 'center', color: "black" }}>
              {coins >= promo.coinsNeeded ? `🪙 Use ${promo.coinsNeeded} coins = Extra R${promo.coinsNeeded/10} OFF & Call` : `📞 Get Discount & Call Business`}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#888", fontSize: 9, marginTop: 6, textAlign: 'center' }}>{promo.isTrial ? "Business on FREE trial - lead not billed" : "Business pays R30 for this call - Option B"}</Text>
        </View>
      ))}
    </ScrollView>
  );
      }
