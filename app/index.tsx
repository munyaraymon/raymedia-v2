import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'Food', name: 'Food', icon: '🍔' },
  { id: 'Beauty', name: 'Beauty', icon: '💅' },
  { id: 'Home', name: 'Home Services', icon: '🔧' },
  { id: 'Health', name: 'Health', icon: '⚕️' },
  { id: 'Auto', name: 'Auto', icon: '🚗' },
  { id: 'Fashion', name: 'Fashion', icon: '👗' },
  { id: 'Other', name: 'Other', icon: '✨' },
];

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const router = useRouter();

  const load = async () => {
    try {
      const p = await AsyncStorage.getItem('real_promos');
      const ads = await AsyncStorage.getItem('sponsored_ads');
      if (p) setPromos(JSON.parse(p));
      if (ads) setSponsors(JSON.parse(ads));
    } catch (e) {}
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  useEffect(() => {
    if (sponsors.length > 1) {
      const interval = setInterval(() => {
        setCurrentSponsorIndex((prev) => (prev + 1) % sponsors.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sponsors]);

  const track = async (id, type) => {
    try {
      const st = await AsyncStorage.getItem('ray_stats');
      let stats = st? JSON.parse(st) : {};
      if (!stats[id]) stats[id] = { views: 0, calls: 0, whatsapps: 0 };
      if (type === 'view') stats[id].views++;
      if (type === 'call') stats[id].calls++;
      if (type === 'wa') stats[id].whatsapps++;
      await AsyncStorage.setItem('ray_stats', JSON.stringify(stats));
    } catch (e) {}
  };

  const filtered = promos.filter((p) => {
    const matchSearch = p.businessName.toLowerCase().includes(search.toLowerCase()) || p.offer.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || (p.service && p.service.toLowerCase().includes(selectedCat.toLowerCase()));
    return matchSearch && matchCat;
  });

  const currentSponsor = sponsors[currentSponsorIndex];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "900", letterSpacing: 2 }}>RAYMEDIA</Text>
          <TouchableOpacity onPress={() => router.push('/admin')} style={{ backgroundColor: "#1a1a1a", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
            <Text style={{ color: "#666", fontSize: 11 }}>ADMIN</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Find deals in Randburg</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search pizza, plumber, nails..."
          placeholderTextColor="#555"
          style={{ backgroundColor: "#111", color: "white", padding: 14, borderRadius: 12, marginTop: 16, borderWidth: 1, borderColor: "#222" }}
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ backgroundColor: active? "#FFD700" : "#1a1a1a", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, flexDirection: 'row' }}>
                <Text style={{ marginRight: 5 }}>{cat.icon}</Text>
                <Text style={{ color: active? "black" : "white", fontWeight: active? "bold" : "500", fontSize: 13 }}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "#FFD700", fontWeight: "bold", marginBottom: 10 }}>{filtered.length} LIVE Deals</Text>

        {filtered.map((p) => (
          <View key={p.id} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#222" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{p.businessName}</Text>
              <Text style={{ color: "#FFD700", fontSize: 11, backgroundColor: "#1a1a1a", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>{p.area}</Text>
            </View>
            <Text style={{ color: "#888", fontSize: 11, marginTop: 2 }}>{p.service}</Text>
            <Text style={{ color: "white", marginTop: 8 }}>{p.offer}</Text>
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <TouchableOpacity onPress={() => { track(p.id, 'call'); Linking.openURL('tel:' + p.phone); }} style={{ flex: 1, backgroundColor: "white", padding: 12, borderRadius: 10, marginRight: 8 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { track(p.id, 'wa'); Linking.openURL('https://wa.me/' + p.phone.replace(/[^0-9]/g, '')); }} style={{ flex: 1, backgroundColor: "#25D366", padding: 12, borderRadius: 10, marginLeft: 8 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {currentSponsor? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: "#FFD700", padding: 12, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Text style={{ fontSize: 9, fontWeight: "bold" }}>SPONSORED</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + currentSponsor.phone.replace(/[^0-9]/g, ''))} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "900", fontSize: 14, color: "#000" }}>{currentSponsor.businessName} - {currentSponsor.offer}</Text>
              <Text style={{ fontSize: 11, color: "#000" }}>Tap to WhatsApp</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
    }
