import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const [promos, setPromos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [banner, setBanner] = useState({ title: "Premium Banner - Your Business Here", sub: "Advertise in Randburg from R250/month - Tap to Advertise", link: "" });
  const router = useRouter();

  const CATEGORIES = [
    { id: 'Home Services', name: 'Home Services', icon: '🔧' },
    { id: 'Food & Takeaway', name: 'Food & Takeaway', icon: '🍔' },
    { id: 'Beauty & Care', name: 'Beauty & Care', icon: '✂️' },
    { id: 'Auto & Repair', name: 'Auto & Repair', icon: '🚗' },
    { id: 'Health', name: 'Health', icon: '➕' },
    { id: 'Shopping & Retail', name: 'Shopping & Retail', icon: '🛍️' },
    { id: 'Education & Kids', name: 'Education & Kids', icon: '🎓' },
    { id: 'Deals from Amazon', name: 'Deals from Amazon', icon: '📦' },
  ];

  const load = async () => {
    try {
      // Load businesses from BOTH keys (old + new admin)
      const p1 = await AsyncStorage.getItem('real_promos');
      const p2 = await AsyncStorage.getItem('raymedia_businesses');
      const b = await AsyncStorage.getItem('raymedia_banner');
      
      let all: any[] = [];
      if (p1) all = all.concat(JSON.parse(p1));
      if (p2) {
        const parsed = JSON.parse(p2);
        // Convert new format to promo format
        const converted = parsed.map((x:any) => ({
          id: x.id,
          businessName: x.name,
          offer: x.address ? `${x.address} • ${x.phone}` : x.phone,
          category: x.category,
          searchText: `${x.name} ${x.category} ${x.phone} ${x.address || ""}`
        }));
        all = all.concat(converted);
      }
      if (all.length > 0) setPromos(all);
      
      if (b) setBanner(JSON.parse(b));
    } catch {}
  };

  useEffect(() => { load(); const t = setInterval(load, 2000); return () => clearInterval(t); }, []);

  const filtered = promos.filter((item) => {
    const s = (item.searchText || (item.businessName + " " + item.offer + " " + (item.category||""))).toLowerCase();
    const matchesSearch = s.includes(search.toLowerCase());
    const matchesCat = !selectedCat || (item.category && item.category.toLowerCase() === selectedCat.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const openBanner = () => {
    if (banner.link) {
      Linking.openURL(banner.link);
    } else {
      // Default - open WhatsApp to you
      Linking.openURL("https://wa.me/27721234567?text=Hi%20Raymedia,%20I%20want%20to%20advertise%20on%20banner");
    }
  };

  if (selectedCat) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 40 }}>
        <View style={{ paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setSelectedCat(null)}><Text style={{ color: "#d4b86a", fontSize: 20 }}>{"< "}</Text></TouchableOpacity>
          <Text style={{ color: "#d4b86a", fontSize: 16, fontWeight: "700", flex: 1 }}>{selectedCat} in Randburg</Text>
        </View>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search..." placeholderTextColor="#555" style={{ backgroundColor: "#141414", color: "white", padding: 9, borderRadius: 10, margin: 12, borderWidth: 1, borderColor: "#222", fontSize: 13 }} />
        
        {/* BANNER ALSO IN CATEGORY SCREEN */}
        <TouchableOpacity onPress={openBanner} style={{ backgroundColor: "#0e0e0e", borderWidth: 1, borderColor: "#d4b86a", borderRadius: 10, padding: 8, marginHorizontal: 12, marginBottom: 8 }}>
          <Text style={{ color: "#666", fontSize: 7 }}>AD • Sponsored by RAYMEDIA</Text>
          <Text style={{ color: "#d4b86a", fontWeight: "700", fontSize: 10 }}>{banner.title}</Text>
          <Text style={{ color: "#888", fontSize: 8 }}>{banner.sub}</Text>
        </TouchableOpacity>

        <ScrollView style={{ padding: 12 }}>
          <Text style={{ color: "#d4b86a", marginBottom: 8, fontSize: 11 }}>{filtered.length} LIVE</Text>
          {filtered.map((p) => (
            <View key={p.id} style={{ backgroundColor: "#111", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#222" }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 13 }}>{p.businessName}</Text>
              <Text style={{ color: "#ddd", fontSize: 12, marginTop: 2 }}>{p.offer}</Text>
              <TouchableOpacity onPress={() => p.phone && Linking.openURL(`https://wa.me/${p.phone.replace(/\D/g,'')}`)} style={{ marginTop: 6, backgroundColor: "#d4b86a", padding: 6, borderRadius: 6, alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 35, paddingHorizontal: 10 }}>
      {/* HEADER - COMPACT */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: "#FFD700", fontSize: 18, fontWeight: "900" }}>RAYMEDIA</Text>
        <TouchableOpacity onPress={() => router.push('/admin')} style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}><Text style={{ color: "#888", fontSize: 9 }}>ADMIN</Text></TouchableOpacity>
      </View>

      {/* SEARCH - COMPACT */}
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search pizza, plumber, nails..." placeholderTextColor="#666" style={{ flex: 1, backgroundColor: "#141414", color: "white", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 9, borderWidth: 1, borderColor: "#222", fontSize: 12 }} />
        <TouchableOpacity style={{ backgroundColor: "#FFD700", marginLeft: 6, width: 38, borderRadius: 9, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 13 }}>🔍</Text></TouchableOpacity>
      </View>

      {/* TITLE - COMPACT */}
      <View style={{ marginTop: 10, marginBottom: 6 }}>
        <Text style={{ color: "#d4b86a", fontSize: 17, fontWeight: "700" }}>Find in Randburg</Text>
        <Text style={{ color: "#d4b86a", fontSize: 9, marginTop: 1, opacity: 0.6 }}>Choose a category</Text>
      </View>

      {/* GRID - ULTRA COMPACT TO FIT ONE SCREEN + BANNER */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCat(cat.id)} style={{ width: '48.5%', backgroundColor: "#0e0e0e", borderWidth: 1, borderColor: "#d4b86a", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 4, marginBottom: 6, alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
              <Text style={{ color: "#d4b86a", marginTop: 3, fontWeight: "600", fontSize: 9, textAlign: 'center' }} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BANNER - ALWAYS VISIBLE + CLICKABLE + FROM ADMIN */}
        <TouchableOpacity onPress={openBanner} activeOpacity={0.8} style={{ backgroundColor: "#0e0e0e", borderWidth: 1, borderColor: "#d4b86a", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, marginTop: 4, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: "#666", fontSize: 7 }}>AD • Sponsored by RAYMEDIA • Tap to enquire</Text>
            <Text style={{ color: "#d4b86a", fontSize: 7 }}>● LIVE</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
            <Text style={{ fontSize: 10 }}>📢</Text>
            <Text style={{ color: "#d4b86a", fontWeight: "700", marginLeft: 5, fontSize: 10, flex: 1 }} numberOfLines={1}>{banner.title}</Text>
          </View>
          <Text style={{ color: "#aaa", fontSize: 8, marginTop: 2 }} numberOfLines={1}>{banner.sub}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
     }
