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
    { id: 1, image: "", big: "Premium Banner - Your Business Here", small: "Advertise in Randburg from R250/month", link: "" }
  ]);

  const [cat, setCat] = useState("Food");
  const [name, setName] = useState(""); const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState(""); const [price, setPrice] = useState(""); const [phone, setPhone] = useState("");

  useEffect(() => {
    AsyncStorage.getItem('bannerSlides').then(v => { if(v) setSlides(JSON.parse(v)); });
  }, []);

  const saveSlides = async () => {
    await AsyncStorage.setItem('bannerSlides', JSON.stringify(slides));
    alert(`${slides.length} Slides Saved! Home will now slideshow`);
  };

  const updateSlide = (id: number, field: keyof Slide, value: string) => {
    setSlides(prev => prev.map(s => s.id===id? {...s, [field]: value} : s));
  };

  if (!isLogged) {
    return (
      <View style={{ flex:1, backgroundColor:'black', justifyContent:'center', padding:20 }}>
        <Text style={{ color:'#FFD700', fontSize:22, textAlign:'center', marginBottom:20, fontWeight:'bold' }}>RAYMEDIA ADMIN</Text>
        <TextInput placeholder="Password" secureTextEntry value={pass} onChangeText={setPass} placeholderTextColor="#888" style={{ backgroundColor:'#222', color:'white', padding:15, borderRadius:12 }} />
        <TouchableOpacity onPress={()=> pass==='ray1234'? setIsLogged(true) : alert('Wrong')} style={{ backgroundColor:'#FFD700', padding:15, borderRadius:12, marginTop:15 }}>
          <Text style={{ textAlign:'center', fontWeight:'bold' }}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'black', padding:16 }}>
      <TouchableOpacity onPress={()=>router.push('/')}><Text style={{ color:'#888' }}>← Back to App</Text></TouchableOpacity>
      <Text style={{ color:'#FFD700', fontSize:24, fontWeight:'bold', marginVertical:16 }}>Banner Slideshow Control</Text>

      {slides.map((s, index) => (
        <View key={s.id} style={{ borderWidth:1, borderColor:'#333', borderRadius:16, padding:12, marginBottom:16, backgroundColor:'#111' }}>
          <Text style={{ color:'#FFD700', fontWeight:'bold' }}>Slide {index+1}</Text>

          <Text style={{ color:'#888', fontSize:12, marginTop:8 }}>IMAGE LINK * paste e.g. https://i.imgur.com/xxx.jpg</Text>
          <TextInput value={s.image} onChangeText={v=>updateSlide(s.id,'image',v)} placeholder="https://..." placeholderTextColor="#555" style={{ backgroundColor:'#222', color:'white', padding:12, borderRadius:10, marginBottom:8 }} />

          <Text style={{ color:'#888', fontSize:12 }}>Big Title</Text>
          <TextInput value={s.big} onChangeText={v=>updateSlide(s.id,'big',v)} style={{ backgroundColor:'#222', color:'white', padding:12, borderRadius:10, marginBottom:8 }} />

          <Text style={{ color:'#888', fontSize:12 }}>Small Title / Price</Text>
          <TextInput value={s.small} onChangeText={v=>updateSlide(s.id,'small',v)} style={{ backgroundColor:'#222', color:'white', padding:12, borderRadius:10, marginBottom:8 }} />

          <Text style={{ color:'#888', fontSize:12 }}>Link when tapped (WhatsApp / Website)</Text>
          <TextInput value={s.link} onChangeText={v=>updateSlide(s.id,'link',v)} placeholder="https://wa.me/27..." placeholderTextColor="#555" style={{ backgroundColor:'#222', color:'white', padding:12, borderRadius:10 }} />

          {slides.length>1 && <TouchableOpacity onPress={()=>setSlides(prev=>prev.filter(x=>x.id!==s.id))}><Text style={{ color:'red', marginTop:8, textAlign:'right' }}>Remove Slide</Text></TouchableOpacity>}
        </View>
      ))}

      <View style={{ flexDirection:'row', gap:10 }}>
        <TouchableOpacity onPress={()=>setSlides([...slides, { id: Date.now(), image:"", big:"", small:"", link:"" }])} style={{ flex:1, backgroundColor:'#222', padding:14, borderRadius:12, borderWidth:1, borderColor:'#FFD700' }}><Text style={{ color:'#FFD700', textAlign:'center' }}>+ Add Slide</Text></TouchableOpacity>
        <TouchableOpacity onPress={saveSlides} style={{ flex:2, backgroundColor:'#FFD700', padding:14, borderRadius:12 }}><Text style={{ textAlign:'center', fontWeight:'bold' }}>SAVE ALL SLIDES → HOME</Text></TouchableOpacity>
      </View>

      {/* YOUR BUSINESS PART - SAME AS YOUR SCREENSHOT */}
      <Text style={{ color:'#FFD700', fontSize:20, fontWeight:'bold', marginTop:30 }}>Add Business + Category</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginVertical:12 }}>
        {CATS.map(c => (<TouchableOpacity key={c} onPress={()=>setCat(c)} style={{ backgroundColor: cat===c? '#FFD700' : '#222', paddingVertical:10, paddingHorizontal:18, borderRadius:20 }}><Text style={{ color: cat===c? 'black' : 'white' }}>{c}</Text></TouchableOpacity>))}
      </View>
      <TextInput value={name} onChangeText={setName} placeholder="Business Name *" placeholderTextColor="#888" style={{ backgroundColor:'white', padding:16, borderRadius:16, marginBottom:12 }} />
      <TextInput value={area} onChangeText={setArea} style={{ backgroundColor:'white', padding:16, borderRadius:16, marginBottom:12 }} />
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer - e.g. 20% off plumbing" placeholderTextColor="#888" style={{ backgroundColor:'white', padding:16, borderRadius:16, marginBottom:12 }} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price - e.g. R500" placeholderTextColor="#888" style={{ backgroundColor:'white', padding:16, borderRadius:16, marginBottom:12 }} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="WhatsApp / Phone *" placeholderTextColor="#888" style={{ backgroundColor:'white', padding:16, borderRadius:16, marginBottom:12 }} />
      <TouchableOpacity style={{ backgroundColor:'#FFD700', padding:18, borderRadius:16 }}><Text style={{ textAlign:'center', fontWeight:'bold' }}>SAVE TO {cat.toUpperCase()} - MAKE LIVE</Text></TouchableOpacity>
      <View style={{ height:60 }} />
    </ScrollView>
  );
        }
