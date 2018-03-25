import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  Text,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import InitialScreen from "./Views/InitialScreen";
import CredentialsScreen from "./Views/CredentialsScreen";
import SignupScreen from "./Views/SignupScreen";
import DashboardScreen from "./Views/DashboardScreen";
import ProfileScreen from "./Views/ProfileScreen";
import ScheduleScreen from "./Views/ScheduleScreen";
import LocationScreen from "./Views/LocationScreen";
import styles from "./Views/style";

const RootStack = StackNavigator(
  {
    Initial: {
      screen: InitialScreen
    },
    Credentials: {
      screen: CredentialsScreen
    },
    Signup: {
      screen: SignupScreen
    },
    Dashboard: {
      screen: DashboardScreen
    },
    Profile: {
      screen: ProfileScreen
    },
    Schedule: {
      screen: ScheduleScreen
    },
    Location: {
      screen: LocationScreen
    }
  },
  {
    initialRouteName: "Initial"
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
