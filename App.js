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
import SignupScreen from "./Views/SignupScreen";
import DashboardScreen from "./Views/DashboardScreen";
import ProfileScreen from "./Views/ProfileScreen";
import ScheduleScreen from "./Views/ScheduleScreen";
import LocationScreen from "./Views/LocationScreen";
import RideListScreen from "./Views/RideListScreen";
import FindRideScreen from "./Views/FindRideScreen";

import RideDetailsScreen from "./Views/RideDetailsScreen";
import DriverScheduleScreen from "./Views/DriverScheduleScreen";

import styles from "./Views/style";

const ACCESS_TOKEN = "accessToken";

const RootStack = StackNavigator(
  {
    Initial: {
      screen: InitialScreen
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
    RideList: {
      screen: RideListScreen
    },
    RideDetails: {
      screen: RideDetailsScreen
    },
    FindRide: {
      screen: FindRideScreen
    },
    Location: {
      screen: LocationScreen
    },
    DriverSchedule: {
      screen: DriverScheduleScreen
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
