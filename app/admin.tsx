import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";
const ADMIN_PASSWORD = "ray1234"; // YOUR PASSWORD - DO NOT LOSE

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [slides, setSlides] = useState([{image:"", bigTitle:"Raymedia", smallSubtitle:"Advertise in Randburg", link:"https://wa.me/27739422476"}]);
  const [category, setCategory] = useState("Food");
  const [businessName, setBusinessName] = useState("");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [allData, setAllData] = useState<any>({banners:[], businesses:[]});

  useEffect(()=>{
    if(!logged) return;
    fetch(DATA_URL).then(r=>r.json()).then(d=>{
      setAllData(d);
      if(d.banners?.length) setSlides(d.banners.map((b:any)=>({image:b.image, bigTitle:b.big, smallSubtitle:b.small, link:b.link})));
    });
  },[logged]);

  if(!logged){
    return (
      <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', padding:20}}>
        <Text style={{color:'#FFD700', fontSize:28, fontWeight:'bold', marginBottom:10, textAlign:'center'}}>Raymedia Admin</Text>
        <Text style={{color:'#888', textAlign:'center', marginBottom:20}}>Enter password to continue</Text>
        <TextInput placeholder="Password" secureTextEntry value={passInput} onChangeText={setPassInput} style={{backgroundColor:'#fff', borderRadius:16, padding:18, marginBottom:16}} />
        <TouchableOpacity onPress={()=>{ if(passInput===ADMIN_PASSWORD) setLogged(true); else Alert.alert("Wrong password - use ray1234"); }} style={{backgroundColor:'#FFD700', padding:18, borderRadius:16}}>
          <Text style={{fontWeight:'bold', textAlign:'center'}}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saveBanner = async () => {
    const newBanners = slides.map(s=>({image:s.image.trim().replace(/\s+/g,''), big:s.bigTitle, small:s.smallSubtitle, link:s.link.trim()}));
    const newData = {...allData, banners:newBanners};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert("Banner LIVE for ALL phones!"); setAllData(newData); } else Alert.alert("Save failed");
  };

  const saveBusiness = async () => {
    if(!businessName ||!phone) return Alert.alert("Enter Business Name + WhatsApp");
    const newBiz = {name:businessName, area, offer, price, category, whatsapp:phone};
    const newData = {...allData, businesses:[...(allData.businesses||[]), newBiz]};
    const res = await fetch(DATA_URL
