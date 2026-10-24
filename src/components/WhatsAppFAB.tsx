import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export const WHATSAPP_PHONE_NUMBER = '916303876698';

export const WHATSAPP_GREETING_MESSAGE = `Thank you 😊 for interacting with Dr HARI PHYSIOTHERAPY & HOME  HEALTH CARE SERVICES 

Please let us know how we can assist you.

Please provide your details:- 

Name :- 
Address:-
Services required ?  :- 
For more information contact:- 6303876698`;

export const openWhatsApp = (customMessage?: string) => {
  const text = encodeURIComponent(customMessage || WHATSAPP_GREETING_MESSAGE);
  const phoneNumber = WHATSAPP_PHONE_NUMBER;
  const url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;

  if (Platform.OS === 'web') {
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${text}`);
    return;
  }

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL(`https://wa.me/${phoneNumber}?text=${text}`);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(() => Linking.openURL(`https://wa.me/${phoneNumber}?text=${text}`));
};

export const WhatsAppFAB = ({ message }: { message?: string }) => {
  const handlePress = () => {
    openWhatsApp(message);
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress} activeOpacity={0.8}>
      <FontAwesome name="whatsapp" size={30} color={Colors.surface} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.whatsapp,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
  },
});
