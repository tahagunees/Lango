import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const [loading, setLoading] = useState(false);

  // Kullanıcı avatarı için baş harfler
  const getInitials = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Menüde olmayan navigasyon işlemleri için manuel yönlendirme
  const handleNavigation = (route: string) => {
    // Drawer'ı kapat
    props.navigation.closeDrawer();
    
    // İlgili sayfaya yönlendir
    setTimeout(() => {
      props.navigation.navigate(route);
    }, 300);
  };

  const handleWebsite = () => {
    // Drawer'ı kapat
    props.navigation.closeDrawer();
    
    // Web sitesini aç
    setTimeout(() => {
      Alert.alert(
        "Lango Web Sitesi",
        "Lango web sitesini açmak istiyor musunuz?",
        [
          { 
            text: "İptal", 
            style: "cancel" 
          },
          { 
            text: "Aç", 
            onPress: () => {
              Linking.openURL("https://lango-app.com").catch(err => {
                Alert.alert("Hata", "Web sitesi açılamadı");
              });
            }
          }
        ]
      );
    }, 300);
  };

  const handleHelp = () => {
    // Drawer'ı kapat
    props.navigation.closeDrawer();
    
    // Bildirim göster
    setTimeout(() => {
      Alert.alert(
        "Yardım",
        "Yardım merkezi henüz geliştirme aşamasındadır. Destek için info@lango.com adresine e-posta gönderebilirsiniz.",
        [{ text: "Tamam", style: "default" }]
      );
    }, 300);
  };

  const handleLogout = async () => {
    if (loading) return; // İşlem devam ediyorsa çıkış

    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        { 
          text: "Çıkış Yap", 
          onPress: async () => {
            try {
              setLoading(true);
              
              // Drawer'ı kapat
              props.navigation.closeDrawer();
              
              // Firebase Auth ile çıkış yapma
              await logout();
              
              // Giriş sayfasına yönlendirme
              setTimeout(() => {
                router.replace("/auth/login");
              }, 300);
            } catch (error: any) {
              console.error("Logout error:", error);
              Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor }}
      contentContainerStyle={styles.drawerContent}>
      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          activeOpacity={0.7}
          onPress={() => props.navigation.navigate('profile')}>
          {userProfile?.photoURL ? (
            <Image 
              source={{ uri: userProfile.photoURL }} 
              style={styles.profileImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.profileName, { color: textColor }]}>
          {userProfile?.fullName || user?.email?.split('@')[0] || 'Kullanıcı Adı'}
        </Text>
        <Text style={[styles.profileLevel, { color: textColor }]}>
          {userProfile ? 'A1 Başlangıç Seviyesi' : 'Giriş yapılmamış'}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: tintColor }]}>7</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Gün</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: tintColor }]}>3</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Ders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: tintColor }]}>120</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Puan</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <DrawerItemList {...props} />

      <View style={styles.divider} />

      <DrawerItem
        label="Web Sitesi"
        icon={({ color, size }) => (
          <MaterialIcons name="public" size={size} color={color} />
        )}
        onPress={handleWebsite}
      />
      
      <DrawerItem
        label="Yardım"
        icon={({ color, size }) => (
          <MaterialIcons name="help" size={size} color={color} />
        )}
        onPress={handleHelp}
      />
      
      <DrawerItem
        label="Çıkış Yap"
        icon={({ color, size }) => (
          <MaterialIcons name="exit-to-app" size={size} color={color} />
        )}
        onPress={handleLogout}
        style={loading ? { opacity: 0.5 } : {}}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 