import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

export default function Home({navigation}) {
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>

        <View style={styles.content}>
          <Text style={styles.titre}>🌿 WhatAPlant</Text>
          <Text style={styles.description}>
            Identifiez, analysez et apprenez tout sur les plantes autour de vous
          </Text>

          <TouchableOpacity style={styles.btnConnexion}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnConnexionTexte}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnInscription}
          onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.btnInscriptionTexte}>Créer un compte</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 28,
    paddingBottom: 48,
  },
  content: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  btnConnexion: {
    backgroundColor: '#1D9E75',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnConnexionTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnInscription: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  btnInscriptionTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});