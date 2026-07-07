import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = 'SchuberAdmin';

export default function DashboardScreen({ navigation }) {
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState('ADMIN');
  const [loginTime, setLoginTime] = useState('');

  // Stats
  const [totalDrivers] = useState('12');
  const [totalStudents] = useState('45');
  const [pendingApprovals] = useState('3');
  const [activeRoutes] = useState('8');
  const [pendingDriversBadge] = useState('2');
  const [pendingStudentsBadge] = useState('3');

  useFocusEffect(
    useCallback(() => {
      checkAuth();
      loadAdminDetails();

      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => backHandler.remove();
    }, [])
  );

  const checkAuth = async () => {
    const isLoggedIn = await AsyncStorage.getItem(`${STORAGE_KEY}:isAdminLoggedIn`);
    if (isLoggedIn !== 'true') {
      navigation.replace('Login');
    }
  };

  const loadAdminDetails = async () => {
    const name = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_name`) || 'Admin';
    const email = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_email`) || '';
    const role = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_role`) || 'ADMIN';
    const timestamp = await AsyncStorage.getItem(`${STORAGE_KEY}:loginTimestamp`);

    setAdminName(name);
    setAdminEmail(email);
    setAdminRole(role.replace('_', ' '));

    if (timestamp) {
      const date = new Date(parseInt(timestamp));
      const formatted = date.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      });
      setLoginTime(`Last login: ${formatted}`);
    }
  };

  const handleBackPress = () => {
    Alert.alert('Exit', 'Do you want to exit the app?', [
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
      { text: 'No' },
    ]);
    return true;
  };

  const showLogoutDialog = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from Admin Panel?',
      [
        { text: 'Logout', style: 'destructive', onPress: performLogout },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const performLogout = async () => {
    await AsyncStorage.setItem(`${STORAGE_KEY}:isAdminLoggedIn`, 'false');
    navigation.replace('Login');
  };

  const navTo = (screen) => navigation.navigate(screen);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{adminName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.adminName}>{adminName}</Text>
            <Text style={styles.adminEmail}>{adminEmail}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{adminRole}</Text>
            </View>
            <Text style={styles.loginTime}>{loginTime}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total Drivers" value={totalDrivers} color="#3b82f6" />
          <StatCard label="Total Students" value={totalStudents} color="#10b981" />
          <StatCard label="Pending" value={pendingApprovals} color="#f59e0b" />
          <StatCard label="Active Routes" value={activeRoutes} color="#8b5cf6" />
        </View>

        {/* Menu Cards */}
        <Text style={styles.sectionTitle}>Management</Text>

        <MenuCard
          emoji="🚗"
          title="Driver Approval"
          subtitle="Review & approve driver requests"
          badge={pendingDriversBadge}
          color="#3b82f6"
          onPress={() => navTo('DriverApproval')}
        />
        <MenuCard
          emoji="🎓"
          title="Student Approval"
          subtitle="Review & approve student requests"
          badge={pendingStudentsBadge}
          color="#10b981"
          onPress={() => navTo('StudentApproval')}
        />
        <MenuCard
          emoji="👨‍🏫"
          title="Student Details"
          subtitle="View all student information"
          color="#06b6d4"
          onPress={() => navTo('StudentDetails')}
        />
        <MenuCard
          emoji="🚌"
          title="Driver Details"
          subtitle="View all driver information"
          color="#8b5cf6"
          onPress={() => navTo('DriverDetails')}
        />
        <MenuCard
          emoji="💳"
          title="Payments"
          subtitle="Manage subscriptions & transactions"
          color="#f59e0b"
          onPress={() => navTo('Payments')}
        />
        <MenuCard
          emoji="🗺️"
          title="Route Management"
          subtitle="Add, edit & manage bus routes"
          color="#ec4899"
          onPress={() => navTo('RouteManagement')}
        />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={showLogoutDialog} activeOpacity={0.85}>
          <Text style={styles.logoutText}>🔓  Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuCard({ emoji, title, subtitle, badge, color, onPress }) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.menuIcon, { backgroundColor: color + '22' }]}>
        <Text style={styles.menuEmoji}>{emoji}</Text>
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  headerInfo: { flex: 1 },
  adminName: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '700',
  },
  adminEmail: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#3b82f633',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginTime: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuEmoji: { fontSize: 22 },
  menuInfo: { flex: 1 },
  menuTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  menuArrow: {
    color: '#475569',
    fontSize: 22,
    fontWeight: '300',
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#7f1d1d33',
    borderWidth: 1,
    borderColor: '#ef444455',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
