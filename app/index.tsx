import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const router = useRouter();

  const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'Food', name: 'Food' },
    { id: 'Beauty', name: 'Beauty' },
    { id: 'Home', name: 'Home' },
    { id: 'Auto', name: 'Auto' },
  ];

  const load = async () => {
    try {
      const p = await AsyncStorage.getItem('real_promos');
      if (p) {
        setPromos(JSON.parse(p));
      }
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = promos.filter((item) => {
    const name = item.businessName || "";
    const offer = item.offer || "";
    const service = item.service || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || offer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || service.toLowerCase().includes(selectedCat.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 60 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>RAYMEDIA</Text>
        <TouchableOpacity onPress={() => router.push('/admin')}>
          <Text style={{ color: "#888" }}>ADMIN</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search..."
        placeholderTextColor="#555"
        style={{ backgroundColor: "#111", color: "white", margin: 16, padding: 12, borderRadius: 10 }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 10 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ backgroundColor: selectedCat === cat.id ? "#FFD700" : "#222", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
            <Text style={{ color: selectedCat === cat.id ? "black" : "white", fontWeight: "bold" }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "#FFD700", marginBottom: 10 }}>{filtered.length} LIVE Deals</Text>
        {filtered.map((p) => (
          <View key={p.id} style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{p.businessName}</Text>
            <Text style={{ color: "#aaa", fontSize: 12 }}>{p.service} - {p.area}</Text>
            <Text style={{ color: "white", marginTop: 6 }}>{p.offer}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity onPress={() => Linking.openURL('tel:' + p.phone)} style={{ backgroundColor: "white", padding: 10, borderRadius: 8, flex: 1, marginRight: 5 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + p.phone)} style={{ backgroundColor: "#25D366", padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
      }
