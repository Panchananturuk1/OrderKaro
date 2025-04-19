// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { viewUserData, clearUserData } from '../utils/databaseViewer';

const DebugScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const result = await viewUserData();
      setUserData(result.userData);
      setAuthToken(result.authToken);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      const result = await clearUserData();
      if (result.success) {
        setMessage('User data cleared successfully!');
        setUserData(null);
        setAuthToken(null);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Debug Database</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current User Data</Text>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          ) : userData ? (
            <View style={styles.userDataContainer}>
              <DataItem label="User ID" value={userData.id} />
              <DataItem label="Name" value={userData.name} />
              <DataItem label="Email" value={userData.email} />
              <DataItem label="Phone" value={userData.phone} />
              <DataItem label="Created At" value={userData.created_at} />
              <DataItem
                label="Auth Token"
                value={authToken ? `${authToken.substring(0, 15)}...` : 'None'}
              />
            </View>
          ) : (
            <Text style={styles.emptyText}>No user data found</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Information</Text>
          <Text style={styles.infoText}>
            In this demo app, we're using AsyncStorage as our "database" to store user credentials.
            In a real application with PostgreSQL, you would typically:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Connect to your PostgreSQL database using a client library</Text>
            <Text style={styles.bulletPoint}>• Query the users table with SQL: SELECT * FROM users</Text>
            <Text style={styles.bulletPoint}>• Display results in a formatted table or list</Text>
          </View>
          <Text style={styles.infoText}>
            Your registered user data is stored locally on this device in AsyncStorage
            and is shown above if you're logged in.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadUserData}
          >
            <Ionicons name="refresh" size={18} color={COLORS.WHITE} />
            <Text style={styles.buttonText}>Refresh Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearData}
          >
            <Ionicons name="trash" size={18} color={COLORS.WHITE} />
            <Text style={styles.buttonText}>Clear User Data</Text>
          </TouchableOpacity>
        </View>

        {message ? <Text style={styles.messageText}>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const DataItem = ({ label, value }) => (
  <View style={styles.dataItem}>
    <Text style={styles.dataLabel}>{label}:</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.PRIMARY,
  },
  userDataContainer: {
    backgroundColor: COLORS.LIGHTER_GRAY,
    borderRadius: 8,
    padding: 12,
  },
  dataItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dataLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.GRAY,
  },
  dataValue: {
    flex: 2,
    color: COLORS.BLACK,
  },
  emptyText: {
    fontStyle: 'italic',
    color: COLORS.GRAY,
    textAlign: 'center',
    paddingVertical: 12,
  },
  infoText: {
    color: COLORS.BLACK,
    marginBottom: 12,
    lineHeight: 20,
  },
  bulletPoints: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  bulletPoint: {
    color: COLORS.BLACK,
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.RED,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: COLORS.WHITE,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  messageText: {
    textAlign: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: COLORS.LIGHTER_GRAY,
    borderRadius: 8,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default DebugScreen; 