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
    try { const p = await AsyncStorage.getItem('real_promos'); if (p) setPromos(JSON.parse(p)); } catch {}
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
      <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 40 }}>
        <View style={{ paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setSelectedCat(null)}><Text style={{ color: "#d4b86a", fontSize: 20 }}>{"< "}</Text></TouchableOpacity>
          <Text style={{ color: "#d4b86a", fontSize: 18, fontWeight: "700", flex: 1 }}>{selectedCat} in Randburg</Text>
        </View>
        <TextInput value={search} onChangeText={setSearch} placeholder={`Search...`} placeholderTextColor="#555" style={{ backgroundColor: "#141414", color: "white", padding: 10, borderRadius: 10, margin: 12, borderWidth: 1, borderColor: "#222" }} />
        <ScrollView style={{ padding: 12 }}>
          <Text style={{ color: "#d4b86a", marginBottom: 8, fontSize: 12 }}>{filtered.length} LIVE</Text>
          {filtered.map((p) => (
            <View key={p.id} style={{ backgroundColor: "#111", borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 13 }}>{p.businessName}</Text>
              <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{p.offer}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 35, paddingHorizontal: 12 }}>
      {/* HEADER - SMALLER */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: "#FFD700", fontSize: 20, fontWeight: "900" }}>RAYMEDIA</Text>
        <TouchableOpacity onPress={() => router.push('/admin')} style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}><Text style={{ color: "#888", fontSize: 10 }}>ADMIN</Text></TouchableOpacity>
      </View>

      {/* SEARCH - SMALLER */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search pizza, plumber, nails..." placeholderTextColor="#666" style={{ flex: 1, backgroundColor: "#141414", color: "white", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: "#222", fontSize: 13 }} />
        <TouchableOpacity style={{ backgroundColor: "#FFD700", marginLeft: 6, width: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 14 }}>🔍</Text></TouchableOpacity>
      </View>

      {/* TITLE - SMALLER */}
      <View style={{ marginTop: 12, marginBottom: 8 }}>
        <Text style={{ color: "#d4b86a", fontSize: 20, fontWeight: "700" }}>Find in Randburg</Text>
        <Text style={{ color: "#d4b86a", fontSize: 10, marginTop: 2, opacity: 0.7 }}>Choose a category to explore local services</Text>
      </View>

      {/* GRID - COMPACT TO FIT ONE SCREEN */}
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ width: '48.5%', backgroundColor: "#0e0e0e", borderWidth: 1, borderColor: "#d4b86a", borderRadius: 12, paddingVertical: 10, marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
              <Text style={{ color: "#d4b86a", marginTop: 5, fontWeight: "600", fontSize: 10, textAlign: 'center' }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BANNER - ALWAYS VISIBLE */}
        <View style={{ backgroundColor: "#0e0e0e", borderWidth: 1, borderColor: "#d4b86a", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 10, marginTop: 2 }}>
          <Text style={{ color: "#888", fontSize: 8 }}>AD • Sponsored</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ fontSize: 12 }}>🔄</Text>
            <Text style={{ color: "#d4b86a", fontWeight: "700", marginLeft: 6, fontSize: 11 }}>Premium Banner - Your Business Here</Text>
          </View>
          <Text style={{ color: "#666", fontSize: 8, marginTop: 2 }}>rotating banner ad</Text>
        </View>
      </View>
    </View>
  );
     }
