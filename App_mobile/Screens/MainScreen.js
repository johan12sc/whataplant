import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MainScreen({ navigation, route }) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    loadData();
    if (route.params?.lastScan) {
      setLastScan(route.params.lastScan);
    }
  }, [route.params]);

  const loadData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
      if (userId) {
        const scans = await AsyncStorage.getItem(`scans_${userId}`);
        if (scans) setScanCount(JSON.parse(scans).length);
        const conv = await AsyncStorage.getItem(`conversations_${userId}`);
        if (conv) setChatCount(JSON.parse(conv).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#102A21', '#1D9E75', '#102A21']} style={styles.backgroundGradient} />
      <View style={styles.darkOverlay} />

      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuOuvert(true)} style={styles.headerIconBtn}>
            <Ionicons name="menu-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>What<Text style={styles.headerTitleBold}>APlant</Text></Text>
          <TouchableOpacity onPress={() => setPopupVisible(true)} style={styles.headerIconBtn}>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bonjour, {userName || 'Chercheur'}</Text>
            <Text style={styles.mainTagline}>Explorez. Identifiez.{"\n"}Apprenez.</Text>
          </View>

          <TouchableOpacity 
            style={styles.scannerWrapper}
            onPress={() => navigation.navigate('Scanner')}
            activeOpacity={0.9}
          >
            <LinearGradient colors={['#fff', '#E0F7FA']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.scannerCard}>
              <View style={styles.scannerIconCircle}>
                <Ionicons name="camera" size={40} color="#1D9E75" />
              </View>
              <View style={styles.scannerTextContainer}>
                <Text style={styles.scannerBtnTitle}>Scanner une plante</Text>
                <Text style={styles.scannerBtnSub}>Identification instantanée par l'IA</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#B0BEC5" style={styles.scannerArrow} />
            </LinearGradient>
            <View style={styles.scannerShadow} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.galleryBarWrapper} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Scanner', { openGallery: true })}
          >
            <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.galleryBarGradient}>
              <Ionicons name="images-outline" size={20} color="#fff" />
              <Text style={styles.galleryBarText}>Importer depuis la galerie</Text>
              <View style={styles.galleryPlusBadge}><Ionicons name="add" size={18} color="#1D9E75" /></View>
            </LinearGradient>
          </TouchableOpacity>

          {lastScan && (
            <View style={styles.lastScanCard}>
              <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.lastScanGradient}>
                <Text style={styles.lastScanLabel}>🌱 Dernière plante scannée</Text>
                <Text style={styles.lastScanName}>{lastScan.nom_fr}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ScanResult', { scan: lastScan })}>
                  <Text style={styles.lastScanBtnText}>Voir les détails →</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          <View style={styles.statsGrid}>
            <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']} style={styles.statGlassCard}>
              <MaterialCommunityIcons name="flower-tulip-outline" size={28} color="#fff" style={styles.statIcon} />
              <Text style={styles.statNumber}>{scanCount}</Text>
              <Text style={styles.statLabel}>Plantes scannées</Text>
            </LinearGradient>
            <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']} style={styles.statGlassCard}>
              <MaterialCommunityIcons name="robot-outline" size={28} color="#fff" style={styles.statIcon} />
              <Text style={styles.statNumber}>{chatCount}</Text>
              <Text style={styles.statLabel}>Conversations IA</Text>
            </LinearGradient>
          </View>

          <View style={styles.tipCard}>
            <LinearGradient colors={['rgba(29, 158, 117, 0.2)', 'rgba(16, 42, 33, 0.1)']} style={styles.tipGradient} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
              <Ionicons name="bulb-outline" size={20} color="#fff" style={styles.tipIcon} />
              <Text style={styles.tipText}>Utilisez le menu pour l'IA, l'historique ou la visualisation.</Text>
            </LinearGradient>
          </View>

        </ScrollView>

        {/* MODAL MENU */}
        <Modal visible={menuOuvert} transparent animationType="fade" onRequestClose={() => setMenuOuvert(false)}>
          <View style={styles.menuOverlay}>
            <LinearGradient colors={['rgba(16, 42, 33, 0.95)', 'rgba(29, 158, 117, 0.98)']} style={styles.menuContent}>
              <SafeAreaView style={{flex: 1}}>
                <View style={styles.menuHeaderModal}>
                  <Text style={styles.menuTitre}>Navigation</Text>
                  <TouchableOpacity onPress={() => setMenuOuvert(false)} style={styles.closeMenuBtn}>
                    <Ionicons name="close" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.menuItemsContainer}>
                  {[
                    { text: 'Service IA', icon: 'robot-outline', screen: 'ServiceIA', iconType: MaterialCommunityIcons },
                    { text: 'Historique IA', icon: 'chatbox-ellipses-outline', screen: 'HistoriqueIA', iconType: Ionicons },
                    { text: 'Historique scans', icon: 'leaf-outline', screen: 'HistoriqueScans', iconType: Ionicons },
                    { text: 'Ressource', icon: 'bar-chart-outline', screen: 'Visualisation', iconType: Ionicons },
                  ].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} onPress={() => { setMenuOuvert(false); navigation.navigate(item.screen); }}>
                      <item.iconType name={item.icon} size={24} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.menuItemTexte}>{item.text}</Text>
                      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" style={{marginLeft: 'auto'}} />
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={async () => {
                    await AsyncStorage.removeItem('userId');
                    await AsyncStorage.removeItem('userName');
                    setMenuOuvert(false);
                    navigation.navigate('Home');
                  }}>
                    <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                    <Text style={[styles.menuItemTexte, styles.logoutText]}>Déconnexion</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        </Modal>

        {/* MODAL POPUP */}
        <Modal visible={popupVisible} transparent animationType="slide" onRequestClose={() => setPopupVisible(false)}>
          <View style={styles.popupOverlay}>
            <LinearGradient colors={['rgba(255,255,255,1)', 'rgba(224, 247, 250, 1)']} style={styles.popupContainer}>
              <View style={styles.popupHeader}>
                <Ionicons name="help-circle" size={32} color="#1D9E75" />
                <Text style={styles.popupTitre}>Guide rapide</Text>
              </View>
              <ScrollView style={styles.popupScroll} showsVerticalScrollIndicator={false}>
                {[
                  { icon: 'camera', title: 'Scanner', text: 'Prenez une plante en photo pour l\'identifier.' },
                  { icon: 'chatbubbles', title: 'Service IA', text: 'Posez vos questions sur les plantes.' },
                  { icon: 'journal', title: 'Historique', text: 'Retrouvez vos scans et conversations.' },
                  { icon: 'stats-chart', title: 'Visualisation', text: 'Analysez vos données.' },
                ].map((item, index) => (
                  <View key={index} style={styles.popupHelpItem}>
                    <Ionicons name={item.icon} size={24} color="#1D9E75" style={styles.popupHelpIcon} />
                    <View style={styles.popupHelpTextCont}>
                      <Text style={styles.popupHelpTitle}>{item.title}</Text>
                      <Text style={styles.popupHelpDesc}>{item.text}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.popupBtn} onPress={() => setPopupVisible(false)}>
                <LinearGradient colors={['#1D9E75', '#14805E']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.popupBtnGradient}>
                  <Text style={styles.popupBtnTexte}>J'ai compris !</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#102A21' },
  backgroundGradient: { ...StyleSheet.absoluteFillObject },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, color: '#fff', fontWeight: '300', letterSpacing: 0.5 },
  headerTitleBold: { fontWeight: '700' },

  welcomeSection: { marginTop: 30, marginBottom: 35 },
  welcomeText: { fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: '400', marginBottom: 8 },
  mainTagline: { fontSize: 34, fontWeight: '800', color: '#fff', lineHeight: 42, letterSpacing: -0.5 },

  scannerWrapper: { marginBottom: 15, position: 'relative' },
  scannerCard: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 24, zIndex: 2, overflow: 'hidden' },
  scannerIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(29, 158, 117, 0.12)', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  scannerTextContainer: { flex: 1 },
  scannerBtnTitle: { fontSize: 20, fontWeight: '700', color: '#102A21', marginBottom: 4 },
  scannerBtnSub: { fontSize: 13, color: '#546E7A', fontWeight: '400' },
  scannerArrow: { marginLeft: 10 },
  scannerShadow: { position: 'absolute', bottom: -10, left: 20, right: 20, height: 30, backgroundColor: '#1D9E75', borderRadius: 20, opacity: 0.3, zIndex: 1 },

  galleryBarWrapper: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  galleryBarGradient: { flexDirection: 'row', alignItems: 'center', padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 20 },
  galleryBarText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 12 },
  galleryPlusBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },

  lastScanCard: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  lastScanGradient: { padding: 16 },
  lastScanLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  lastScanName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  lastScanBtnText: { color: '#32C59A', fontSize: 14, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statGlassCard: { width: '47%', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'flex-start' },
  statIcon: { marginBottom: 16, opacity: 0.8 },
  statNumber: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 6 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '400' },

  tipCard: { borderRadius: 16, overflow: 'hidden' },
  tipGradient: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  tipIcon: { marginRight: 12, opacity: 0.9 },
  tipText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },

  menuOverlay: { flex: 1 },
  menuContent: { flex: 1, paddingHorizontal: 24 },
  menuHeaderModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  menuTitre: { fontSize: 28, fontWeight: '800', color: '#fff' },
  closeMenuBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  menuItemsContainer: { marginTop: 40 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuItemTexte: { fontSize: 18, color: '#fff', fontWeight: '500', marginLeft: 16 },
  logoutItem: { marginTop: 30, borderBottomWidth: 0 },
  logoutText: { color: '#FF6B6B', fontWeight: '700' },

  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  popupContainer: { borderRadius: 30, padding: 30, maxHeight: '80%' },
  popupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  popupTitre: { fontSize: 24, fontWeight: '800', color: '#102A21', marginLeft: 15 },
  popupScroll: { marginBottom: 25 },
  popupHelpItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  popupHelpIcon: { marginTop: 2, marginRight: 15 },
  popupHelpTextCont: { flex: 1 },
  popupHelpTitle: { fontSize: 16, fontWeight: '700', color: '#102A21', marginBottom: 3 },
  popupHelpDesc: { fontSize: 14, color: '#546E7A', lineHeight: 20 },
  popupBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 'auto' },
  popupBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  popupBtnTexte: { color: '#fff', fontSize: 16, fontWeight: '700' },
});