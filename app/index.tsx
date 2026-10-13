import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from "expo-router";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";

export default function Home() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const categories = ["All", "Food", "Beauty", "Home", "Health", "Auto", "Fashion", "Other"];

  useEffect(() => {
    fetch(DATA_URL).then(r => r.json()).then(d => { setBanners(d.banners || []); setBusinesses(d.businesses || []); setLoading(false); });
  }, []);

  useEffect(() => {
    if(banners.length === 0) return;
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners]);

  const filtered = businesses.filter((b:any) => {
    const matchCat = selectedCat === "All" || b.category === selectedCat;
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if(loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center', marginTop:100}}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScrollView style={{flex:1, padding:12}}>
        {banners.length > 0 && banners[slide] && (
          <TouchableOpacity onPress={() => Linking.openURL(banners[slide].link)} style={{height:190, borderRadius:16, overflow:'hidden', marginBottom:16, backgroundColor:'#000'}}>
            <Image source={{uri: banners[slide].image.replace(/\s/g,'')}} style={{width:'100%', height:'100%'}} resizeMode="cover" />
            <View style={{position:'absolute', bottom:10, left:10, backgroundColor:'rgba(0,0,0,0.6)', padding:6, borderRadius:6}}>
              <Text style={{color:'#fff', fontWeight:'bold'}}>{banners[slide].big}</Text>
              <Text style={{color:'#FFD700', fontSize:12}}>{banners[slide].small}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TextInput placeholder="Search business in Randburg..." value={search} onChangeText={setSearch} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:12, marginBottom:12}} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={()=>setSelectedCat(cat)} style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor: selectedCat===cat? '#FFD700' : '#f0f0f0', marginRight:8}}>
              <Text style={{fontWeight: selectedCat===cat? 'bold':'normal'}}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>Businesses in Randburg ({filtered.length})</Text>

        {filtered.map((b:any, i:number) => (
          <TouchableOpacity key={i} onPress={()=> b.whatsapp && Linking.openURL(`https://wa.me/${b.whatsapp.replace(/\D/g,'')}`)} style={{padding:14, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:10}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>{b.name} - {b.area}</Text>
            <Text style={{color:'#666'}}>{b.category} {b.offer? `• ${b.offer}`:''}</Text>
            {b.price? <Text style={{color:'green', fontWeight:'bold'}}>{b.price}</Text> : null}
            <Text style={{color:'#25D366', fontWeight:'bold', marginTop:4}}>WhatsApp</Text>
          </TouchableOpacity>
        ))}
        <View style={{height:100}} />
      </ScrollView>

      {/* ADMIN BUTTON BOTTOM RIGHT - Only for you */}
      <TouchableOpacity onPress={()=>router.push('/admin')} style={{position:'absolute', bottom:20, right:20, backgroundColor:'#000', width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', elevation:5}}>
        <Text style={{color:'#FFD700', fontWeight:'bold', fontSize:10}}>ADMIN</Text>
      </TouchableOpacity>
    </View>
  );
                          }
