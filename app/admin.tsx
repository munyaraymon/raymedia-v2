import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";

const DATA_URL = "https://api.npoint.io/231ac0e4ddb44534ab1c";
const ADMIN_PASSWORD = "ray1234";

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [slides, setSlides] = useState<any[]>([{image:"", big:"Raymedia", small:"Advertise in Randburg from R250/month", link:"https://wa.me/27739422476"}]);
  const [showCat, setShowCat] = useState(false);
  const [category, setCategory] = useState("Food");
  const [businessName, setBusinessName] = useState(""); const [area, setArea] = useState("Randburg"); const [offer, setOffer] = useState(""); const [price, setPrice] = useState(""); const [phone, setPhone] = useState("");
  const [allData, setAllData] = useState<any>({banners:[], businesses:[]});
  const cats = ["Food","Beauty","Home","Health","Auto","Fashion","Other"];

  useEffect(()=>{ if(!logged) return; fetch(DATA_URL).then(r=>r.json()).then(d=>{ setAllData(d); if(d.banners?.length) setSlides(d.banners); }); },[logged]);

  if(!logged){
    return (
      <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', padding:20}}>
        <Text style={{color:'#FFD700', fontSize:28, fontWeight:'bold', textAlign:'center'}}>Raymedia Admin</Text>
        <Text style={{color:'#888', textAlign:'center', marginTop:6}}>LIVE for ALL: {DATA_URL.slice(-6)}</Text>
        <TextInput placeholder="Password ray1234" secureTextEntry value={passInput} onChangeText={setPassInput} style={{backgroundColor:'#fff', borderRadius:16, padding:18, marginTop:20, marginBottom:16}}/>
        <TouchableOpacity onPress={()=>{ if(passInput===ADMIN_PASSWORD) setLogged(true); else Alert.alert("Wrong password"); }} style={{backgroundColor:'#FFD700', padding:18, borderRadius:16}}><Text style={{fontWeight:'bold', textAlign:'center'}}>LOGIN - MAKE LIVE</Text></TouchableOpacity>
      </View>
    );
  }

  const saveBiz = async () => {
    if(!businessName ||!phone) return Alert.alert("Enter Business Name + Phone");
    const newBiz = {name:businessName, category, area, offer, price, whatsapp:phone};
    const newData = {...allData, businesses:[...(allData.businesses||[]), newBiz]};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert(`LIVE! ${businessName} now visible for ALL on Vercel & App`); setAllData(newData); setBusinessName(""); setOffer(""); setPrice(""); setPhone(""); } else Alert.alert("Save failed");
  };

  const saveBanner = async () => {
    const clean = slides.map(s=>({image:s.image.trim().replace(/\s+/g,''), big:s.big, small:s.small, link:s.link.trim()}));
    const newData = {...allData, banners:clean};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert("Banner LIVE for ALL!"); setAllData(newData); } else Alert.alert("Failed");
  };

  return (
    <ScrollView style={{flex:1, backgroundColor:'#000', padding:16}}>
      <Text style={{color:'#FFD700', fontSize:22, fontWeight:'bold'}}>Add Business + Category</Text>
      <Text style={{color:'#0f0', fontSize:12, marginTop:4}}>● LIVE MODE - All phones will see changes</Text>
      <Text style={{color:'#888', marginTop:14, marginBottom:6}}>SELECT CATEGORY *</Text>
      <TouchableOpacity onPress={()=>setShowCat(true)} style={{backgroundColor:'#fff', borderRadius:12, padding:16, flexDirection:'row', justifyContent:'space-between'}}><Text>{category}</Text><Text>▼</Text></TouchableOpacity>
      <Modal visible={showCat} transparent animationType="fade"><View style={{flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#fff', borderRadius:16, padding:10}}>{cats.map(c=><TouchableOpacity key={c} onPress={()=>{setCategory(c); setShowCat(false)}} style={{padding:16, borderBottomWidth:1, borderColor:'#eee'}}><Text>{c} {category===c?'✓':''}</Text></TouchableOpacity>)}<TouchableOpacity onPress={()=>setShowCat(false)} style={{padding:16, alignItems:'center'}}><Text style={{color:'red'}}>Close</Text></TouchableOpacity></View></View></Modal>
      <TextInput placeholder="Business Name *" value={businessName} onChangeText={setBusinessName} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:12}}/>
      <TextInput placeholder="Area - e.g. Randburg" value={area} onChangeText={setArea} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:12}}/>
      <TextInput placeholder="Offer - e.g. 20% off plumbing" value={offer} onChangeText={setOffer} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:12}}/>
      <TextInput placeholder="Price - e.g. R500" value={price} onChangeText={setPrice} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:12}}/>
      <TextInput placeholder="WhatsApp / Phone *" value={phone} onChangeText={setPhone} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:12}}/>
      <TouchableOpacity onPress={saveBiz} style={{backgroundColor:'#FFD700', borderRadius:12, padding:18, marginTop:16, alignItems:'center'}}><Text style={{fontWeight:'bold'}}>SAVE TO {category.toUpperCase()} - MAKE LIVE FOR ALL</Text></TouchableOpacity>
      <Text style={{color:'#FFD700', marginTop:16}}>Live ({allData.businesses?.length||0}) businesses on internet</Text>
      <View style={{marginTop:30, borderTopWidth:1, borderColor:'#222', paddingTop:20}}>
        <Text style={{color:'#FFD700', fontWeight:'bold', marginBottom:10}}>Banner Slideshow - LIVE</Text>
        {slides.map((s,i)=><View key={i} style={{backgroundColor:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}><Text style={{color:'#FFD700', fontSize:12, marginBottom:6}}>Slide {i+1}</Text><TextInput placeholder="Image Link https://i.postimg.cc/..." value={s.image} onChangeText={t=>{let ns=[...slides]; ns[i].image=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:10, padding:12, marginBottom:8}}/><TextInput placeholder="Big Title" value={s.big} onChangeText={t=>{let ns=[...slides]; ns[i].big=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:10, padding:12, marginBottom:8}}/><TextInput placeholder="Small Subtitle" value={s.small} onChangeText={t=>{let ns=[...slides]; ns[i].small=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:10, padding:12, marginBottom:8}}/><TextInput placeholder="Link https://wa.me/..." value={s.link} onChangeText={t=>{let ns=[...slides]; ns[i].link=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:10, padding:12}}/></View>)}
        <TouchableOpacity onPress={()=>setSlides([...slides,{image:"", big:"", small:"", link:""}])} style={{borderWidth:1, borderColor:'#FFD700', borderRadius:12, padding:14, alignItems:'center', marginBottom:12}}><Text style={{color:'#FFD700'}}>+ Add Slide</Text></TouchableOpacity>
        <TouchableOpacity onPress={saveBanner} style={{backgroundColor:'#FFD700', borderRadius:12, padding:18, alignItems:'center', marginBottom:100}}><Text style={{fontWeight:'bold'}}>SAVE BANNER SLIDESHOW → LIVE FOR ALL</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
