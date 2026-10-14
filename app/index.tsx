import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from "expo-router";

const DATA_URL = "https://api.npoint.io/231ac0e4ddb44534ab1c";
export default function Home() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  // Small boxes to fit one page - like your screenshot
  const cats = [
    {id:"Beauty & Care", name:"Beauty & Care", icon:"💅"},
    {id:"Auto & Repair", name:"Auto & Repair", icon:"🚗"},
    {id:"Health", name:"Health", icon:"➕"},
    {id:"Shopping & Retail", name:"Shopping & Retail", icon:"🛍️"},
    {id:"Education & Kids", name:"Education & Kids", icon:"🎓"},
    {id:"Deals from Amazon", name:"Deals from Amazon", icon:"📦"},
    {id:"Food", name:"Food", icon:"🍔"},
    {id:"Home", name:"Home", icon:"🏠"},
  ];

  const load = async () => {
    try {
      const r = await fetch(DATA_URL);
      const d = await r.json();
      setBanners(d.banners?.length? d.banners : [{image:"https://via.placeholder.com/600x200/FFD700/000?text=Premium+Banner", big:"Premium Banner - Your Business Here", small:"rotating banner ad", link:"https://wa.me/27739422476"}]);
      setBusinesses(d.businesses || []);
    } catch {}
    setLoading(false);
  };

  useEffect(()=>{load();},[]);
  useEffect(()=>{ if(!banners.length) return; const t=setInterval(()=>setSlide(s=>(s+1)%banners.length),3500); return()=>clearInterval(t); },[banners]);

  const filtered = businesses.filter((b:any)=>{
    const mc = selectedCat==="All" || b.category===selectedCat || b.category?.toLowerCase().includes(selectedCat.toLowerCase()) || selectedCat.includes(b.category);
    const ms =!search || b.name?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  if(loading) return <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', alignItems:'center'}}><ActivityIndicator color="#FFD700"/></View>;

  const showBusinesses = search.length>0 || selectedCat!=="All";

  return (
    <View style={{flex:1, backgroundColor:'#000', padding:12, paddingTop:20}}>
      {/* TOP: RAYMEDIA + ADMIN on top so it doesn't affect banner */}
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <Text style={{color:'#FFD700', fontWeight:'bold', fontSize:22}}>RAYMEDIA</Text>
        <TouchableOpacity onPress={()=>router.push('/admin')} style={{backgroundColor:'#1a1a1a', paddingHorizontal:14, paddingVertical:6, borderRadius:20}}>
          <Text style={{color:'#888', fontSize:12}}>ADMIN</Text>
        </TouchableOpacity>
      </View>

      {/* Search like screenshot */}
      <View style={{flexDirection:'row', marginBottom:14}}>
        <TextInput placeholder="Search pizza, plumber, nails..." placeholderTextColor="#666" value={search} onChangeText={setSearch} style={{flex:1, backgroundColor:'#1a1a1a', borderRadius:14, padding:14, color:'#fff', marginRight:8}}/>
        <TouchableOpacity onPress={()=>{}} style={{backgroundColor:'#FFD700', width:54, height:50, borderRadius:14, justifyContent:'center', alignItems:'center'}}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>

      {!showBusinesses? (
        <>
          <Text style={{color:'#C9A86A', fontSize:22, fontWeight:'bold', marginBottom:2}}>Find in Randburg</Text>
          <Text style={{color:'#666', fontSize:11, marginBottom:12}}>Choose a category to explore local services</Text>

          {/* SMALL BOXES - 2 columns, fit one page */}
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
            {cats.map(c=>(
              <TouchableOpacity key={c.id} onPress={()=>setSelectedCat(c.id)} style={{width:'48%', height:82, backgroundColor:'#0a0a0a', borderWidth:1, borderColor:'#C9A86A', borderRadius:14, justifyContent:'center', alignItems:'center', marginBottom:10}}>
                <Text style={{fontSize:22}}>{c.icon}</Text>
                <Text style={{color:'#C9A86A', fontSize:10, fontWeight:'600', marginTop:4, textAlign:'center'}}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={()=>{setSelectedCat("All"); setSearch("");}} style={{marginBottom:10}}><Text style={{color:'#FFD700'}}>← Back to categories</Text></TouchableOpacity>
          <Text style={{color:'#fff', fontWeight:'bold', marginBottom:8}}>{filtered.length} in {selectedCat} {search? `for "${search}"`:''}</Text>
          <ScrollView style={{flex:1}}>
            {filtered.map((b:any,i:number)=>(
              <TouchableOpacity key={i} onPress={()=>b.whatsapp && Linking.openURL(`https://wa.me/${b.whatsapp.replace(/\D/g,'')}`)} style={{padding:12, borderWidth:1, borderColor:'#222', borderRadius:12, marginBottom:8, backgroundColor:'#111'}}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>{b.name} • {b.area}</Text>
                <Text style={{color:'#888', fontSize:11}}>{b.category} {b.offer? `• ${b.offer}`:''} {b.price? `• ${b.price}`:''}</Text>
                <Text style={{color:'#25D366', fontSize:11, marginTop:2}}>WhatsApp {b.whatsapp}</Text>
              </TouchableOpacity>
            ))}
            {filtered.length===0 && <Text style={{color:'#666', textAlign:'center', marginTop:20}}>No businesses yet in {selectedCat}</Text>}
          </ScrollView>
        </>
      )}

      {/* BOTTOM BANNER - Sponsored rotating */}
      <TouchableOpacity onPress={()=>banners[slide]?.link && Linking.openURL(banners[slide].link)} style={{borderWidth:1, borderColor:'#C9A86A', borderRadius:14, padding:10, backgroundColor:'#0a0a0a', marginTop:6}}>
        <Text style={{color:'#666', fontSize:9, marginBottom:4}}>AD • Sponsored</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:18, marginRight:8}}>🔄</Text>
          <View style={{flex:1}}>
            <Text style={{color:'#C9A86A', fontWeight:'bold', fontSize:11}} numberOfLines={1}>{banners[slide]?.big || "Premium Banner - Your Business Here"}</Text>
            <Text style={{color:'#555', fontSize:9}}>{banners[slide]?.small || "rotating banner ad"} • {slide+1}/{banners.length}</Text>
          </View>
          {banners[slide]?.image? <Image source={{uri: banners[slide].image}} style={{width:40, height:24, borderRadius:4}}/> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
                                                  }
