import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, TextInput } from "react-native";
import { Link } from "expo-router";
const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";
export default function Home(){
  const [banners,setBanners]=useState<any[]>([]); const [businesses,setBusinesses]=useState<any[]>([]);
  const [slide,setSlide]=useState(0); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(""); const [cat,setCat]=useState("All");
  const cats=["All","Food","Beauty","Fashion","Home","Health","Auto","Other"];
  useEffect(()=>{ fetch(DATA_URL).then(r=>r.json()).then(d=>{ setBanners(d.banners||[]); setBusinesses(d.businesses||[]); setLoading(false);}); },[]);
  useEffect(()=>{ if(!banners.length) return; const t=setInterval(()=>setSlide(s=>(s+1)%banners.length),4000); return()=>clearInterval(t); },[banners]);
  const filtered=businesses.filter((b:any)=>{ const mc=cat==="All"||b.category===cat; const ms=b.name?.toLowerCase().includes(search.toLowerCase()); return mc&&ms; });
  if(loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:100}}><ActivityIndicator size="large"/></View>;
  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScrollView style={{flex:1, padding:12}}>
        {banners[slide]? <TouchableOpacity onPress={()=>Linking.openURL(banners[slide].link)} style={{height:190, borderRadius:16, overflow:'hidden', marginBottom:16, backgroundColor:'#000'}}>
          <Image source={{uri:banners[slide].image.replace(/\s/g,'')}} style={{width:'100%',height:'100%'}} resizeMode="cover"/>
          <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'rgba(0,0,0,0.4)', padding:8}}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>{banners[slide].big}</Text>
            <Text style={{color:'#fff', fontSize:12}}>{banners[slide].small}</Text>
          </View>
        </TouchableOpacity> : null}
        <TextInput placeholder="Search in Randburg..." value={search} onChangeText={setSearch} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:12, marginBottom:12}}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
          {cats.map(c=><TouchableOpacity key={c} onPress={()=>setCat(c)} style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:cat===c?'#FFD700':'#f0f0f0', marginRight:8}}><Text>{c}</Text></TouchableOpacity>)}
        </ScrollView>
        {filtered.map((b:any,i:number)=><TouchableOpacity key={i} onPress={()=>Linking.openURL(`https://wa.me/${b.whatsapp.replace(/\D/g,'')}`)} style={{padding:14, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:10}}>
          <Text style={{fontWeight:'bold'}}>{b.name} • {b.category}</Text>
          <Text style={{color:'#666'}}>{b.area}</Text>
          {b.offer? <Text style={{marginTop:4}}>{b.offer}</Text>:null}
          {b.price? <Text style={{color:'green', fontWeight:'bold'}}>{b.price}</Text>:null}
          <Text style={{color:'#25D366', marginTop:4, fontWeight:'bold'}}>WhatsApp {b.whatsapp}</Text>
        </TouchableOpacity>)}
        <View style={{height:100}}/>
      </ScrollView>
      {/* ADMIN BUTTON BOTTOM RIGHT CORNER - SMALL FOR YOU ONLY */}
      <Link href="/admin" asChild>
        <TouchableOpacity style={{position:'absolute', bottom:20, right:20, backgroundColor:'#000', paddingHorizontal:14, paddingVertical:8, borderRadius:20, opacity:0.6}}>
          <Text style={{color:'#fff', fontSize:12}}>Admin</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
    }
