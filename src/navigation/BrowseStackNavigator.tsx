import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrowseStackParamList } from './types';
import { BrowseRoomsScreen } from '../screens/BrowseRoomsScreen';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export const BrowseStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BrowseRooms"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="BrowseRooms" component={BrowseRoomsScreen} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
    </Stack.Navigator>
  );
};
