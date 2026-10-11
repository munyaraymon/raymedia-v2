import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CATEGORIES = ["Home Services","Food & Takeaway","Beauty & Care","Auto & Repair","Health","Shopping & Retail","Education & Kids","Deals from Amazon"];

export default function Admin() {
  // --- BUSINESS FORM ---
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);

  // --- BANNER CONTROL ---
  const [bannerTitle, setBannerTitle] = useState("Premium Banner - Your Business Here");
  const [bannerSub, setBannerSub] = useState("Advertise in Randburg from R250/month - Call 072 123 4567");

  useEffect(() => {
    loadBusinesses();
    AsyncStorage.getItem('raymedia_banner').then(b => {
      if(b){ const d = JSON.parse(b); setBannerTitle(d.title); setBannerSub(d.sub); }
    });
  }, []);

  const loadBusinesses = async () => {
    const data = await AsyncStorage.getItem('raymedia_businesses');
    if(data) setBusinesses(JSON.parse(data));
  };

  const saveBusiness = async () => {
    if(!name ||!phone){ Alert.alert("Fill name & phone"); return; }
    const newBiz = { id: Date.now().toString(), name, category, phone, address };
    const updated = [...businesses, newBiz];
    await AsyncStorage.setItem('raymedia_businesses', JSON.stringify(updated));
    setBusinesses(updated);
    setName(""); setPhone(""); setAddress("");
    Alert.alert("Business Added!");
  };

  const deleteBusiness = async (id: string) => {
    const updated = businesses.filter(b => b.id!== id);
    await AsyncStorage.setItem('raymedia_businesses', JSON.stringify(updated));
    setBusinesses(updated);
  };

  const saveBanner = async () => {
    await AsyncStorage.setItem('raymedia_banner', JSON.stringify({ title: bannerTitle, sub: bannerSub }));
    Alert.alert("✅ Banner Updated!", "Go to HOME - you'll see it instantly");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>RAYMEDIA ADMIN</Text>

      {/* === BANNER MANAGER === */}
      <View style={styles.bannerBox}>
        <Text style={styles.bannerHeader}>💰 BANNER CONTROL (Money Slot)</Text>
        <Text style={styles.label}>Banner Title (Big Gold Text)</Text>
        <TextInput value={bannerTitle} onChangeText={setBannerTitle} style={styles.input} placeholder="e.g. Joe's Pizza - 2 Pizzas R120" placeholderTextColor="#666" />
        <Text style={styles.label}>Subtitle / Phone / Offer</Text>
        <TextInput value={bannerSub} onChangeText={setBannerSub} style={styles.input} placeholder="e.g. Call 071 123 4567 - Randpark Ridge" placeholderTextColor="#666" />
        <TouchableOpacity onPress={saveBanner} style={styles.goldBtn}>
          <Text style={styles.goldBtnText}>SAVE BANNER → SHOW ON HOME</Text>
        </TouchableOpacity>
        <Text style={{ color: "#666", fontSize: 10, marginTop: 6, textAlign: "center" }}>This updates HOME instantly. No rebuild needed.</Text>
      </View>

      {/* === ADD BUSINESS === */}
      <View style={styles.formBox}>
        <Text style={styles.formHeader}>Add New Business</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Business Name" placeholderTextColor="#666" />
        <View style={styles.pickerBox}>
          <Picker selectedValue={category} onValueChange={setCategory} style={{ color: "white" }}>
            {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="WhatsApp Number" placeholderTextColor="#666" keyboardType="phone-pad" />
        <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="Area e.g. Randburg" placeholderTextColor="#666" />
        <TouchableOpacity onPress={saveBusiness} style={styles.saveBtn}>
          <Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>+ ADD BUSINESS</Text>
        </TouchableOpacity>
      </View>

      {/* === LIST === */}
      <Text style={styles.listHeader}>Saved Businesses ({businesses.length})</Text>
      {businesses.map(b => (
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
  header: { color: "#d4b86a", fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 14 },
  bannerBox: { backgroundColor: "#111", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#d4b86a", marginBottom: 16 },
  bannerHeader: { color: "#d4b86a", fontWeight: "bold", marginBottom: 10 },
  label: { color: "#aaa", fontSize: 10, marginBottom: 4, marginTop: 6 },
  input: { backgroundColor: "#222", color: "white", padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: "#333" },
  goldBtn: { backgroundColor: "#d4b86a", padding: 12, borderRadius: 8, marginTop: 4 },
  goldBtnText: { textAlign: "center", fontWeight: "bold", color: "#000", fontSize: 12 },
  formBox: { backgroundColor: "#111", padding: 12, borderRadius: 12, marginBottom: 16 },
  formHeader: { color: "white", fontWeight: "bold", marginBottom: 10 },
  pickerBox: { backgroundColor: "#222", borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: "#333" },
  saveBtn: { backgroundColor: "#333", padding: 12, borderRadius: 8, marginTop: 4 },
  listHeader: { color: "white", fontWeight: "bold", marginBottom: 8 },
  bizCard: { backgroundColor: "#151515", padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: "#222" }
});
