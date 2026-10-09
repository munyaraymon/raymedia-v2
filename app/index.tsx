import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

const MOCK_PROMOS = [
  { id: 1, businessName: "Joe's Plumbing", service: "Plumbing", area: "Randburg", offer: "20% OFF First Call", price: "R350", phone: "0820000001" },
  { id: 2, businessName: "Sarah's Electrical", service: "Electrical", area: "Fourways", offer: "Free Call Out", price: "R0", phone: "0820000002" },
  { id: 3, businessName: "James K Builders", service: "Building", area: "Sandton", offer: "10% OFF Renovation", price: "R5000", phone: "0820000003" },
];

export default function Index() {
  const [realPromos, setRealPromos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem('real_promos');
    const savedStats = await AsyncStorage.getItem('ray_stats');
    if (saved) setRealPromos(JSON.parse(saved));
    if (savedStats) setStats(JSON.parse(savedStats));
    setLoading(false);
  };

  const saveStats = async (newStats) => {
    setStats(newStats);
    await AsyncStorage.setItem('ray_stats', JSON.stringify(newStats));
  };

  const promosToShow = realPromos.length > 0? realPromos : MOCK_PROMOS;

  useEffect(() => {
    if (!loading) {
      const newStats = {...stats };
      promosToShow.forEach((p) => {
        if (!newStats[p.id]) newStats[p.id] = { views: 0, calls: 0, whatsapps: 0 };
        newStats[p.id].views += 1;
      });
      saveStats(newStats);
    }
  }, [loading]);

  const handleCall = async (promo) => {
    const newStats = {...stats };
    if (!newStats[promo.id]) newStats[promo.id] = { views: 0, calls: 0, whatsapps: 0 };
    newStats[promo.id].calls += 1;
    await saveStats(newStats);
    Linking.openURL(`tel:${promo.phone}`);
  };

  const handleWhatsapp = async (promo) => {
    const newStats = {...stats };
    if (!newStats[promo.id]) newStats[promo.id] = { views: 0, calls: 0, whatsapps: 0 };
    newStats[promo.id].whatsapps += 1;
    await saveStats(newStats);
    const clean = promo.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${clean}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <ScrollView style={{ flex: 1, padding: 16, paddingTop: 60 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>Raymedia</Text>
            <Text style={{ color: "white", fontSize: 12 }}>{realPromos.length} LIVE Deals</Text>
          </View>
          <Link href="/admin" asChild>
            <TouchableOpacity style={{ backgroundColor: "#1a1a1a", padding: 10, borderRadius: 20 }}>
              <Text style={{ color: "#FFD700", fontSize: 10 }}>ADMIN</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={{ marginTop: 20 }}>
          {promosToShow.map((promo) => (
            <View key={promo.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#FFD700" }}>
              <Text style={{ color: "#FFD700", fontSize: 16, fontWeight: "bold" }}>{promo.businessName}</Text>
              <Text style={{ color: "#aaa", fontSize: 11 }}>{promo.service} - {promo.area}</Text>
              <Text style={{ color: "white", marginTop: 8 }}>{promo.offer}</Text>
              <Text style={{ color: "#FFD700", fontWeight: "bold", marginTop: 4 }}>{promo.price}</Text>
              <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
                <TouchableOpacity onPress={() => handleCall(promo)} style={{ backgroundColor: "#FFD700", padding: 10, borderRadius: 8, flex: 1 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 12 }}>CALL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleWhatsapp(promo)} style={{ backgroundColor: "white", padding: 10, borderRadius: 8, flex: 1 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 12 }}>WHATSAPP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
    }
