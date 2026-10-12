import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";

export default function Admin() {
  const [banners, setBanners] = useState<any[]>([{image:"", big:"Raymedia", small:"", link:"https://wa.me/27739422476"}]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [newBiz, setNewBiz] = useState({name:"", category:"Food", promo:"", discount:"", whatsapp:""});

  useEffect(() => {
    fetch(DATA_URL).then(r=>r.json()).then(d=>{
      if(d.banners?.length) setBanners(d.banners);
      if(d.businesses) setBusinesses(d.businesses);
    });
  }, []);

  const saveAll = async () => {
    const cleanBanners = banners.map(b=>({
     ...b,
      image: b.image.trim().replace(/\s/g,''),
      link: b.link.trim()
    }));
    const res = await fetch(DATA_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({banners: cleanBanners, businesses})
    });
    if(res.ok) Alert.alert("LIVE! All phones in Randburg will see this now");
    else Alert.alert("Failed");
  };

  const addBusiness = () => {
    if(!newBiz.name) return Alert.alert("Enter business name");
    setBusinesses([...businesses, newBiz]);
    setNewBiz({name:"", category:"Food", promo:"", discount:"", whatsapp:""});
  };

  return (
    <ScrollView style={{flex:1, padding:16, backgroundColor:'#fff'}}>
      <Text style={{fontSize:22, fontWeight:'bold', marginBottom:12}}>Raymedia Admin - Goes LIVE for ALL</Text>

      <Text style={{fontWeight:'bold', marginTop:12}}>BANNER (Client who pays R250)</Text>
      {banners.map((b,i)=>(
        <View key={i} style={{borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:10, marginBottom:10, marginTop:8}}>
          <Text>Image Link (postimages Direct Link)</Text>
          <TextInput value={b.image} onChangeText={t=>{let nb=[...banners]; nb[i].image=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:6}} placeholder="https://i.postimg.cc/...jpg" />
          <Text>Link when tapped (wa.me or website)</Text>
          <TextInput value={b.link} onChangeText={t=>{let nb=[...banners]; nb[i].link=t; setBanners(nb)}} style={{borderWidth:1, padding:8, borderRadius:8}} placeholder="https://wa.me/27739422476" />
        </View>
      ))}

      <Text style={{fontWeight:'bold', marginTop:20}}>ADD BUSINESS</Text>
      <View style={{borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:10, marginTop:8}}>
        <TextInput placeholder="Business Name" value={newBiz.name} onChangeText={t=>setNewBiz({...newBiz, name:t})} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:6}} />
        <TextInput placeholder="Category (Food, Beauty...)" value={newBiz.category} onChangeText={t=>setNewBiz({...newBiz, category:t})} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:6}} />
        <TextInput placeholder="Promo e.g. 2 meals for R100" value={newBiz.promo} onChangeText={t=>setNewBiz({...newBiz, promo:t})} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:6}} />
        <TextInput placeholder="Discount e.g. 20%" value={newBiz.discount} onChangeText={t=>setNewBiz({...newBiz, discount:t})} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:6}} />
        <TextInput placeholder="WhatsApp number e.g. 27721234567" value={newBiz.whatsapp} onChangeText={t=>setNewBiz({...newBiz, whatsapp:t})} style={{borderWidth:1, padding:8, borderRadius:8, marginBottom:8}} />
        <TouchableOpacity onPress={addBusiness} style={{backgroundColor:'#eee', padding:12, borderRadius:8}}><Text style={{textAlign:'center'}}>Add to List</Text></TouchableOpacity>
      </View>

      <Text style={{marginTop:12, fontWeight:'bold'}}>Businesses ({businesses.length}) will go live:</Text>
      {businesses.map((b:any,i:number)=>(
        <View key={i} style={{flexDirection:'row', justifyContent:'space-between', padding:8, borderBottomWidth:1, borderColor:'#eee'}}>
          <Text>{b.name} - {b.category}</Text>
          <TouchableOpacity onPress={()=>setBusinesses(businesses.filter((_,idx)=>idx!==i))}><Text style={{color:'red'}}>Remove</Text></TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={saveAll} style={{padding:16, backgroundColor:'#FFD700', borderRadius:12, marginTop:20, marginBottom:100}}><Text style={{fontWeight:'bold', textAlign:'center', fontSize:16}}>SAVE TO INTERNET - GO LIVE FOR ALL</Text></TouchableOpacity>
    </ScrollView>
  );
          }
