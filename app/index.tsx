import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const router = useRouter();

  const CATS = [
    { id: 'all', name: 'All', icon: '🔥' },
    { id: 'Food', name: 'Food', icon: '🍔' },
    { id: 'Beauty', name: 'Beauty', icon: '💅' },
    { id: 'Home', name: 'Home', icon: '🔧' },
    { id: 'Health', name: 'Health', icon: '⚕️' },
    { id: 'Auto', name: 'Auto', icon: '🚗' },
    { id: 'Fashion', name: 'Fashion', icon: '👗' },
  ];

  const load = async () => {
    try {
      const p = await AsyncStorage.getItem('real_promos');
      if (p) setPromos(JSON.parse(p));
    } catch (e) {}
  };
  useEffect(() => { load(); const t = setInterval(load, 2000); return () => clearInterval(t); }, []);

  const filtered = promos.filter((item) => {
    const s = (item.searchText || (item.businessName + item.offer + item.service + item.category)).toLowerCase();
    const matchesSearch = s.includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || (item.category && item.category.toLowerCase() === selectedCat.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "900", letterSpacing: 1 }}>RAYMEDIA</Text>
          <TouchableOpacity onPress={() => router.push('/admin')} style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}><Text style={{ color: "#888", fontSize: 11 }}>ADMIN</Text></TouchableOpacity>
        </View>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search pizza, plumber, nails..." placeholderTextColor="#555" style={{ backgroundColor: "#141414", color: "white", padding: 14, borderRadius: 12, marginTop: 14, borderWidth: 1, borderColor: "#222" }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6, gap: 8 }} style={{ flexGrow: 0 }}>
        {CATS.map((cat) => {
          const active = selectedCat === cat.id;
          return (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ backgroundColor: active ? "#FFD700" : "#1e1e1e", paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 5, fontSize: 12 }}>{cat.icon}</Text>
              <Text style={{ color: active ? "#000" : "#fff", fontWeight: active ? "900" : "600", fontSize: 13 }}>{cat.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={{ flex: 1, padding: 16, marginTop: 8 }}>
        <Text style={{ color: "#FFD700", fontWeight: "bold", marginBottom: 10 }}>{filtered.length} LIVE Deals in {selectedCat === 'all' ? 'Randburg' : selectedCat}</Text>
        {filtered.map((p) => (
          <View key={p.id} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#222" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{p.businessName}</Text>
              <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}><Text style={{ color: "#FFD700", fontSize: 10 }}>{p.category || p.service} • {p.area}</Text></View>
            </View>
            <Text style={{ color: "#fff", marginTop: 8, fontSize: 14 }}>{p.offer}</Text>
            {p.price ? <Text style={{ color: "#FFD700", marginTop: 4, fontWeight: "bold" }}>{p.price}</Text> : null}
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <TouchableOpacity onPress={() => Linking.openURL('tel:' + p.phone)} style={{ flex: 1, backgroundColor: "white", padding: 12, borderRadius: 10, marginRight: 6 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>Call</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + p.phone.replace(/[^0-9]/g, ''))} style={{ flex: 1, backgroundColor: "#25D366", padding: 12, borderRadius: 10, marginLeft: 6 }}><Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>WhatsApp</Text></TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
    }
