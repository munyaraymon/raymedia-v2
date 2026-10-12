import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";

export default function Admin() {
  const [slides, setSlides] = useState([{image:"", bigTitle:"", smallSubtitle:"", link:""}]);
  const [category, setCategory] = useState("Food");
  const [bizName, setBizName] = useState("");
  const [phone, setPhone] = useState("");
  const [allData, setAllData] = useState({banners:[], businesses:[]});

  useEffect(()=>{
    fetch(DATA_URL).then(r=>r.json()).then(d=>{
      setAllData(d);
      if(d.banners?.length) setSlides(d.banners.map((b:any)=>({image:b.image, bigTitle:b.big||"", smallSubtitle:b.small||"", link:b.link})));
    });
  },[]);

  const saveBanner = async () => {
    const newBanners = slides.map(s=>({image:s.image.trim(), big:s.bigTitle, small:s.smallSubtitle, link:s.link.trim()}));
    const newData = {...allData, banners:newBanners};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert("Banner LIVE for all phones!"); setAllData(newData); }
    else Alert.alert("Failed - check internet");
  };

  const saveBusiness = async () => {
    if(!bizName ||!phone) return Alert.alert("Enter Business Name and WhatsApp");
    const newBiz = {name:bizName, category, whatsapp:phone, promo:"", discount:""};
    const newData = {...allData, businesses:[...(allData.businesses||[]), newBiz]};
    const res = await fetch(DATA_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData)});
    if(res.ok){ Alert.alert(`${bizName} LIVE in ${category} for all phones!`); setAllData(newData); setBizName(""); setPhone(""); }
    else Alert.alert("Failed");
  };

  const cats = ["Food","Beauty","Home","Health","Auto","Fashion","Other"];

  return (
    <ScrollView style={{flex:1, backgroundColor:'#000', padding:16}}>
      {slides.map((s,i)=>(
        <View key={i} style={{backgroundColor:'#1a1a1a', borderRadius:16, padding:12, marginBottom:12}}>
          <TextInput placeholder="Image Link - https://i.imgur.com/xxx.jpg" placeholderTextColor="#666" value={s.image} onChangeText={t=>{let ns=[...slides]; ns[i].image=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:12, padding:14, marginBottom:10}} />
          <TextInput placeholder="Big Title" placeholderTextColor="#666" value={s.bigTitle} onChangeText={t=>{let ns=[...slides]; ns[i].bigTitle=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:12, padding:14, marginBottom:10}} />
          <TextInput placeholder="Small Subtitle" placeholderTextColor="#666" value={s.smallSubtitle} onChangeText={t=>{let ns=[...slides]; ns[i].smallSubtitle=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:12, padding:14, marginBottom:10}} />
          <TextInput placeholder="Link when tapped - wa.me/..." placeholderTextColor="#666" value={s.link} onChangeText={t=>{let ns=[...slides]; ns[i].link=t; setSlides(ns)}} style={{backgroundColor:'#2a2a2a', color:'#fff', borderRadius:12, padding:14}} />
        </View>
      ))}
      <TouchableOpacity onPress={()=>setSlides([...slides,{image:"", bigTitle:"", smallSubtitle:"", link:""}])} style={{borderWidth:1, borderColor:'#FFD700', borderRadius:12, padding:16, alignItems:'center', marginBottom:12}}><Text style={{color:'#FFD700'}}>+ Add Slide</Text></TouchableOpacity>
      <TouchableOpacity onPress={saveBanner} style={{backgroundColor:'#FFD700', borderRadius:12, padding:18, alignItems:'center', marginBottom:24}}><Text style={{fontWeight:'bold', color:'#000'}}>SAVE BANNER SLIDESHOW → HOME</Text></TouchableOpacity>

      <Text style={{color:'#FFD700', fontSize:22, fontWeight:'bold', marginBottom:12}}>Add Business</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12}}>
        {cats.map(c=>(
          <TouchableOpacity key={c} onPress={()=>setCategory(c)} style={{backgroundColor: category===c? '#FFD700' : '#2a2a2a', paddingHorizontal:18, paddingVertical:10, borderRadius:20}}><Text style={{color: category===c? '#000':'#fff'}}>{c}</Text></TouchableOpacity>
        ))}
      </View>
      <TextInput placeholder="Business Name *" placeholderTextColor="#999" value={bizName} onChangeText={setBizName} style={{backgroundColor:'#fff', borderRadius:20, padding:18, marginBottom:12}} />
      <TextInput placeholder="WhatsApp / Phone *" placeholderTextColor="#999" value={phone} onChangeText={setPhone} style={{backgroundColor:'#fff', borderRadius:20, padding:18, marginBottom:12}} />
      <TouchableOpacity onPress={saveBusiness} style={{backgroundColor:'#FFD700', borderRadius:20, padding:18, alignItems:'center', marginBottom:100}}><Text style={{fontWeight:'bold', color:'#000', fontSize:16}}>SAVE TO {category.toUpperCase()}</Text></TouchableOpacity>
    </ScrollView>
  );
                                       }
