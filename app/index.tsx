import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from "react-native";

const DATA_URL = "https://api.npoint.io/b5d4effa1f6c9ef05512";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(DATA_URL)
     .then(r => r.json())
     .then(d => {
        setBanners(d.banners || []);
        setBusinesses(d.businesses || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if(banners.length === 0) return;
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners]);

  if(loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator /></View>;

  return (
    <ScrollView style={{flex:1, backgroundColor:'#fff', padding:12}}>
      {/* BANNER - TAPS TO WHATSAPP OR WEBSITE */}
      {banners.length > 0 && (
        <TouchableOpacity
          onPress={() => Linking.openURL(banners[slide].link)}
          style={{height:180, borderRadius:16, overflow:'hidden', marginBottom:16, backgroundColor:'#111'}}
        >
          <Image source={{uri: banners[slide].image}} style={{width:'100%', height:'100%'}} resizeMode="cover" />
          <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'rgba(0,0,0,0.6)', padding:8}}>
            <Text style={{color:'#FFD700', fontWeight:'bold'}}>{banners[slide].big}</Text>
            <Text style={{color:'#fff', fontSize:12}}>{banners[slide].small}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* BUSINESSES - example */}
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>Businesses in Randburg</Text>
      {businesses.map((b:any, i:number) => (
        <View key={i} style={{padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8}}>
          <Text style={{fontWeight:'bold'}}>{b.name}</Text>
          <Text>{b.category} - {b.promo}</Text>
        </View>
      ))}
    </ScrollView>
  );
                                               }
