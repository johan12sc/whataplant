import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../config';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // connection au serveur php

  const sendLogin = async () => {
  try {
    const response = await fetch(`http://${IP}/WhatAPlant/service_identify/connexion.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if(data.status === 'success') {
      await AsyncStorage.setItem('userId', data.user.id.toString());
      navigation.navigate('Main');
    } else {
      alert(data.message);
    }
  } catch(error) {
    alert('Erreur : ' + error.message);
  }
};

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>

        <View style={styles.card}>

          <Text style={styles.titre}>Connexion</Text>
          <Text style={styles.sousTitre}>Bon retour parmi nous 🌿</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.bouton}
          onPress={sendLogin}
          >
            <Text style={styles.boutonTexte}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lien}
          onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.lienTexte}>Pas encore de compte ? S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lien}
          onPress={()=>navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.lienTexte}>Mot de passe oublié ?</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 16,
  },
  bouton: {
    width: '100%',
    backgroundColor: '#1D9E75',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  boutonTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lien: {
    marginTop: 8,
  },
  lienTexte: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
});