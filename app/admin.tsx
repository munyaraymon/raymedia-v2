import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const CATS = ["Food", "Beauty", "Home", "Health", "Auto", "Fashion", "Other"];
type Slide = { id: number, image: string, big: string, small: string, link: string };

export default function Admin() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState("");
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, image: "", big: "Premium Banner - Your Business Here", small: "Advertise in Randburg from R250/month", link: "https://wa.me/27721234567" }
  ]);

  const [cat, setCat] = useState("Food");
  const [name, setName] = useState(""); 
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState(""); 
  const [price, setPrice] = useState(""); 
  const [phone, setPhone] = useState("");

  useEffect(() => {
    AsyncStorage.getItem('bannerSlides').then(v => { if(v) setSlides(JSON.parse(v)); });
  }, []);

  // 1. PASSWORD SCREEN - shows first
  if (!isLogged) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: '#FFD700', fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>RAYMEDIA ADMIN</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginBottom: 30, marginTop: 8 }}>Enter password to continue</Text>
        
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          placeholderTextColor="#888"
          style={{ backgroundColor: '#1a1a1a', color: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' }}
        />
        
        <TouchableOpacity 
          onPress={() => { if (pass === 'ray1234') setIsLogged(true); else alert('Wrong password'); }}
          style={{ backgroundColor: '#FFD700', padding: 16, borderRadius: 12, marginTop: 16 }}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 16 }}>UNLOCK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. AFTER PASSWORD - your admin
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black', padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity onPress={() => router.push('/')}><Text style={{ color: '#888' }}>← Home</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogged(false)}><Text style={{ color: 'red' }}>Lock</Text></TouchableOpacity>
      </View>

      <Text style={{ color: '#FFD700', fontSize: 22, fontWeight: 'bold', marginVertical: 16 }}>Banner Slideshow</Text>

      {slides.map((s, i) => (
        <View key={s.id} style={{ backgroundColor: '#111', borderRadius: 16, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#222' }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 6 }}>Slide {i+1}</Text>
          <TextInput value={s.image} onChangeText={v => setSlides(p => p.map(x => x.id===s.id?{...x,image:v}:x))} placeholder="Image Link - https://i.imgur.com/xxx.jpg" placeholderTextColor="#555" style={{ backgroundColor: '#222', color: 'white', padding: 12, borderRadius: 10, marginBottom: 8 }} />
          <TextInput value={s.big} onChangeText={v => setSlides(p => p.map(x => x.id===s.id?{...x,big:v}:x))} placeholder="Big Title" placeholderTextColor="#555" style={{ backgroundColor: '#222', color: 'white', padding: 12, borderRadius: 10, marginBottom: 8 }} />
          <TextInput value={s.small} onChangeText={v => setSlides(p => p.map(x => x.id===s.id?{...x,small:v}:x))} placeholder="Small Subtitle" placeholderTextColor="#555" style={{ backgroundColor: '#222', color: 'white', padding: 12, borderRadius: 10, marginBottom: 8 }} />
          <TextInput value={s.link} onChangeText={v => setSlides(p => p.map(x => x.id===s.id?{...x,link:v}:x))} placeholder="Link when tapped - wa.me/..." placeholderTextColor="#555" style={{ backgroundColor: '#222', color: 'white', padding: 12, borderRadius: 10 }} />
        </View>
      ))}

      <TouchableOpacity onPress={() => setSlides([...slides, { id: Date.now(), image: "", big: "", small: "", link: "" }])} style={{ backgroundColor: '#222', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', marginBottom: 10 }}>
        <Text style={{ color: '#FFD700', textAlign: 'center' }}>+ Add Slide</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={async () => { await AsyncStorage.setItem('bannerSlides', JSON.stringify(slides)); alert('Slideshow Saved!'); }} style={{ backgroundColor: '#FFD700', padding: 16, borderRadius: 12 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>SAVE BANNER SLIDESHOW → HOME</Text>
      </TouchableOpacity>

      <Text style={{ color: '#FFD700', fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>Add Business</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 }}>
        {CATS.map(c => (
          <TouchableOpacity key={c} onPress={() => setCat(c)} style={{ backgroundColor: cat===c ? '#FFD700' : '#222', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 }}>
            <Text style={{ color: cat===c ? 'black' : 'white' }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput value={name} onChangeText={setName} placeholder="Business Name *" placeholderTextColor="#888" style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12 }} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="WhatsApp / Phone *" placeholderTextColor="#888" style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12 }} />
      <TouchableOpacity onPress={async () => { const key = `businesses_${cat}`; const old = JSON.parse(await AsyncStorage.getItem(key) || '[]'); old.push({ name, phone, offer, price, area, id: Date.now() }); await AsyncStorage.setItem(key, JSON.stringify(old)); alert(`Saved to ${cat}`); }} style={{ backgroundColor: '#FFD700', padding: 18, borderRadius: 16 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>SAVE TO {cat.toUpperCase()}</Text>
      </TouchableOpacity>
      <View style={{ height: 60 }} />
    </ScrollView>
  );
                    }
