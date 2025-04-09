import { Redirect } from 'expo-router';

export default function Index() {
  // Bu sayfa, kullanıcı giriş sayfasına yönlendirecek
  return <Redirect href="/auth/login" />;
} 