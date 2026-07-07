import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DriverApprovalScreen from '../screens/DriverApprovalScreen';
import StudentApprovalScreen from '../screens/StudentApprovalScreen';
import DriverDetailsScreen from '../screens/DriverDetailsScreen';
import StudentDetailsScreen from '../screens/StudentDetailsScreen';
import RouteManagementScreen from '../screens/RouteManagementScreen';
import PaymentsScreen from '../screens/PaymentsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="DriverApproval" component={DriverApprovalScreen} />
        <Stack.Screen name="StudentApproval" component={StudentApprovalScreen} />
        <Stack.Screen name="DriverDetails" component={DriverDetailsScreen} />
        <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
        <Stack.Screen name="RouteManagement" component={RouteManagementScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
