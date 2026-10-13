import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";
import { useRouter } from "expo-router";

const DATA_URL = "https://api.npoint.io/231ac0e4ddb44534ab1c";
const ADMIN_PASSWORD = "ray1234";

export default function Admin(){
  const router = useRouter();
  const [logged,setLogged]=useState(false);
  const [passInput,setPassInput]=useState("");
  const [slides,setSlides]=useState<any[]>([{image:"", big:"Premium Banner - Your Business Here", small:"rotating banner ad", link:"https://wa.me/27739422476"}]);
  const [showCat,setShowCat]=useState(false);
  const [category,setCategory]=useState("Beauty & Care");
  const [businessName,setBusinessName]=useState(""); const [area,setArea]=useState("Randburg"); const [offer,setOffer]=useState(""); const [price,setPrice]=useState(""); const [phone,setPhone]=useState("");
  const [allData,setAllData]=useState<any>({banners:[], businesses:[]});
  const cats = ["Beauty & Care","Auto & Repair","Health","Shopping & Retail","Education & Kids","Deals from Amazon","Food","Home","Other"];

  useEffect(()=>{ if(!logged) return; fetch(DATA_URL).then(r=>r.json()).then(d=>{ setAllData(d); if(d.banners?.length) setSlides(d.banners); }); },[logged]);

  if(!logged){
    return (
      <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', padding:20}}>
        <TouchableOpacity onPress={()=>router.push('/')} style={{position:'absolute', top:40, left:16, backgroundColor:'#1a1a1a', padding:10, borderRadius:8, borderWidth:1, borderColor:'#333'}}><Text style={{color:'#FFD700'}}>← Back to Home</Text></TouchableOpacity>
        <Text style={{color:'#FFD700', fontSize:26, fontWeight:'bold', textAlign:'center'}}>RAYMEDIA ADMIN</Text>
        {/* FIXED: Password hidden now */}
        <TextInput
          placeholder="Enter Admin Password"
          secureTextEntry={true}
          placeholderTextColor="#666"
          value={passInput}
          onChangeText={setPassInput}
          style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:12, padding:16, marginTop:20, marginBottom:12, borderWidth:1, borderColor:'#333'}}
        />
        <TouchableOpacity onPress={()=>{ if(passInput===ADMIN_PASSWORD) setLogged(true); else Alert.alert("Wrong"); }} style={{backgroundColor:'#FFD700', padding:16, borderRadius:12}}><Text style={{fontWeight:'bold', textAlign:'center'}}>LOGIN</Text></TouchableOpacity>
      </View>
    );
  }

  const saveBiz = async () => {
    if(!businessName ||!phone) return Alert.alert("Enter Name + Phone");
    const newBiz = {name:businessName, category, area, offer, price, whatsapp:phone};
    const newData = {...allData, businesses:[...(allData.businesses||[]), newBiz]};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert(`LIVE! ${businessName} for ALL`); setAllData(newData); setBusinessName(""); setOffer(""); setPrice(""); setPhone(""); }
  };
  const saveBanner = async () => {
    const clean = slides.map(s=>({image:s.image.trim().replace(/\s+/g,''), big:s.big, small:s.small, link:s.link.trim()}));
    const newData = {...allData, banners:clean};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok) Alert.alert("Banner LIVE!");
  };

  return (
    <ScrollView style={{flex:1, backgroundColor:'#000', padding:14}}>
      <TouchableOpacity onPress={()=>router.push('/')} style={{backgroundColor:'#1a1a1a', padding:12, borderRadius:10, alignSelf:'flex-start', marginBottom:12, borderWidth:1, borderColor:'#C9A86A'}}>
        <Text style={{color:'#FFD700', fontWeight:'bold'}}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={{color:'#FFD700', fontWeight:'bold', fontSize:16}}>Add Business + Category (LIVE {allData.businesses?.length||0})</Text>
      <TouchableOpacity onPress={()=>setShowCat(true)} style={{backgroundColor:'#1a1a1a', borderRadius:10, padding:14, marginTop:10, flexDirection:'row', justifyContent:'space-between', borderWidth:1, borderColor:'#333'}}><Text style={{color:'#fff'}}>{category}</Text><Text style={{color:'#FFD700'}}>▼</Text></TouchableOpacity>
      <Modal visible={showCat} transparent animationType="fade"><View style={{flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#111', borderRadius:14, padding:10, borderWidth:1, borderColor:'#333'}}>{cats.map(c=><TouchableOpacity key={c} onPress={()=>{setCategory(c); setShowCat(false)}} style={{padding:14, borderBottomWidth:1, borderColor:'#222'}}><Text style={{color:'#fff'}}>{c} {category===c?'✓':''}</Text></TouchableOpacity>)}<TouchableOpacity onPress={()=>setShowCat(false)} style={{padding:14, alignItems:'center'}}><Text style={{color:'red'}}>Close</Text></TouchableOpacity></View></View></Modal>

      <TextInput placeholder="Business Name *" value={businessName} onChangeText={setBusinessName} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:10, padding:14, marginTop:10, borderWidth:1, borderColor:'#333'}}/>
      <TextInput placeholder="Area" value={area} onChangeText={setArea} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:10, padding:14, marginTop:8, borderWidth:1, borderColor:'#333'}}/>
      <TextInput placeholder="Offer" value={offer} onChangeText={setOffer} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:10, padding:14, marginTop:8, borderWidth:1, borderColor:'#333'}}/>
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:10, padding:14, marginTop:8, borderWidth:1, borderColor:'#333'}}/>
      <TextInput placeholder="WhatsApp Phone *" value={phone} onChangeText={setPhone} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:10, padding:14, marginTop:8, borderWidth:1, borderColor:'#333'}}/>
      <TouchableOpacity onPress={saveBiz} style={{backgroundColor:'#FFD700', borderRadius:10, padding:16, marginTop:12, alignItems:'center'}}><Text style={{fontWeight:'bold'}}>SAVE TO {category.toUpperCase()} - LIVE</Text></TouchableOpacity>

      <View style={{marginTop:24, borderTopWidth:1, borderColor:'#222', paddingTop:14}}>
        <Text style={{color:'#FFD700', fontWeight:'bold'}}>Banner (Bottom Ad)</Text>
        {slides.map((s,i)=><View key={i} style={{backgroundColor:'#111', borderRadius:10, padding:10, marginTop:8, borderWidth:1, borderColor:'#222'}}><TextInput placeholder="Image Link" value={s.image} onChangeText={t=>{let ns=[...slides]; ns[i].image=t; setSlides(ns)}} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:8, padding:10, marginBottom:6}}/><TextInput placeholder="Big Title" value={s.big} onChangeText={t=>{let ns=[...slides]; ns[i].big=t; setSlides(ns)}} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:8, padding:10, marginBottom:6}}/><TextInput placeholder="Small Subtitle" value={s.small} onChangeText={t=>{let ns=[...slides]; ns[i].small=t; setSlides(ns)}} placeholderTextColor="#666" style={{backgroundColor:'#1a1a1a', color:'#fff', borderRadius:8, padding:10}}/></View>)}
        <TouchableOpacity onPress={saveBanner} style={{backgroundColor:'#FFD700', borderRadius:10, padding:16, alignItems:'center', marginTop:12, marginBottom:60}}><Text style={{fontWeight:'bold'}}>SAVE BANNER → LIVE FOR ALL</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
        }
