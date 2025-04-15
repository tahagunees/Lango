import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { CustomDrawerContent } from '@/components/ui/CustomDrawerContent';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

const Drawer = createDrawerNavigator();

export default function SidebarLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: activeColor,
          drawerStyle: {
            backgroundColor: useThemeColor({}, 'background'),
            width: 280,
          },
        }}>
        <Drawer.Screen
          name="index"
          getComponent={() => require('./index').default}
          options={{
            title: 'Lango',
            drawerLabel: 'Anasayfa',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="lessons"
          getComponent={() => require('./lessons').default}
          options={{
            title: 'Dersler',
            drawerLabel: 'Dersler',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="book" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="practice"
          getComponent={() => require('./practice').default}
          options={{
            title: 'Pratik',
            drawerLabel: 'Pratik',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="fitness-center" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="games"
          getComponent={() => require('./games').default}
          options={{
            title: 'Oyunlar',
            drawerLabel: 'Oyunlar',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="sports-esports" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          getComponent={() => require('./profile').default}
          options={{
            title: 'Profil',
            drawerLabel: 'Profil',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          getComponent={() => require('./explore').default}
          options={{
            title: 'Keşfet',
            drawerLabel: 'Keşfet',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="explore" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          getComponent={() => require('./settings').default}
          options={{
            title: 'Ayarlar',
            drawerLabel: 'Ayarlar',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
