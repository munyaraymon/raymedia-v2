import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';

const MOCK_LEADS = [
  { id: 1, name: "Thabo Nkosi", service: "Plumber needed", area: "Randburg", budget: "R2,500", phone: "082****123", locked: false },
  { id: 2, name: "Sarah M.", service: "Electrician", area: "Sandton", budget: "R1,800", phone: "071****456", locked: false },
  { id: 3, name: "James K", service: "Builder", area: "Fourways", budget: "R15k", phone: "083****789", locked: false },
  { id: 4, name: "Lerato P", service: "Painter", area: "Roodepoort", budget: "R4k", phone: "LOCKED", locked: true },
  { id: 5, name: "David L", service: "Tiler", area: "Randburg", budget: "R6k", phone: "LOCKED", locked: true },
];

export default function Index() {
  const [viewed, setViewed] = useState(0);
  const freeLimit = 3;
  const handleContact = (lead:any) => {
    if (lead.locked || viewed >= freeLimit) {
      Alert.alert("Limit Reached", "3 FREE used. Pay R49 to unlock WhatsApp contacts.", [
        { text: "WhatsApp Pay", onPress: () => Linking.openURL("https://wa.me/27631234567?text=Paid R49") },
        { text: "Cancel", style: "cancel" }
      ]); return;
    }
    setViewed(v=>v+1);
    Alert.alert("Lead Unlocked", `${lead.name} - ${lead.phone}`);
  };
  return (
    <ScrollView style={{ flex:1, backgroundColor: "#0a0a0a", padding: 20, paddingTop: 60 }}>
      <Text style={{ color: "#FFD700", fontSize: 32, fontWeight: "bold" }}>Raymedia</Text>
      <Text style={{ color: "white", marginBottom: 10 }}>Pay Per Lead SA • {freeLimit - viewed} FREE left</Text>
      {MOCK_LEADS.map(lead => (
        <View key={lead.id} style={{ backgroundColor: "#1e1e1e", padding: 15, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{lead.service} - {lead.area}</Text>
          <Text style={{ color: "#aaa" }}>{lead.name} • {lead.budget}</Text>
          <TouchableOpacity onPress={() => handleContact(lead)} style={{ backgroundColor: lead.locked ? "#333" : "#FFD700", padding: 12, borderRadius: 8, marginTop: 8, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{lead.locked ? "🔒 Unlock R49" : "📞 Get Contact"}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
          }
