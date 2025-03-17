import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';

const HomeScreen = () => {

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User Signed Out");
          } catch (error: any) {
            console.error("Error Signing Out: ", error.message);
          }
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={handleSignOut}>Welcome to Expo App!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
