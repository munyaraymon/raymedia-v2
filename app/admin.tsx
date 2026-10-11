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
    const p = await AsyncStorage.getItem('real_promos');
    const ads = await AsyncStorage.getItem('sponsored_ads');
    if (p) setPromos(JSON.parse(p));
    if (ads) setSponsors(JSON.parse(ads));
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  useEffect(() => {
    if (sponsors.length > 1) {
      const interval = setInterval(() => {
        setCurrentSponsorIndex((prev) => (prev + 1) % sponsors.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sponsors]);

  const track = async (id, type) => {
    const st = await AsyncStorage.getItem('ray_stats');
    let stats = st? JSON.parse(st) : {};
    if (!stats[id]) stats[id] = { views: 0, calls: 0, whatsapps: 0 };
    if (type === 'view') stats[id].views++;
    if (type === 'call') stats[id].calls++;
    if (type === 'wa') stats[id].whatsapps++;
    await AsyncStorage.setItem('ray_stats', JSON.stringify(stats));
  };

  useEffect(() => { promos.forEach(p => track(p.id, 'view')); }, [promos]);

  const filtered = promos.filter(p => {
    const matchSearch = p.businessName.toLowerCase().includes(search.toLowerCase()) || p.offer.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || (p.service && p.service.toLowerCase().includes(selectedCat.toLowerCase()));
    return matchSearch && matchCat;
