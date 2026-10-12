import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";

export default function Admin() {
  const [banners, setBanners] = useState([{image:"", big:"", small:"", link:""}]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetch(DATA_URL).then(r=>r.json()).then(d=>{
      setBanners(d.banners?.length? d.banners : [{image:"", big:"", small:"", link:""}]);
      setBusinesses(d.businesses || []);
    });
  }, []);

  const saveToInternet = async () => {
    const cleanBanners = banners.map(b=>({
     ...b,
      image: b.image.replace(/\s/g,'').replace('\n',''),
      link: b.link.replace(/\s/g,'')
    }));
    const res = await fetch(DATA_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({banners: cleanBanners, businesses})
    });
    if(res.ok) Alert.alert("Success! Live for all phones in Randburg");
    else Alert.alert("Failed to save");
  };

  return (
    <ScrollView style={{flex:1, padding:16, backgroundColor:'#fff'}}>
      <Text style={{fontSize:20, fontWeight:'bold', marginBottom:12}}>Banner Admin - Client Pays R250</Text>
      {banners.map((b,i)=>(
        <View key={i} style={{borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:12, marginBottom:12}}>
          <Text>Slide {i+1} Image Link (postimages Direct Link)</Text>
          <TextInput value={b.image} onChangeText={t=>{let nb=[...banners]; nb[i].image=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:8}} placeholder="https://i.postimg.cc/...jpg" />
          <Text>Big Title</Text>
          <TextInput value={b.big} onChangeText={t=>{let nb=[...banners]; nb[i].big=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:8}} />
          <Text>Small Title</Text>
          <TextInput value={b.small} onChangeText={t=>{let nb=[...banners]; nb[i].small=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:8}} />
          <Text>Link When Tapped (WhatsApp or Website)</Text>
          <TextInput value={b.link} onChangeText={t=>{let nb=[...banners]; nb[i].link=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8}} placeholder="https://wa.me/27739422476" />
        </View>
      ))}
      <TouchableOpacity onPress={()=>setBanners([...banners, {image:"", big:"", small:"", link:""}])} style={{padding:12, backgroundColor:'#eee', borderRadius:8, marginBottom:12}}><Text>Add Another Slide</Text></TouchableOpacity>
      <TouchableOpacity onPress={saveToInternet} style={{padding:16, backgroundColor:'#FFD700', borderRadius:12}}><Text style={{fontWeight:'bold', textAlign:'center'}}>SAVE TO INTERNET - GO LIVE</Text></TouchableOpacity>
    </ScrollView>
  );
          }
