import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabNavigator } from './MainTabNavigator';

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};
