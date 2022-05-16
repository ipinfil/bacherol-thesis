import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraPage from './pages/CameraPage';
import Listing from './pages/Listing';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraPage">
        <Stack.Screen options={{headerShown: false}} name="CameraPage" component={CameraPage} />
        <Stack.Screen name="Listing" component={Listing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}