import React, { useState } from 'react';
import AppNavigator from './App_mobile/navigation/AppNavigator';
import SplashScreen from './App_mobile/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return <AppNavigator />;
}