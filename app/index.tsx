import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const router = useRouter();

  const CATEGORIES = [
    { id: 'Home', name: 'Home Services', icon: '🔧' },
    { id: 'Food', name: 'Food & Takeaway', icon: '🍔' },
    { id: 'Beauty', name: 'Beauty & Care', icon: '✂️' },
    { id: 'Auto', name: 'Auto & Repair', icon: '🚗' },
    { id: 'Health', name: 'Health', icon: '➕' },
    { id: 'Fashion', name: 'Shopping & Retail', icon: '🛍️' },
    { id: 'Education', name: 'Education & Kids', icon: '🎓' },
    { id: 'Amazon', name: 'Deals from Amazon', icon: '📦' },
  ];

  const load = async () => {
    try {
      const p = await AsyncStorage.getItem('real_promos');
      if (p) setPromos(JSON.parse(p));
    } catch {}
  };
  useEffect(() => { load(); const t = setInterval(load, 2000); return () => clearInterval(t); }, []);

  const filtered = promos.filter((item) => {
    const s = (item.searchText || (item.businessName + " " + item.offer + " " + (item.category||""))).toLowerCase();
    const matchesSearch = s.includes(search.toLowerCase());
    const matchesCat = !selectedCat || (item.category && item.category.toLowerCase() === selectedCat.toLowerCase());
    return matchesSearch && matchesCat;
  });

  if (selectedCat) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 50 }}>
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => setSelectedCat(null)}><Text style={{ color: "#FFD700", fontSize: 22 }}>{"< "} </Text></TouchableOpacity>
          <Text style={{ color: "#d4b86a", fontSize: 20, fontWeight: "700", flex: 1 }}> {selectedCat} in Randburg</Text>
          <TouchableOpacity onPress={() => router.push('/admin')}><Text style={{ color: "#666", fontSize: 12 }}>ADMIN</Text></TouchableOpacity>
        </View>
        <TextInput value={search} onChangeText={setSearch} placeholder={`Search in ${selectedCat}...`} placeholderTextColor="#555" style={{ backgroundColor: "#141414", color: "white", padding: 14, borderRadius: 12, margin: 16, borderWidth: 1, borderColor: "#222" }} />
        <ScrollView style={{ padding: 16 }}>
          <Text style={{ color: "#FFD700", marginBottom: 12 }}>{filtered.length} LIVE Deals</Text>
          {filtered.map((p) => (
            <View key={p.id} style={{ backgroundColor: "#111", borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#222" }}>
              <Text style={{ color: "white", fontWeight: "bold" }}>{p.businessName}</Text>
              <Text style={{ color: "#888", fontSize: 11, marginTop: 2 }}>{p.area}</Text>
              <Text style={{ color: "#fff", marginTop: 6 }}>{p.offer}</Text>
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:' + p.phone)} style={{ flex: 1, backgroundColor: "white", padding: 10, borderRadius: 8, marginRight: 6 }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>Call</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + p.phone.replace(/[^0-9]/g,''))} style={{ flex: 1, backgroundColor: "#25D366", padding: 10, borderRadius: 8, marginLeft: 6 }}><Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>WhatsApp</Text></TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 50 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: "#FFD700", fontSize: 22, fontWeight: "900" }}>RAYMEDIA</Text>
        <TouchableOpacity onPress={() => router.push('/admin')} style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}><Text style={{ color: "#888", fontSize: 11 }}>ADMIN</Text></TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12, flexDirection: 'row' }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search pizza, plumber, nails..." placeholderTextColor="#666" style={{ flex: 1, backgroundColor: "#141414", color: "white", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#222" }} />
        <TouchableOpacity style={{ backgroundColor: "#FFD700", marginLeft: 8, width: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: "bold" }}>🔍</Text></TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <Text style={{ color: "#d4b86a", fontSize: 24, fontWeight: "700" }}>Find in Randburg</Text>
        <Text style={{ color: "#d4b86a", fontSize: 12, marginTop: 4, opacity: 0.8 }}>Choose a category to explore local services</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ width: '48%', backgroundColor: "#0e0e0e", borderWidth: 1.5, borderColor: "#d4b86a", borderRadius: 16, paddingVertical: 22, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 36, color: "#d4b86a" }}>{cat.icon}</Text>
              <Text style={{ color: "#d4b86a", marginTop: 12, fontWeight: "600", fontSize: 12, textAlign: 'center' }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor: "#0e0e0e", borderWidth: 1.5, borderColor: "#d4b86a", borderRadius: 14, padding: 12, marginTop: 10 }}>
          <Text style={{ color: "#888", fontSize: 10 }}>AD • Sponsored</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: "#d4b86a", fontSize: 18 }}>🔄</Text>
            <Text style={{ color: "#d4b86a", fontWeight: "700", marginLeft: 8, fontSize: 12 }}>Premium Banner - Your Business Here</Text>
          </View>
          <Text style={{ color: "#666", fontSize: 9, marginTop: 4 }}>rotating banner ad</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
                                 }
