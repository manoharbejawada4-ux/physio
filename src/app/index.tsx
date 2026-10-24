import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, Platform, Linking, NativeSyntheticEvent, NativeScrollEvent, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { AppContent } from '../constants/AppContent';
import { FontAwesome5 } from '@expo/vector-icons';
import { Sidebar } from '../components/Sidebar';
import { WhatsAppFAB, openWhatsApp } from '../components/WhatsAppFAB';

const AnimatedCounter = ({ endValue, suffix, isVisible }: { endValue: number, suffix: string, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible && count < endValue) {
      const duration = 1500;
      const steps = 30;
      const stepTime = duration / steps;
      const increment = endValue / steps;

      const timer = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= endValue) {
            clearInterval(timer);
            return endValue;
          }
          return next;
        });
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isVisible, endValue]);

  return <Text style={styles.impactValue}>{Math.floor(count)}{suffix}</Text>;
};

export default function SinglePageDashboard() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});
  
  const sectionLayouts = useRef<{ [key: string]: number }>({}).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    
    let current = 'home';
    let minDiff = Infinity;
    
    const newVisible: any = { ...visibleSections };

    Object.keys(sectionLayouts).forEach(key => {
      const sectionY = sectionLayouts[key];
      const diff = Math.abs(sectionY - y);
      if (diff < minDiff && y >= sectionY - 300) {
        minDiff = diff;
        current = key;
      }
      
      // Determine if section is visible in viewport for animations
      if (y + height > sectionY && y < sectionY + 500) {
        newVisible[key] = true;
      }
    });

    if (activeSection !== current) setActiveSection(current);
    if (JSON.stringify(newVisible) !== JSON.stringify(visibleSections)) {
      setVisibleSections(newVisible);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const y = sectionLayouts[sectionId] || 0;
    scrollViewRef.current?.scrollTo({ y, animated: true });
    if (isMobile) setMobileMenuOpen(false);
  };

  const onLayout = (id: string) => (event: any) => {
    sectionLayouts[id] = event.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <View style={styles.appWrapper}>
        {isMobile && (
          <View style={[styles.mobileHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => setMobileMenuOpen(true)} style={styles.menuButton}>
              <FontAwesome5 name="bars" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.mobileHeaderTitle}>DR. HARI</Text>
            <Image
              source={require('../../assets/images/hh-logo.png')}
              style={styles.mobileCornerLogo}
              resizeMode="contain"
            />
          </View>
        )}

        <Sidebar 
          activeSection={activeSection} 
          onNavigate={scrollToSection} 
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.mainContent} 
          contentContainerStyle={[styles.scrollContent, { paddingLeft: isMobile ? 0 : 280 }]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* HOME HERO SECTION */}
          <View style={styles.section} onLayout={onLayout('home')}>
            <View style={styles.heroRow}>
              <View style={styles.heroTextCol}>
                <Text style={styles.heroHeadline}>Move Better. Live Better.</Text>
                <Text style={styles.heroMission}>
                  We are here to help you move from <Text style={styles.textRed}>dependent</Text> to <Text style={styles.textBlue}>independent</Text>.
                </Text>
                <Text style={styles.heroSubhead}>
                  Expert physiotherapy, home healthcare, nursing care, and diagnostic services designed to support your recovery, mobility, confidence, and quality of life.
                </Text>
                <View style={styles.heroButtons}>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => scrollToSection('appointments')}>
                    <Text style={styles.primaryButtonText}>Book Appointment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => scrollToSection('services')}>
                    <Text style={styles.secondaryButtonText}>Explore Services</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.heroLogoCol}>
                <Image
                  source={require('../../assets/images/hh-logo.png')}
                  style={styles.heroCornerLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
            
            {/* TRUSTED CARE STATISTICS SECTION */}
            <View style={styles.impactContainer} onLayout={onLayout('impact')}>
              <Text style={styles.impactSectionTitle}>Trusted by Our Patients</Text>
              <View style={styles.impactGrid}>
                {AppContent.stats.map((stat) => (
                  <View key={stat.id} style={styles.impactCard}>
                    <FontAwesome5 name={stat.icon} size={40} color={Colors.primary} style={styles.impactIcon} />
                    <AnimatedCounter endValue={stat.value} suffix={stat.suffix} isVisible={!!visibleSections['impact']} />
                    <Text style={styles.impactTitle}>{stat.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* SERVICES SECTION */}
          <View style={[styles.section, styles.sectionAlt]} onLayout={onLayout('services')}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <View style={styles.gridContainer}>
              {[
                { title: 'Doctor Appointments', icon: 'user-md', desc: 'Professional consultation and appointments.' },
                { title: 'Physiotherapy', icon: 'running', desc: 'Personalized treatment and rehabilitation.' },
                { title: 'Wound Care & Dressing', icon: 'band-aid', desc: 'Professional wound care and dressing services.' },
                { title: 'Nursing Care Services', icon: 'user-nurse', desc: 'Healthcare and nursing support at home.' },
                { title: 'Surgical Things', icon: 'wheelchair', desc: 'Braces, walkers, mobility support and medical equipment.' },
                { title: 'Ambulance Service', icon: 'ambulance', desc: 'Quick and reliable ambulance service for emergency medical needs.' },
              ].map((s, i) => (
                <View key={i} style={styles.serviceCard}>
                  <View style={styles.serviceIconWrap}>
                    <FontAwesome5 name={s.icon} size={30} color={Colors.primary} />
                  </View>
                  <Text style={styles.serviceCardTitle}>{s.title}</Text>
                  <Text style={styles.serviceCardDesc}>{s.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* DOCTOR APPOINTMENTS SECTION */}
          <View style={styles.section} onLayout={onLayout('doctorAppts')}>
            <Text style={styles.sectionTitle}>Doctor Appointments</Text>
            <Text style={styles.sectionMission}>Consult experienced specialists from the comfort of your home or clinic.</Text>
            <View style={styles.doctorGrid}>
              {[
                { title: 'Orthopaedics', icon: 'bone', desc: 'Bone, joint & spine specialists.' },
                { title: 'Neurology', icon: 'brain', desc: 'Brain, spine & nerve care.' },
                { title: 'Cardiology', icon: 'heartbeat', desc: 'Heart & cardiovascular health.' },
                { title: 'Pulmonology', icon: 'lungs', desc: 'Lungs & respiratory care.' },
                { title: 'Gynaecology', icon: 'female', desc: 'Women\'s health & maternity care.' },
                { title: 'Paediatrics', icon: 'baby', desc: 'Expert care for infants & children.' },
                { title: 'General Medicine', icon: 'stethoscope', desc: 'Primary care & general health.' },
              ].map((d, i) => (
                <View key={i} style={styles.doctorCard}>
                  <View style={styles.doctorIconWrap}>
                    <FontAwesome5 name={d.icon} size={28} color={Colors.primary} />
                  </View>
                  <Text style={styles.doctorCardTitle}>{d.title}</Text>
                  <Text style={styles.doctorCardDesc}>{d.desc}</Text>
                </View>
              ))}
            </View>
            <View style={styles.videoConsultBanner}>
              <FontAwesome5 name="video" size={22} color={Colors.surface} style={{ marginRight: 12 }} />
              <Text style={styles.videoConsultText}>📲 Video Consultations are also available — consult from anywhere!</Text>
            </View>
            <TouchableOpacity style={styles.primaryButtonCenter} onPress={() => scrollToSection('appointments')}>
              <Text style={styles.primaryButtonText}>Book a Doctor Appointment</Text>
            </TouchableOpacity>
          </View>

          {/* PHYSIOTHERAPY SECTION */}

          <View style={[styles.section, styles.sectionAlt]} onLayout={onLayout('physio')}>
            <Text style={styles.sectionTitle}>Physiotherapy Services</Text>
            <View style={styles.physioGrid}>
              {[
                'Joint Replacement Rehabilitation & Physiotherapy',
                'Stroke Rehabilitation & Physiotherapy',
                'Cardiopulmonary Rehabilitation & Physiotherapy',
                'Spinal Cord Injury & Trauma Rehabilitation & Physiotherapy',
              ].map((s, i) => (
                <View key={i} style={styles.physioItem}>
                  <FontAwesome5 name="check-circle" size={18} color={Colors.primary} />
                  <Text style={styles.physioText}>{s}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButtonCenter} onPress={() => scrollToSection('appointments')}>
              <Text style={styles.primaryButtonText}>Book Physiotherapy Appointment</Text>
            </TouchableOpacity>
          </View>


          {/* HOME HEALTHCARE SECTION */}
          <View style={styles.section} onLayout={onLayout('homeHealth')}>
            <Text style={styles.sectionTitle}>Home Healthcare Services</Text>
            <View style={styles.healthGrid}>
              {[
                { title: 'Doctor Home Visits', icon: 'stethoscope' },
                { title: 'Physiotherapy at Home', icon: 'home' },
                { title: 'Nursing Care', icon: 'hand-holding-medical' },
                { title: 'Wound Care & Dressing', icon: 'band-aid' },
                { title: 'Post-Surgery Care', icon: 'procedures' },
                { title: 'Elderly Care', icon: 'blind' },
                { title: 'Medical Equipment', icon: 'crutch' },
              ].map((s, i) => (
                <View key={i} style={styles.healthCard}>
                  <FontAwesome5 name={s.icon} size={24} color={Colors.primary} />
                  <Text style={styles.healthCardTitle}>{s.title}</Text>
                </View>
              ))}
            </View>
          </View>


          {/* WHY CHOOSE US SECTION */}
          <View style={styles.section} onLayout={onLayout('whyChooseUs')}>
            <Text style={styles.sectionTitle}>Why Choose Dr. Hari?</Text>
            <View style={styles.whyGrid}>
              {[
                { title: 'Personalized Care', desc: 'Treatment based on individual needs.', icon: 'user-check' },
                { title: 'Professional Support', desc: 'Reliable physiotherapy and healthcare services.', icon: 'award' },
                { title: 'Home Service', desc: 'Convenient healthcare support at your home.', icon: 'car-alt' },
                { title: 'Easy Appointment', desc: 'Quick booking through WhatsApp.', icon: 'whatsapp' },
              ].map((s, i) => (
                <View key={i} style={styles.whyCard}>
                  <View style={styles.whyIconWrap}>
                    <FontAwesome5 name={s.icon} size={24} color={Colors.surface} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.whyCardTitle}>{s.title}</Text>
                    <Text style={styles.whyCardDesc}>{s.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* TESTIMONIALS SECTION */}
          <View style={[styles.section, styles.sectionAlt]} onLayout={onLayout('testimonials')}>
            <View style={styles.overviewHeaderRow}>
              <Text style={[styles.sectionTitle, { marginBottom: 40 }]}>What Our Patients Say</Text>
            </View>
            <View style={styles.testimonialsGrid}>
              {AppContent.testimonials.map((t) => (
                <View key={t.id} style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <View style={styles.testimonialAvatar}>
                      <Text style={styles.testimonialInitials}>{t.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.testimonialMeta}>
                      <Text style={styles.testimonialName}>{t.name}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        {[...Array(t.rating)].map((_, i) => <FontAwesome5 key={i} name="star" solid size={12} color="#FFD700" />)}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.testimonialFeedback}>"{t.feedback}"</Text>
                  <Text style={styles.testimonialService}>Service: {t.service}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.youtubeButton}
              onPress={() => Linking.openURL('https://youtube.com/@drharihealthandfitness?si=dWVHKhg2uZxYTTRI')}
            >
              <FontAwesome5 name="youtube" size={22} color={Colors.surface} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.youtubeButtonTitle}>Watch on YouTube</Text>
                <Text style={styles.youtubeButtonSub}>Dr. Hari Health & Fitness Channel</Text>
              </View>
            </TouchableOpacity>
          </View>


          {/* APPOINTMENT SECTION */}
          <AppointmentForm onLayout={onLayout('appointments')} />

          {/* ABOUT SECTION */}
          <View style={[styles.section, styles.sectionAlt]} onLayout={onLayout('about')}>
            <Text style={styles.sectionTitle}>About Dr. Hari Bejawada</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutImage}>
                <FontAwesome5 name="user-md" size={60} color={Colors.surface} />
              </View>
              <View style={styles.aboutContent}>
                <Text style={styles.aboutName}>Dr. Hari Bejawada</Text>
                <Text style={styles.aboutSpec}>Lead Physiotherapist & Healthcare Provider</Text>
                <Text style={[styles.sectionMission, { textAlign: 'left', marginBottom: 15 }]}>"We are here to help you move from <Text style={styles.textRed}>dependent</Text> to <Text style={styles.textBlue}>independent</Text>."</Text>
                <Text style={styles.aboutDesc}>
                  Dedicated professional offering expert physiotherapy and home healthcare services. 
                  Committed to providing personalized care, ensuring comfort, recovery, and overall well-being for all patients.
                </Text>
              </View>
            </View>
          </View>

          {/* CONTACT SECTION */}
          <View style={[styles.section, { paddingBottom: 120 }]} onLayout={onLayout('contact')}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.contactContainer}>
              <View style={styles.contactDetails}>
                <View style={styles.contactItem}>
                  <FontAwesome5 name="clock" size={20} color={Colors.primary} />
                  <Text style={styles.contactText}>Working Hours: 24 Hours</Text>
                </View>
                <TouchableOpacity style={styles.whatsappButton} onPress={() => openWhatsApp()}>
                  <FontAwesome5 name="whatsapp" size={20} color={Colors.surface} />
                  <Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contactLogoCol}>
                <View style={styles.contactLogoWrapper}>
                  <Image
                    source={require('../../assets/images/dr-hari-round-logo.png')}
                    style={styles.contactRoundLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
      <WhatsAppFAB />
    </SafeAreaView>
  );
}

const AppointmentForm = ({ onLayout }: { onLayout: any }) => {
  const handleBooking = () => {
    openWhatsApp();
  };

  return (
    <View style={styles.section} onLayout={onLayout}>
      <Text style={styles.sectionTitle}>Book Easily</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          style={[styles.whatsappButton, { paddingHorizontal: 36, paddingVertical: 18, borderRadius: 35 }]}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="whatsapp" size={28} color={Colors.surface} style={{ marginRight: 12 }} />
          <Text style={[styles.whatsappButtonText, { fontSize: 20 }]}>Book Easily on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  appWrapper: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  
  mobileHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: Colors.surface, zIndex: 900,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  menuButton: { padding: 10 },
  mobileHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  mobileCornerLogo: { width: 80, height: 32 },

  section: { padding: 40, paddingVertical: 60 },
  sectionAlt: { backgroundColor: Colors.accent },
  sectionTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 40, textAlign: 'center' },
  demoLabel: { fontSize: 12, color: Colors.textLight, fontStyle: 'italic', textAlign: 'center', marginTop: -35, marginBottom: 40 },

  heroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 },
  heroTextCol: { flex: 1, minWidth: 300, maxWidth: 680, marginBottom: 20 },
  heroLogoCol: { alignItems: 'flex-end', justifyContent: 'flex-start', alignSelf: 'flex-start', paddingTop: 6, marginBottom: 20 },
  heroCornerLogo: { width: 240, height: 96 },
  heroHeadline: { fontSize: 44, fontWeight: '900', color: Colors.primaryDark, marginBottom: 15, lineHeight: 52 },
  heroMission: { fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 15, fontStyle: 'italic' },
  heroSubhead: { fontSize: 18, color: Colors.textLight, marginBottom: 30, lineHeight: 28 },
  heroButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  
  textRed: { color: Colors.text },
  textBlue: { color: Colors.secondary, fontWeight: '900' },
  sectionMission: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 30, textAlign: 'center', fontStyle: 'italic' },
  
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, elevation: 4 },
  primaryButtonText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' },
  primaryButtonCenter: { backgroundColor: Colors.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, alignSelf: 'center', marginTop: 40 },
  secondaryButton: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  secondaryButtonText: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },

  // Impact Stats
  impactContainer: { marginTop: 60, backgroundColor: Colors.surface, padding: 40, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 },
  impactSectionTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primaryDark, textAlign: 'center', marginBottom: 40 },
  impactGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 40 },
  impactCard: { alignItems: 'center', flex: 1, minWidth: 200, padding: 20, backgroundColor: Colors.background, borderRadius: 16, elevation: 2 },
  impactIcon: { marginBottom: 15 },
  impactValue: { fontSize: 44, fontWeight: '900', color: Colors.primaryDark },
  impactTitle: { fontSize: 18, fontWeight: '600', color: Colors.textLight, marginTop: 5, textAlign: 'center' },

  // Shared Header
  overviewHeaderRow: { alignItems: 'center', marginBottom: 20 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  serviceCard: { width: 280, backgroundColor: Colors.surface, borderRadius: 16, padding: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  serviceIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  serviceCardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 10 },
  serviceCardDesc: { fontSize: 14, color: Colors.textLight, lineHeight: 22 },

  // Doctor Appointments
  doctorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 30 },
  doctorCard: { width: 220, backgroundColor: Colors.surface, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  doctorIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  doctorCardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 6, textAlign: 'center' },
  doctorCardDesc: { fontSize: 13, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  videoConsultBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, padding: 18, borderRadius: 14, marginBottom: 30, maxWidth: 800, alignSelf: 'center', width: '100%' },
  videoConsultText: { flex: 1, color: Colors.surface, fontSize: 15, fontWeight: '600', lineHeight: 22 },

  physioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
  physioItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 15, borderRadius: 12, width: 280, elevation: 2 },
  physioText: { fontSize: 16, fontWeight: '600', color: Colors.text, marginLeft: 12 },

  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  healthCard: { backgroundColor: Colors.surface, padding: 20, borderRadius: 16, alignItems: 'center', width: 200, elevation: 3 },
  healthCardTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primaryDark, marginTop: 12, textAlign: 'center' },

  whyGrid: { flexDirection: 'column', gap: 15, maxWidth: 800, alignSelf: 'center' },
  whyCard: { flexDirection: 'row', backgroundColor: Colors.surface, padding: 20, borderRadius: 16, alignItems: 'center', elevation: 3 },
  whyIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  whyCardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 4 },
  whyCardDesc: { fontSize: 14, color: Colors.textLight },

  // Testimonials
  testimonialsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  testimonialCard: { backgroundColor: Colors.surface, width: 320, padding: 25, borderRadius: 20, elevation: 4 },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  testimonialAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  testimonialInitials: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' },
  testimonialMeta: { flex: 1 },
  testimonialName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 5 },
  testimonialFeedback: { fontSize: 15, color: Colors.textLight, fontStyle: 'italic', lineHeight: 22, marginBottom: 15 },
  testimonialService: { fontSize: 12, color: Colors.primaryDark, fontWeight: '600' },

  apptContainer: { flexDirection: 'row', gap: 40, maxWidth: 1000, alignSelf: 'center' },
  apptForm: { flex: 1, backgroundColor: Colors.surface, padding: 30, borderRadius: 20, elevation: 5 },
  apptInfo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { backgroundColor: '#F5F7F9', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  
  aboutCard: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: Colors.surface, padding: 40, borderRadius: 20, maxWidth: 900, alignSelf: 'center', alignItems: 'center', gap: 40, elevation: 4 },
  aboutImage: { width: 150, height: 150, borderRadius: 75, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: Colors.accentLight },
  aboutContent: { flex: 1, minWidth: 300 },
  aboutName: { fontSize: 28, fontWeight: 'bold', color: Colors.primaryDark },
  aboutSpec: { fontSize: 18, color: Colors.primary, fontWeight: '700', marginBottom: 15 },
  aboutDesc: { fontSize: 16, color: Colors.textLight, lineHeight: 26 },

  contactContainer: { 
    maxWidth: 750, 
    alignSelf: 'center', 
    backgroundColor: Colors.surface, 
    padding: 36, 
    borderRadius: 24, 
    elevation: 4, 
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 30,
  },
  contactDetails: { flex: 1, minWidth: 260 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  contactText: { fontSize: 16, color: Colors.text, marginLeft: 15 },
  
  whatsappButton: { backgroundColor: Colors.whatsapp, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 30, marginTop: 10 },
  whatsappButtonText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  contactLogoCol: { alignItems: 'center', justifyContent: 'center' },
  contactLogoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 3,
    borderColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  contactRoundLogo: {
    width: 134,
    height: 134,
    borderRadius: 67,
  },

  youtubeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF0000', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14, alignSelf: 'center', marginTop: 36, elevation: 5, shadowColor: '#FF0000', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  youtubeButtonTitle: { color: Colors.surface, fontSize: 17, fontWeight: 'bold' },
  youtubeButtonSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
});
