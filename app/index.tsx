import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

// YOUR OLD FAKE PROMOS - KEEP AS BACKUP
const MOCK_PROMOS = [
  { id: 1, businessName: "Joe's Plumbing", service: "Plumbing", area: "Randburg", offer: "20% OFF First Call", price: "R350", phone: "0820000001" },
  { id: 2, businessName: "Sarah's Electrical", service: "Electrical", area: "Fourways", offer: "Free Call Out", price: "R0", phone: "0820000002" },
  { id: 3, businessName: "James K Builders", service: "Building", area: "Sandton", offer: "10% OFF Renovation", price: "R5000", phone: "0820000003" },
];

export default function Index() {
  const [realPromos, setRealPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const saved = await AsyncStorage.getItem('real_promos');
      if (saved) {
        setRealPromos(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Error loading promos", e);
    }
    setLoading(false);
  };

  // THIS IS THE MAGIC: If you added real promos in Admin, show those. If not, show fake ones.
  const promosToShow = realPromos.length > 0 ? realPromos : MOCK_PROMOS;
  const isShowingReal = realPromos.length > 0;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsapp = (phone: string) => {
    Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading promos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <ScrollView style={{ flex: 1, padding: 16, paddingTop: 60 }}>
        
        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>Raymedia</Text>
            <Text style={{ color: "white", fontSize: 12 }}>
              {isShowingReal ? `🔥 ${realPromos.length} LIVE Business Deals` : "Example Promos (Add real in Admin)"}
            </Text>
          </View>
          {/* SECRET ADMIN BUTTON - ONLY YOU KNOW THIS */}
          <Link href="/admin" asChild>
            <TouchableOpacity style={{ backgroundColor: "#1a1a1a", padding: 10, borderRadius: 20 }}>
              <Text style={{ color: "#FFD700", fontSize: 10 }}>ADMIN</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* PROMO LIST */}
        <View style={{ marginTop: 20 }}>
          {promosToShow.map((promo) => (
            <View key={promo.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#FFD700" }}>
              <Text style={{ color: "#FFD700", fontSize: 16, fontWeight: "bold" }}>{promo.businessName}</Text>
              <Text style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>{promo.service} • {promo.area}</Text>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 8 }}>{promo.offer}</Text>
              <Text style={{ color: "#FFD700", fontSize: 18, fontWeight: "bold", marginTop: 4 }}>{promo.price}</Text>
              
              <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
                <TouchableOpacity onPress={() => handleCall(promo.phone)} style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, flex: 1 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: "black", fontSize: 12 }}>CALL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleWhatsapp(promo.phone)} style={{ backgroundColor: "white", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, flex: 1 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: "black", fontSize: 12 }}>WHATSAPP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
      }
