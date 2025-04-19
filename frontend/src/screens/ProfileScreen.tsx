// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { COLORS, SCREEN_PADDING, BORDER_RADIUS, APP_NAME } from '../utils/constants';
import { RootState } from '../redux/store';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // If user is missing, use a default user for demo purposes
  const userInfo = user || {
    id: 'demo-user',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    addresses: [
      {
        id: 'addr1',
        type: 'Home',
        address: '123 Main Street, Apt 4B, New York',
        is_default: true,
      },
      {
        id: 'addr2',
        type: 'Work',
        address: '456 Business Ave, Suite 100, New York',
        is_default: false,
      },
    ],
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await dispatch(logout()).unwrap();
              // Navigation will be handled by the AppNavigation component
              // based on the authentication state
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  const navigateToEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Navigate to edit profile');
  };
  
  const navigateToAddresses = () => {
    // Navigate to addresses screen
    console.log('Navigate to addresses');
  };
  
  const navigateToOrders = () => {
    // Navigate to orders screen
    navigation.navigate('Orders');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userContact}>{userInfo.phone}</Text>
            <Text style={styles.userContact}>{userInfo.email}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile}>
            <Ionicons name="pencil" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
        
        {/* Address Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="location-outline" size={22} color={COLORS.PRIMARY} />
              <Text style={styles.sectionTitle}>Saved Addresses</Text>
            </View>
            <TouchableOpacity onPress={navigateToAddresses}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {userInfo.addresses.map((address) => (
            <View key={address.id} style={styles.addressItem}>
              <View style={styles.addressTypeContainer}>
                <Ionicons 
                  name={address.type === 'Home' ? 'home-outline' : 'business-outline'} 
                  size={18} 
                  color={COLORS.WHITE} 
                />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressType}>{address.type}</Text>
                <Text style={styles.addressText} numberOfLines={2}>{address.address}</Text>
              </View>
              <TouchableOpacity style={styles.addressAction}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        {/* Orders Section */}
        <TouchableOpacity style={styles.menuItem} onPress={navigateToOrders}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.menuText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
        </TouchableOpacity>
        
        {/* Payment Section */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
        </TouchableOpacity>
        
        {/* Debug Database Section */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Debug')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="code-outline" size={20} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.menuText}>View User Database</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
        </TouchableOpacity>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsHeader}>Settings</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.menuText}>Push Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: COLORS.LIGHT_GRAY, true: COLORS.PRIMARY + '80' }}
              thumbColor={notificationsEnabled ? COLORS.PRIMARY : COLORS.WHITE}
              ios_backgroundColor={COLORS.LIGHT_GRAY}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="moon-outline" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: COLORS.LIGHT_GRAY, true: COLORS.PRIMARY + '80' }}
              thumbColor={darkModeEnabled ? COLORS.PRIMARY : COLORS.WHITE}
              ios_backgroundColor={COLORS.LIGHT_GRAY}
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="language-outline" size={20} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.menuText}>About {APP_NAME}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>
        </View>
        
        {/* Logout Section */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.WHITE} />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    padding: SCREEN_PADDING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHTER_GRAY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  backButton: {
    padding: 4,
  },
  placeholderView: {
    width: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    marginBottom: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  userContact: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 2,
  },
  editButton: {
    padding: 8,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginLeft: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHTER_GRAY,
  },
  addressTypeContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  addressAction: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  settingsSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHTER_GRAY,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginRight: 4,
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: COLORS.RED,
    borderRadius: BORDER_RADIUS,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.LIGHT_GRAY,
    marginBottom: 20,
  },
});

export default ProfileScreen; 