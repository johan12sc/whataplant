import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export default function VisualiserPDFScreen({ navigation }) {
  // PDF local ou en ligne
  const pdfSource = require('../../assets/guide_plantes.pdf');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 Guide des plantes</Text>
        <View style={{ width: 28 }} />
      </View>
      <WebView
        source={pdfSource}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#1D9E75',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  webview: { flex: 1 },
});