import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export const WhatsAppFAB = ({ message }: { message?: string }) => {
  const defaultMessage = `Thank you 😊 for contacting Dr HARI PHYSIOTHERAPY AND HOME HEALTH CARE SERVICES\n\nPlease let us know how we can help you.\n\nPlease provide:-\nName:-\nAddress:-\nServices required?:-\n1. Doctor Appointments 🧑‍⚕️\n2. Physiotherapy 🦵💪\n3. Wound Care & Dressing 🩹\n4. Nursing Care Services 🧑‍💼\n5. Surgical Things 🩼🦽 (Braces, walkers) etc.\n6. Ambulance Services 🚑`;
  
  const handlePress = () => {
    const text = encodeURIComponent(message || defaultMessage);
    const phoneNumber = '916303876698';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return Linking.openURL(`https://wa.me/${phoneNumber}?text=${text}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
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
