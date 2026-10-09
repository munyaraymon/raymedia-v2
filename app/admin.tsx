import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ADMIN_PASSWORD = "ray1234";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [service, setService] = useState("");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  const [realPromos, setRealPromos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const router = useRouter();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const saved = await AsyncStorage.getItem('real_promos');
    const savedStats = await AsyncStorage.getItem('ray_stats');
    if (saved) setRealPromos(JSON.parse(saved));
    if (savedStats) setStats(JSON.parse(savedStats));
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      loadAll();
    } else {
      Alert.alert("Wrong password");
    }
  };

  const handleAddPromo = async () => {
    if (!businessName ||!offer ||!phone) {
      Alert.alert("Fill business name, offer and phone");
      return;
    }
    const newPromo = {
      id: Date.now(),
      businessName, service, area, offer, price, phone
    };
    const updated = [...realPromos, newPromo];
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
    setBusinessName(""); setService(""); setOffer(""); setPrice(""); setPhone("");
    Alert.alert("Success!", `${newPromo.businessName} is LIVE!`);
  };

  const handleDelete = async (id: number) => {
    const updated = realPromos.filter(p => p.id!== id);
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
    // also delete stats for it
    const newStats = {...stats };
    delete newStats[id];
    await AsyncStorage.setItem('ray_stats', JSON.stringify(newStats));
    setStats(newStats);
  };

  const handleResetStats = async () => {
    Alert.alert("Reset all counts?", "This will reset views/calls to 0", [
      { text: "Cancel" },
      { text: "Reset", onPress: async () => {
        await AsyncStorage.removeItem('ray_stats');
        setStats({});
      }}
    ]);
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 20, paddingTop: 100 }}>
        <Text style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>Raymedia Admin</Text>
        <Text style={{ color: "white", marginTop: 10 }}>Enter password to add real businesses</Text>
        <TextInput
          value={password} onChangeText={setPassword} secureTextEntry
          placeholder="Password" placeholderTextColor="#888"
          style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 20 }}
        />
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 15 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#888", textAlign: "center" }}>Back to App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalViews = Object.values(stats).reduce((sum: number, s: any) => sum + (s.views || 0), 0);
  const totalCalls = Object.values(stats).reduce((sum: number, s: any) => sum + (s.calls || 0), 0);
  const totalWAs = Object.values(stats).reduce((sum: number, s: any) => sum + (s.whatsapps || 0), 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Add Real Business Promo</Text>
      <Text style={{ color: "#888", fontSize: 11, marginBottom: 15 }}>This will show to ALL customers instantly</Text>

      {/* STATS DASHBOARD - THIS IS WHAT YOU SHOW BUSINESSES */}
      <View style={{ backgroundColor: "#FFD700", borderRadius: 12, padding: 12, flex
