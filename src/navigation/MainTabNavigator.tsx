import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from './types';
import { BrowseStackNavigator } from './BrowseStackNavigator';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useBookingStore } from '../store/bookingStore';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const confirmedCount = useBookingStore((state) =>
    state.bookings.filter((b) => b.status === 'confirmed').length
  );

  return (
    <Tab.Navigator
      initialRouteName="BrowseTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="BrowseTab"
        component={BrowseStackNavigator}
        options={{
          tabBarLabel: 'Browse Rooms',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'My Bookings',
          tabBarBadge: confirmedCount > 0 ? confirmedCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeStyle: {
    backgroundColor: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    lineHeight: 14,
  },
});
