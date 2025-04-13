import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/useThemeColor';

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const [loading, setLoading] = useState(false);

  // Menüde olmayan navigasyon işlemleri için manuel yönlendirme
  const handleNavigation = (route: string) => {
    // Drawer'ı kapat
    props.navigation.closeDrawer();
    
    // İlgili sayfaya yönlendir
    setTimeout(() => {
      props.navigation.navigate(route);
    }, 300);
  };

  const handleSettings = () => {
    // Drawer'ı kapat
    props.navigation.closeDrawer();
    
    // Bildirim göster
    setTimeout(() => {
      Alert.alert(
        "Ayarlar",
        "Ayarlar ekranı henüz geliştirme aşamasındadır. Yakında kullanıma sunulacaktır.",
        [{ text: "Tamam", style: "default" }]
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

  const handleLogout = () => {
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
          onPress: () => {
            setLoading(true);
            
            // Drawer'ı kapat
            props.navigation.closeDrawer();
            
            // Giriş ekranına yönlendirme işlemi
            setTimeout(() => {
              try {
                // Çıkış yaptıktan sonra Lango uygulamasını yeniden başlat
                // Bu durumda otomatik olarak giriş ekranına yönlendirilir
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'index' }],
                });
                
                // Tam temizlik için uygulamayı resetleme
                // NOT: Gerçek bir logout API'si entegre edildiğinde
                // burada oturum tokenları temizlenmelidir
                
                // Oturum kapatıldı bildirimi
                setTimeout(() => {
                  Alert.alert(
                    "Oturum Kapatıldı",
                    "Hesabınızdan başarıyla çıkış yaptınız.",
                    [{ text: "Tamam" }]
                  );
                }, 500);
              } catch (error) {
                console.error("Logout error:", error);
                Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
              } finally {
                setLoading(false);
              }
            }, 300);
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
          <MaterialIcons name="person" size={50} color={tintColor} />
        </TouchableOpacity>
        <Text style={[styles.profileName, { color: textColor }]}>
          Kullanıcı Adı
        </Text>
        <Text style={[styles.profileLevel, { color: textColor }]}>
          Başlangıç Seviyesi
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
        label="Ayarlar"
        icon={({ color, size }) => (
          <MaterialIcons name="settings" size={size} color={color} />
        )}
        onPress={handleSettings}
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
}); 