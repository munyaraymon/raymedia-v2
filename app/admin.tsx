import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [service, setService] = useState("");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [realPromos, setRealPromos] = useState([]);
  const [stats, setStats] = useState({});
  const [sponsoredAds, setSponsoredAds] = useState([]);
  const [adBusiness, setAdBusiness] = useState("");
  const [adOffer, setAdOffer] = useState("");
  const [adPhone, setAdPhone] = useState("");
  const [adImage, setAdImage] = useState("");
  const router = useRouter();

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    const s = await AsyncStorage.getItem('real_promos');
    const st = await AsyncStorage.getItem('ray_stats');
    const ads = await AsyncStorage.getItem('sponsored_ads');
    if (s) setRealPromos(JSON.parse(s));
    if (st) setStats(JSON.parse(st));
    if (ads) setSponsoredAds(JSON.parse(ads));
  };
  const handleLogin = () => {
    if (password === "ray1234") { setIsLoggedIn(true); loadAll(); } else Alert.alert("Wrong password");
  };
  const handleAdd = async () => {
    if (!businessName || !offer || !phone) { Alert.alert("Fill all"); return; }
    const newPromo = { id: Date.now(), businessName, service, area, offer, price, phone };
    const updated = [...realPromos, newPromo];
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
    setBusinessName(""); setOffer(""); setPrice(""); setPhone(""); setService("");
    Alert.alert("LIVE!");
  };
  const handleDelete = async (id) => {
    const updated = realPromos.filter(p => p.id !== id);
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
  };
  const addSponsor = async () => {
    if (!adBusiness || !adOffer || !adPhone) { Alert.alert("Fill sponsor fields"); return; }
    const newAd = { id: Date.now(), businessName: adBusiness, offer: adOffer, phone: adPhone, image: adImage };
    const updated = [...sponsoredAds, newAd];
    await AsyncStorage.setItem('sponsored_ads', JSON.stringify(updated));
    setSponsoredAds(updated);
    setAdBusiness(""); setAdOffer(""); setAdPhone(""); setAdImage("");
    Alert.alert("Sponsor added!");
  };
  const deleteSponsor = async (id) => {
    const updated = sponsoredAds.filter(a => a.id !== id);
    await AsyncStorage.setItem('sponsored_ads', JSON.stringify(updated));
    setSponsoredAds(updated);
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 20, paddingTop: 100 }}>
        <Text style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>Admin</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 20 }} />
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 15 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>LOGIN</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>Back</Text></TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 16, paddingTop: 60 }}>
      <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold" }}>Add Business</Text>
      <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Business Name" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={service} onChangeText={setService} placeholder="Service e.g. Food, Beauty, Home" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={area} onChangeText={setArea} placeholder="Area" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: "#FFD700", padding: 16, borderRadius: 12, marginTop: 10 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>SAVE - MAKE LIVE</Text></TouchableOpacity>

      <Text style={{ color: "#FFD700", fontWeight: "bold", marginTop: 30 }}>PAID BANNERS (R500/mo)</Text>
      <TextInput value={adBusiness} onChangeText={setAdBusiness} placeholder="Sponsor Business" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={adOffer} onChangeText={setAdOffer} placeholder="Sponsor Offer" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={adPhone} onChangeText={setAdPhone} placeholder="Sponsor Phone" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TextInput value={adImage} onChangeText={setAdImage} placeholder="Image URL optional" style={{ backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 }} />
      <TouchableOpacity onPress={addSponsor} style={{ backgroundColor: "#FFD700", padding: 16, borderRadius: 12, marginTop: 10 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>ADD SPONSOR</Text></TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
    }
