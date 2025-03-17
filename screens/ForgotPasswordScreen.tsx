import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure Notification Handlers
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ForgotPasswordScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📩 Notification Received:', notification);
    });

    // Listen for when a notification is clicked
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('🔗 Notification Clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // ✅ Register for push notifications
  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      Alert.alert('Physical device required', 'Push notifications require a real device.');
      return null;
    }

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission Required', 'Push notifications need permissions.');
        return null;
      }
    }

    // Get Expo Push Token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    return token;
  }

  // ✅ Send Local Notification
  const sendLocalNotification = async () => {
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'Hello, Mahe! 🎉',
    //     body: 'This is a local notification!',
    //     sound: true,
    //   },
      
    //   trigger: {
    //     type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    //     seconds: 2,
    //   }, // Trigger after 2 seconds
    // });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📲 Expo Push Notifications</Text>
      {expoPushToken && <Text>Token: {expoPushToken}</Text>}
      <Button title="Send Local Notification" onPress={sendLocalNotification} />
    </View>
  );
}
