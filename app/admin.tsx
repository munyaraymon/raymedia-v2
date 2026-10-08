import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ADMIN_PASSWORD = "ray1234"; // CHANGE THIS TO YOUR OWN PASSWORD

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  
  // Form fields
  const [businessName, setBusinessName] = useState("");
  const [service, setService] = useState("");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  
  const [realPromos, setRealPromos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => { loadPromos(); }, []);

  const loadPromos = async () => {
    const saved = await AsyncStorage.getItem('real_promos');
    if (saved) setRealPromos(JSON.parse(saved));
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      Alert.alert("Wrong password");
    }
  };

  const handleAddPromo = async () => {
    if (!businessName || !offer || !phone) {
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
    Alert.alert("Success!", `${newPromo.businessName} added and now LIVE for customers`);
  };

  const handleDelete = async (id: number) => {
    const updated = realPromos.filter(p => p.id !== id);
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Add Real Business Promo</Text>
      <Text style={{ color: "#888", fontSize: 11, marginBottom: 15 }}>This will show to ALL customers instantly</Text>

      <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Business Name e.g Nando's Randburg" style={styles.input} />
      <TextInput value={service} onChangeText={setService} placeholder="Service e.g Restaurant, Plumbing" style={styles.input} />
      <TextInput value={area} onChangeText={setArea} placeholder="Area e.g Randburg" style={styles.input} />
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer e.g 20% OFF or 2 for 1" style={styles.input} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price e.g R150" style={styles.input} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone e.g 0821234567" keyboardType="phone-pad" style={styles.input} />

      <TouchableOpacity onPress={handleAddPromo} style={{ backgroundColor: "#FFD700", padding: 16, borderRadius: 12, marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", color: "black" }}>SAVE PROMO - MAKE IT LIVE</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>
        <Text style={{ color: "#FFD700", fontWeight: "bold" }}>Live Real Promos ({realPromos.length})</Text>
        {realPromos.map(p => (
          <View key={p.id} style={{ backgroundColor: "#1a1a1a", padding: 12, borderRadius: 10, marginTop: 10 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{p.businessName} - {p.offer}</Text>
            <Text style={{ color: "#888", fontSize: 11 }}>{p.service} | {p.area} | {p.price} | {p.phone}</Text>
            <TouchableOpacity onPress={() => handleDelete(p.id)} style={{ marginTop: 8 }}>
              <Text style={{ color: "red", fontSize: 12 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={() => setIsLoggedIn(false)} style={{ marginTop: 30, marginBottom: 50 }}>
        <Text style={{ color: "#888", textAlign: "center" }}>Logout Admin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: { backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 } as any
};
