import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/useThemeColor';

export function DrawerToggleButton() {
  const navigation = useNavigation();
  const textColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
      onPress={() => {
        navigation.dispatch(DrawerActions.toggleDrawer());
      }}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="menu" size={32} color={textColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 9999,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
}); 