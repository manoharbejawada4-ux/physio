import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'services', title: 'Services', icon: 'stethoscope' },
  { id: 'doctorAppts', title: 'Doctor Appointments', icon: 'user-md' },
  { id: 'physio', title: 'Physiotherapy', icon: 'running' },
  { id: 'homeHealth', title: 'Home Healthcare', icon: 'clinic-medical' },
  { id: 'whyChooseUs', title: 'Why Choose Us', icon: 'award' },
  { id: 'appointments', title: 'Appointments', icon: 'calendar-check' },
  { id: 'about', title: 'About Doctor', icon: 'user-md' },
  { id: 'contact', title: 'Contact', icon: 'phone-alt' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isMobileMenuOpen, setMobileMenuOpen }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;

  if (isMobile) {
    if (!isMobileMenuOpen) return null;
    return (
      <View style={[styles.mobileSidebarContainer, { paddingTop: insets.top }]}>
        <View style={styles.mobileSidebarOverlay} onTouchEnd={() => setMobileMenuOpen(false)} />
        <View style={styles.sidebarContent}>
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/images/home-care-symbol.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>DR. HARI BEJAWADA</Text>
            <Text style={styles.brandSubtitle}>Physiotherapy & Home Health Care Services</Text>
          </View>
          
          {/* Navigation Items */}
          <View style={styles.navContainer}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 name={item.icon} size={18} color={isActive ? Colors.primaryDark : Colors.surface} style={styles.navIcon} />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  // Desktop Sidebar
  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebarContent}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/images/home-care-symbol.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>DR. HARI BEJAWADA</Text>
          <Text style={styles.brandSubtitle}>Physiotherapy & Home Health Care Services</Text>
        </View>
        
        {/* Navigation Items */}
        <View style={styles.navContainer}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => onNavigate(item.id)}
                activeOpacity={0.7}
              >
                <FontAwesome5 name={item.icon} size={20} color={isActive ? Colors.primaryDark : Colors.surface} style={styles.navIcon} />
                <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 280,
    backgroundColor: Colors.primary,
    height: '100%',
    ...Platform.select({
      web: { position: 'fixed' as any, top: 0, left: 0, bottom: 0, zIndex: 100 },
    }),
  },
  mobileSidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1000,
    flexDirection: 'row',
  },
  mobileSidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarContent: {
    width: 280,
    backgroundColor: Colors.primary,
    height: '100%',
    paddingVertical: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.accentLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: 50,
    height: 42,
  },
  brandTitle: {
    color: Colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: Colors.accentLight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  navContainer: {
    paddingHorizontal: 15,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: Colors.accentLight,
  },
  navIcon: {
    width: 30,
    textAlign: 'center',
  },
  navText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  navTextActive: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
});
