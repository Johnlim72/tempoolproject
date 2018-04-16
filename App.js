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
import UpdateLocationScreen from "./Views/UpdateLocationScreen";
import ViewDirectionsScreen from "./Views/ViewDirectionsScreen";
import ScheduleListScreen from "./Views/ScheduleListScreen";
import UpdateScheduleScreen from "./Views/UpdateScheduleScreen";
import MapScreen from "./Views/MapScreen";
import TrackScreen from "./Views/TrackScreen";
import StartLookingScreen from "./Views/StartLookingScreen";
import DriverLookingScreen from "./Views/DriverLookingScreen";
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
    },
    Map: {
      screen: MapScreen
    },
    Track: {
      screen: TrackScreen
    },
    ViewDirections: {
      screen: ViewDirectionsScreen
    },
    ScheduleList: {
      screen: ScheduleListScreen
    },
    UpdateSchedule: {
      screen: UpdateScheduleScreen
    },
    UpdateLocation: {
      screen: UpdateLocationScreen
    },
    StartLooking: {
      screen: StartLookingScreen
    },
    DriverLooking: {
      screen: DriverLookingScreen
    }
  },
  {
    initialRouteName: "Track"
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
