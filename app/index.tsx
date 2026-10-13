import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, TextInput, RefreshControl } from "react-native";
import { useRouter } from "expo-router";

const DATA_URL = "https://api.npoint.io/231ac0e4ddb44534ab1c";

export default function Home() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const categories = ["All", "Food", "Beauty", "Home", "Health", "Auto", "Fashion", "Other"];

  const load = async () => {
    try {
      const res = await fetch(DATA_URL);
      const d = await res.json();
      setBanners(d.banners || []);
      setBusinesses(d.businesses || []);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if(banners.length===0) return; const t=setInterval(()=>setSlide(s=>(s+1)%banners.length),4000); return()=>clearInterval(t); }, [banners]);

  const filtered = businesses.filter((b:any) => {
    const mc = selectedCat==="All" || b.category===selectedCat;
    const ms = b.name?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  if(loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:100}}><ActivityIndicator size="large"/></View>;

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScrollView style={{flex:1, padding:12}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true); load();}}/>}>
        {banners.length>0 && banners[slide] && (
          <TouchableOpacity onPress={()=>banners[slide].link && Linking.openURL(banners[slide].link)} style={{height:190, borderRadius:16, overflow:'hidden', marginBottom:16, backgroundColor:'#000'}}>
            <Image source={{uri: banners[slide].image?.replace(/\s/g,'')}} style={{width:'100%', height:'100%'}} resizeMode="cover"/>
            <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'rgba(0,0,0,0.55)', padding:10}}>
              <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>{banners[slide].big}</Text>
              <Text style={{color:'#FFD700', fontSize:12}}>{banners[slide].small}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TextInput placeholder="Search business in Randburg..." value={search} onChangeText={setSearch} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:12, marginBottom:12}}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          {categories.map(cat=><TouchableOpacity key={cat} onPress={()=>setSelectedCat(cat)} style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:selectedCat===cat?'#FFD700':'#f0f0f0', marginRight:8}}><Text style={{fontWeight:selectedCat===cat?'bold':'normal'}}>{cat}</Text></TouchableOpacity>)}
        </ScrollView>

        <Text style={{fontWeight:'bold', fontSize:18, marginBottom:10}}>Businesses in Randburg ({filtered.length}) LIVE</Text>
        {filtered.length===0 && <Text style={{color:'#999', marginTop:20, textAlign:'center'}}>No businesses yet. Add in Admin.</Text>}
        {filtered.map((b:any,i:number)=>(
          <TouchableOpacity key={i} onPress={()=>b.whatsapp && Linking.openURL(`https://wa.me/${b.whatsapp.replace(/\D/g,'')}`)} style={{padding:14, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:10, backgroundColor:'#fff'}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>{b.name} • {b.area || 'Randburg'}</Text>
            <Text style={{color:'#666'}}>{b.category}{b.offer? ` • ${b.offer}`:''}</Text>
            {b.price? <Text style={{color:'green', fontWeight:'bold', marginTop:2}}>{b.price}</Text>:null}
            <Text style={{color:'#25D366', fontWeight:'bold', marginTop:6}}>WhatsApp {b.whatsapp}</Text>
          </TouchableOpacity>
        ))}
        <View style={{height:120}}/>
      </ScrollView>

      {/* ADMIN BUTTON BOTTOM RIGHT */}
      <TouchableOpacity onPress={()=>router.push('/admin')} style={{position:'absolute', bottom:22, right:22, backgroundColor:'#000', width:58, height:58, borderRadius:29, justifyContent:'center', alignItems:'center', elevation:8}}>
        <Text style={{color:'#FFD700', fontWeight:'bold', fontSize:10}}>ADMIN</Text>
      </TouchableOpacity>
    </View>
  );
    }
