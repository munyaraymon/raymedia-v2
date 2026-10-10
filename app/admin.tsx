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

  const handleLogin = () => { if (password === "ray1234") { setIsLoggedIn(true); loadAll(); } else Alert.alert("Wrong password"); };
  const handleAdd = async () => {
    if (!businessName ||!offer ||!phone) { Alert.alert("Fill all"); return; }
    const newPromo = { id: Date.now(), businessName, service, area, offer, price, phone };
    const updated = [...realPromos, newPromo];
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
    setBusinessName(""); setOffer(""); setPrice(""); setPhone(""); setService("");
    Alert.alert("LIVE!");
  };
  const handleDelete = async (id) => {
    const updated = realPromos.filter(p => p.id!== id);
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated));
    setRealPromos(updated);
  };
  const addSponsor = async () => {
    if (!adBusiness ||!adOffer ||!adPhone) { Alert.alert("Fill sponsor fields"); return; }
    if (sponsoredAds.length >= 3) { Alert.alert("Max 3 sponsors. Delete one first."); return; }
    const newAd = { id: Date.now(), businessName: adBusiness, offer: adOffer, phone: adPhone, image: adImage };
    const updated = [...sponsoredAds, newAd];
    await AsyncStorage.setItem('sponsored_ads', JSON.stringify(updated));
    setSponsoredAds(updated);
    setAdBusiness(""); setAdOffer(""); setAdPhone(""); setAdImage("");
    Alert.alert("Sponsor added! Rotates at bottom");
  };
  const deleteSponsor = async (id) => {
    const updated = sponsoredAds.filter(a => a.id!== id);
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
      <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Business Name" style={input} />
      <TextInput value={service} onChangeText={setService} placeholder="Service" style={input} />
      <TextInput value={area} onChangeText={setArea} placeholder="Area" style={input} />
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer" style={input} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price" style={input} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" style={input} />
      <TouchableOpacity onPress={handleAdd} style={btn}><Text style={btnT}>SAVE - MAKE LIVE</Text></TouchableOpacity>

      <Text style={{ color: "#FFD700", fontWeight: "bold", marginTop: 30, fontSize: 16 }}>💰 PAID ROTATING BANNERS (R500/mo each - Max 3)</Text>
      <Text style={{ color: "#888", fontSize: 10 }}>Add image link e.g. https://.../food.jpg - Leave empty for text only. Video coming next update.</Text>
      <TextInput value={adBusiness} onChangeText={setAdBusiness} placeholder="Sponsor Business e.g. Nando's" style={input} />
      <TextInput value={adOffer} onChangeText={setAdOffer} placeholder="Sponsor Offer e.g. 2 for 1" style={input} />
      <TextInput value={adPhone} onChangeText={setAdPhone} placeholder="Sponsor Phone" style={input} />
      <TextInput value={adImage} onChangeText={setAdImage} placeholder="Image URL (optional) - e.g. https://i.imgur.com/..." style={input} />
      <TouchableOpacity onPress={addSponsor} style={btn}><Text style={btnT}>ADD SPONSOR TO ROTATION</Text></TouchableOpacity>

      <View style={{ marginTop: 15 }}>
        {sponsoredAds.map((a, idx) => (
          <View key={a.id} style={{ backgroundColor: "#222", padding: 10, borderRadius: 8, marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "white" }}>{idx+1}. {a.businessName} - {a.offer} {a.image? "🖼️" : "📝"}</Text>
            <TouchableOpacity onPress={() => deleteSponsor(a.id)}><Text style={{ color: "red" }}>X</Text></TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 30 }}><Text style={{ color: "#FFD700", fontWeight: "bold" }}>Live Promos ({realPromos.length})</Text>
        {realPromos.map((p) => {
          const s = stats[p.id] || { views: 0, calls: 0, whatsapps: 0 };
          return <View key={p.id} style={{ backgroundColor: "#1a1a1a", padding: 12, borderRadius: 10, marginTop: 10 }}><Text style={{ color: "white", fontWeight: "bold" }}>{p.businessName}</Text><Text style={{ color: "#FFD700", marginTop: 5 }}>Views {s.views} | Calls {s.calls} | WA {s.whatsapps}</Text><TouchableOpacity onPress={() => handleDelete(p.id)}><Text style={{ color: "red", marginTop: 8 }}>Delete</Text></TouchableOpacity></View>;
        })}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
const input = { backgroundColor: "white", padding: 14, borderRadius: 10, marginTop: 10 } as any;
const btn = { backgroundColor: "#FFD700", padding: 16, borderRadius: 12, marginTop: 10 } as any;
const btnT = { textAlign: "center", fontWeight: "bold" } as any;
