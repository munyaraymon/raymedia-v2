import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Food");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [realPromos, setRealPromos] = useState([]);
  const router = useRouter();

  const CATS = ["Food","Beauty","Home","Health","Auto","Fashion","Other"];

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    const s = await AsyncStorage.getItem('real_promos');
    if (s) setRealPromos(JSON.parse(s));
  };
  const handleLogin = () => { if (password === "ray1234") { setIsLoggedIn(true); } else Alert.alert("Wrong password"); };
  
  const handleAdd = async () => {
    if (!businessName || !offer || !phone) { Alert.alert("Fill all required"); return; }
    const newPromo = { 
      id: Date.now(), 
      businessName, 
      category, 
      service: category,
      area, 
      offer, 
      price, 
      phone,
      searchText: (businessName + " " + offer + " " + category + " " + area).toLowerCase()
    };
    const updated = [...realPromos, newPromo];
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
    setBusinessName(""); setOffer(""); setPrice(""); setPhone("");
    Alert.alert("LIVE in " + category + "!");
  };

  const handleDelete = async (id) => {
    const updated = realPromos.filter(p => p.id !== id);
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 20, paddingTop: 100 }}>
        <Text style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>Admin</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 20 }} />
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 15 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>LOGIN</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={{ color: "#888" }}>← Back to App</Text></TouchableOpacity>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold", marginTop: 10 }}>Add Business + Category</Text>
      
      <Text style={{ color: "#888", marginTop: 15, fontSize: 12 }}>SELECT CATEGORY *</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {CATS.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)} style={{ backgroundColor: category === c ? "#FFD700" : "#222", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 }}>
            <Text style={{ color: category === c ? "black" : "white", fontWeight: "bold", fontSize: 12 }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Business Name *" style={input} />
      <TextInput value={area} onChangeText={setArea} placeholder="Address / Area - e.g. Shop 12, Randburg" style={input} />
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer - e.g. 20% off plumbing" style={input} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price - e.g. R500" style={input} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="WhatsApp / Phone *" style={input} />

      <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: "#FFD700", padding: 16, borderRadius: 12, marginTop: 15 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>SAVE TO {category.toUpperCase()} - MAKE LIVE</Text></TouchableOpacity>

      <View style={{ marginTop: 30 }}><Text style={{ color: "#FFD700", fontWeight: "bold" }}>Live ({realPromos.length})</Text>
        {realPromos.map((p) => (
          <View key={p.id} style={{ backgroundColor: "#1a1a1a", padding: 12, borderRadius: 10, marginTop: 10 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{p.businessName} [{p.category}]</Text>
            <Text style={{ color: "#888", fontSize: 11 }}>{p.area}</Text>
            <TouchableOpacity onPress={() => handleDelete(p.id)}><Text style={{ color: "red", marginTop: 6 }}>Delete</Text></TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
const input = { backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 };
