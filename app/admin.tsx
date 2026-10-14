import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const DATA_URL = "https://api.npoint.io/231ac0e4ddb44534ab1c";

export default function Admin(){
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [pass, setPass] = useState("");
  const [allData, setAllData] = useState<any>({banners:[], businesses:[]});
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Beauty & Care");
  const [area, setArea] = useState("Randburg");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [slides, setSlides] = useState([{image:"", big:"Premium Banner - Your Business Here", small:"rotating banner ad", link:"https://wa.me/27739422476"}]);

  useEffect(()=>{
    if(!logged) return;
    fetch(DATA_URL + "?t=" + Date.now(), { cache: 'no-store' } as any)
     .then(r=>r.json()).then(d=>{
        console.log("ADMIN LOAD", d);
        setAllData(d);
        if(d.banners?.length) setSlides(d.banners);
      });
  },[logged]);

  const login = ()=>{
    if(pass==="Ray123"){ setLogged(true); }
    else Alert.alert("Wrong password");
  };

  const saveBiz = async () => {
    if(!businessName ||!phone) return Alert.alert("Enter Business Name + WhatsApp");
    const newBiz = {name:businessName, category, area, offer, price, whatsapp:phone};
    const newData = {banners: allData.banners?.length? allData.banners : slides, businesses:[...(allData.businesses||[]), newBiz]};

    try{
      const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
      const txt = await res.text();
      console.log("SAVE", res.status, txt.slice(0,300));
      if(res.ok){
        Alert.alert(`✅ SAVED! ${businessName} is LIVE in ${category}`);
        setAllData(newData);
        setBusinessName(""); setOffer(""); setPrice(""); setPhone("");
      } else {
        Alert.alert(`❌ FAILED ${res.status}: Unlock failed or npoint blocked. ${txt.slice(0,120)}`);
      }
    }catch(e:any){ Alert.alert("Network error " + e.message); }
  };

  const saveBanner = async () => {
    const clean = slides.map(s=>({image:s.image.trim(), big:s.big, small:s.small, link:s.link.trim()}));
    const newData = {banners:clean, businesses: allData.businesses||[]};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok) Alert.alert("✅ Banner LIVE!");
    else Alert.alert("❌ Banner FAILED " + res.status);
  };

  if(!logged) return (
    <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', padding:20}}>
      <Text style={{color:'#FFD700', fontSize:22, fontWeight:'bold', marginBottom:12, textAlign:'center'}}>RAYMEDIA ADMIN</Text>
      <TextInput value={pass} onChangeText={setPass} secureTextEntry placeholder="Enter Admin Password" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:14, borderRadius:12, marginBottom:12}}/>
      <TouchableOpacity onPress={login} style={{backgroundColor:'#FFD700', padding:14, borderRadius:12, alignItems:'center'}}><Text style={{fontWeight:'bold'}}>LOGIN</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>router.back()} style={{marginTop:20, alignItems:'center'}}><Text style={{color:'#666'}}>← Back to Home</Text></TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={{flex:1, backgroundColor:'#000'}} contentContainerStyle={{padding:16}}>
      <TouchableOpacity onPress={()=>router.back()}><Text style={{color:'#FFD700', marginBottom:12}}>← Back to Home</Text></TouchableOpacity>
      <Text style={{color:'#fff', fontWeight:'bold', fontSize:18, marginBottom:10}}>Add Business — LIVE bin: 231ac0e4</Text>
      <Text style={{color:'#666', fontSize:11, marginBottom:10}}>Current LIVE count: {allData.businesses?.length || 0} businesses</Text>

      <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Business Name" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:8}}/>
      <TextInput value={category} onChangeText={setCategory} placeholder="Category e.g. Beauty & Care" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:8}}/>
      <TextInput value={area} onChangeText={setArea} placeholder="Area e.g. Randburg" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:8}}/>
      <TextInput value={offer} onChangeText={setOffer} placeholder="Offer e.g. 20% off" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:8}}/>
      <TextInput value={price} onChangeText={setPrice} placeholder="Price e.g. R150" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:8}}/>
      <TextInput value={phone} onChangeText={setPhone} placeholder="WhatsApp e.g. 27739422476" placeholderTextColor="#666" style={{backgroundColor:'#111', color:'#fff', padding:12, borderRadius:10, marginBottom:12}}/>

      <TouchableOpacity onPress={saveBiz} style={{backgroundColor:'#FFD700', padding:14, borderRadius:12, alignItems:'center', marginBottom:30}}><Text style={{fontWeight:'bold'}}>SAVE BUSINESS LIVE ✅</Text></TouchableOpacity>

      <Text style={{color:'#fff', fontWeight:'bold', marginBottom:8}}>Banner</Text>
      {slides.map((s,i)=>(
        <View key={i} style={{marginBottom:10, backgroundColor:'#111', padding:10, borderRadius:10}}>
          <TextInput value={s.big} onChangeText={t=>{ const ns=[...slides]; ns[i].big=t; setSlides(ns); }} placeholder="Big text" placeholderTextColor="#666" style={{color:'#fff', marginBottom:6}}/>
          <TextInput value={s.link} onChangeText={t=>{ const ns=[...slides]; ns[i].link=t; setSlides(ns); }} placeholder="Link" placeholderTextColor="#666" style={{color:'#fff'}}/>
        </View>
      ))}
      <TouchableOpacity onPress={saveBanner} style={{backgroundColor:'#222', padding:12, borderRadius:10, alignItems:'center'}}><Text style={{color:'#fff'}}>SAVE BANNER</Text></TouchableOpacity>
    </ScrollView>
  );
}
