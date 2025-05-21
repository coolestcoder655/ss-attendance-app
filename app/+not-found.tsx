import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { ToastAndroid, Platform, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Page not found. Please use the button below to return home.', ToastAndroid.SHORT);
    } else {
      Alert.alert('Page not found', 'Please use the button below to return home.');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page not found</Text>
      <Text>The page you are looking for does not exist.</Text>
      <Pressable
        onPress={() => window.location.assign('/')}
        style={{ marginTop: 24, backgroundColor: '#2e78b7', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
