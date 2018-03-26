import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import InitialScreen from "./Views/InitialScreen";
import CredentialsScreen from "./Views/CredentialsScreen";
import SignupScreen from "./Views/SignupScreen";
import DashboardScreen from "./Views/DashboardScreen";
import ProfileScreen from "./Views/ProfileScreen";
import ScheduleScreen from "./Views/ScheduleScreen";
import MapScreen from "./Views/MapScreen";
import styles from "./Views/style";

const ACCESS_TOKEN = 'accessToken';

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
    Map: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "Initial"
  }
);

export default class App extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <RootStack />;
  }
}
