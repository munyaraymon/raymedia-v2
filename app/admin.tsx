import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CATEGORIES = ["Home Services","Food & Takeaway","Beauty & Care","Auto & Repair","Health","Shopping & Retail","Education & Kids","Deals from Amazon"];

export default function Admin() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);

  const [bannerTitle, setBannerTitle] = useState("Premium Banner - Your Business Here");
  const [bannerSub, setBannerSub] = useState("Advertise in Randburg from R250/month - Tap to Advertise");
  const [bannerLink, setBannerLink] = useState("");

  useEffect(() => {
    loadBusinesses();
    AsyncStorage.getItem('raymedia_banner').then(b => {
      if(b){ const d = JSON.parse(b); setBannerTitle(d.title||bannerTitle); setBannerSub(d.sub||bannerSub); setBannerLink(d.link||""); }
    });
  }, []);

  const loadBusinesses = async () => {
    const p1 = await AsyncStorage.getItem('raymedia_businesses');
    const p2 = await AsyncStorage.getItem('real_promos');
    let all:any[] = [];
    if(p1) all = all.concat(JSON.parse(p1).map((x:any)=>({ id: x.id, name: x.name||x.businessName, category: x.category, phone: x.phone, address: x.address||"" })));
    // dedup by id
    const map = new Map(); all.forEach(b=>map.set(b.id,b));
    setBusinesses(Array.from(map.values()));
  };

  const saveBusiness = async () => {
    if(!name ||!phone){ Alert.alert("Fill name & phone"); return; }
    const newBiz = { id: Date.now().toString(), name, category, phone, address };
    const existingRaw = await AsyncStorage.getItem('raymedia_businesses');
    const existing = existingRaw? JSON.parse(existingRaw) : [];
    const updated = [...existing, newBiz];
    // Save to BOTH keys so old index + new index see it
    await AsyncStorage.setItem('raymedia_businesses', JSON.stringify(updated));
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated.map((x:any)=>({
      id: x.id, businessName: x.name, offer: x.address? `${x.address} • ${x.phone}`: x.phone, category: x.category, searchText: `${x.name} ${x.category} ${x.phone} ${x.address||""}`
    }))));
    setBusinesses(updated);
    setName(""); setPhone(""); setAddress("");
    Alert.alert("Added!");
  };

  const deleteBusiness = async (id: string) => {
    const raw = await AsyncStorage.getItem('raymedia_businesses');
    const list = raw? JSON.parse(raw): [];
    const updated = list.filter((b:any)=> b.id!== id);
    await AsyncStorage.setItem('raymedia_businesses', JSON.stringify(updated));
    await AsyncStorage.setItem('real_promos', JSON.stringify(updated.map((x:any)=>({
      id: x.id, businessName: x.name, offer: x.address? `${x.address} • ${x.phone}`: x.phone, category: x.category
    }))));
    setBusinesses(updated);
  };

  const saveBanner = async () => {
    await AsyncStorage.setItem('raymedia_banner', JSON.stringify({ title: bannerTitle, sub: bannerSub, link: bannerLink }));
    Alert.alert("✅ Banner Live!", "Home banner updated instantly. Tap it to test link.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>RAYMEDIA ADMIN - FINAL</Text>

      <View style={styles.bannerBox}>
        <Text style={styles.bannerHeader}>💰 BANNER CONTROL (Matches Home)</Text>
        <Text style={styles.label}>Big Title (Gold)</Text>
        <TextInput value={bannerTitle} onChangeText={setBannerTitle} style={styles.input} placeholderTextColor="#666" />
        <Text style={styles.label}>Small Subtitle / Price</Text>
        <TextInput value={bannerSub} onChangeText={setBannerSub} style={styles.input} placeholderTextColor="#666" />
        <Text style={styles.label}>Link when tapped (WhatsApp / website)</Text>
        <TextInput value={bannerLink} onChangeText={setBannerLink} style={styles.input} placeholder="https://wa.me/2772... or https://..." placeholderTextColor="#555" autoCapitalize="none" />
        <TouchableOpacity onPress={saveBanner} style={styles.goldBtn}>
          <Text style={styles.goldBtnText}>SAVE BANNER → HOME UPDATES</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.formHeader}>Add Business (saves for all versions)</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Business Name" placeholderTextColor="#666" />
        <View style={styles.pickerBox}>
          <Picker selectedValue={category} onValueChange={setCategory} style={{ color: "white" }}>
            {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="WhatsApp" placeholderTextColor="#666" keyboardType="phone-pad" />
        <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="Area e.g. Randburg" placeholderTextColor="#666" />
        <TouchableOpacity onPress={saveBusiness} style={styles.saveBtn}>
          <Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>+ ADD BUSINESS</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listHeader}>Saved ({businesses.length}) - Visible in old & new app</Text>
      {businesses.map((b:any) => (
        <View key={b.id} style={styles.bizCard}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{b.name}</Text>
          <Text style={{ color: "#d4b86a", fontSize: 11 }}>{b.category} • {b.phone}</Text>
          <TouchableOpacity onPress={() => deleteBusiness(b.id)}><Text style={{ color: "red", fontSize: 11, marginTop: 4 }}>Delete</Text></TouchableOpacity>
        </View>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 12 },
  header: { color: "#d4b86a", fontSize: 16, fontWeight: "bold", textAlign: "center", marginVertical: 14 },
  bannerBox: { backgroundColor: "#111", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#d4b86a", marginBottom: 16 },
  bannerHeader: { color: "#d4b86a", fontWeight: "bold", marginBottom: 10, fontSize: 12 },
  label: { color: "#aaa", fontSize: 9, marginBottom: 3, marginTop: 6 },
  input: { backgroundColor: "#222", color: "white", padding: 9, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: "#333", fontSize: 12 },
  goldBtn: { backgroundColor: "#d4b86a", padding: 11, borderRadius: 8, marginTop: 6 },
  goldBtnText: { textAlign: "center", fontWeight: "bold", color: "#000", fontSize: 11 },
  formBox: { backgroundColor: "#111", padding: 12, borderRadius: 12, marginBottom: 16 },
  formHeader: { color: "white", fontWeight: "bold", marginBottom: 10, fontSize: 12 },
  pickerBox: { backgroundColor: "#222", borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: "#333" },
  saveBtn: { backgroundColor: "#333", padding: 11, borderRadius: 8, marginTop: 4 },
  listHeader: { color: "white", fontWeight: "bold", marginBottom: 8, fontSize: 12 },
  bizCard: { backgroundColor: "#151515", padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: "#222" }
});
