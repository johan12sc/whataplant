import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Home';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import MainScreen from '../Screens/MainScreen';
import ServiceIA from '../Screens/ServiceIA';
import HistoriqueIAScreen from '../Screens/HistoriqueIAScreen';
import ScannerScreen from '../Screens/ScannerScreen';
import ScanResult from '../Screens/ScanResult';
import HistoriqueScansScreen from '../Screens/HistoriqueScansScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} /> 
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="ServiceIA" component={ServiceIA} />
        <Stack.Screen name="HistoriqueIA" component={HistoriqueIAScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} /> 
        <Stack.Screen name="ScanResult" component={ScanResult} />
        <Stack.Screen name="HistoriqueScans" component={HistoriqueScansScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}