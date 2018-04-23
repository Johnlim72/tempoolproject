import React from "react";
import {
  AppRegistry,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Button,
  ImageBackground,
  Dimensions,
  View,
  Text,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import geolib from "geolib";
import haversine from "haversine";
import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import pick from "lodash/pick";

const { width, height } = Dimensions.get("window");
const background = require("./dark.jpg");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";

const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class FindRideScreen extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      userID: this.props.navigation.state.params.TextUserID,
      ride_ID: "",
      rider_address: "",
      rider_loc_lat: "",
      rider_loc_long: "",
      rider_datetime: "",
      acceptedOrPotential: "",
      driverID: "",
      driver_address: "",
      driver_latitude: "",
      driver_longitude: "",
      completed: "",
      currLatitude: "",
      currLongitude: "",
      pickedUpRider: "",
      completedRide: "",
      startedRide: ""
    };
  }

  componentDidMount() {
    this.checkIfStarted();
  }

  goBacktoDashboard() {
    clearInterval(this.timer);
    this.props.navigation.navigate("Dashboard", {
      userID: this.props.navigation.state.params.userID,
      TextEmail: this.props.navigation.state.params.TextEmail
    });
  }

  getRide() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getMatchedRideInfo.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          ride_ID: responseJson.ride_ID,
          rider_address: responseJson.rider_address,
          rider_loc_lat: responseJson.rider_loc_lat,
          rider_loc_long: responseJson.rider_loc_long,
          rider_datetime: responseJson.rider_datetime,
          acceptedOrPotential: responseJson.acceptedOrPotential,
          driverID: responseJson.driverID,
          driver_address: responseJson.driver_address,
          driver_latitude: responseJson.driver_latitude,
          driver_longitude: responseJson.driver_longitude,
          completed: responseJson.completed,
          currLatitude: responseJson.currLatitude,
          currLongitude: responseJson.currLongitude,
          pickedUpRider: responseJson.pickedUpRider,
          completedRide: responseJson.completedRide,
          startedRide: responseJson.startedRide
        });
      })
      .catch(error => {
        Alert.alert("Error: " + error.toString());
      });
  }

  checkIfStarted() {
    this.timer = setInterval(() => {
      fetch("http://cis-linux2.temple.edu/~tuf41055/php/checkIfStarted.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID: this.state.userID
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson == "Started") {
            this.setState({ startedRide: true });
            this.getRide();
            Alert.alert(
              "Driver has started ride!",
              "Click OK to view ride",
              [
                {
                  text: "OK",
                  onPress: () =>
                    this.props.navigation.navigate("ViewMatchedDriver", {
                      userID: this.props.navigation.state.params.userID,
                      TextEmail: this.props.navigation.state.params.TextEmail,
                      ride_ID: this.state.ride_ID,
                      rider_address: this.state.rider_address,
                      rider_loc_lat: this.state.rider_loc_lat,
                      rider_loc_long: this.state.rider_loc_long,
                      rider_datetime: this.state.rider_datetime,
                      acceptedOrPotential: this.state.acceptedOrPotential,
                      driverID: this.state.driverID,
                      driver_address: this.state.driver_address,
                      driver_latitude: this.state.driver_latitude,
                      driver_longitude: this.state.driver_longitude,
                      completed: this.state.completed,
                      currLatitude: this.state.currLatitude,
                      currLongitude: this.state.currLongitude,
                      pickedUpRider: this.state.pickedUpRider,
                      completedRide: this.state.completedRide,
                      startedRide: this.state.startedRide
                    })
                }
              ],
              { cancelable: false }
            );
            clearInterval(this.timer);
          } else {
            Alert.alert(
              "Driver has not started ride",
              "Click OK to keep waiting or Cancel to go back to dashboard",
              [
                {
                  text: "OK"
                },
                {
                  text: "Cancel",
                  onPress: () => this.goBacktoDashboard()
                }
              ],
              { cancelable: false }
            );
          }
        })
        .catch(error => {
          Alert.alert("Error: " + error.toString());
        });
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "darkred",
          justifyContent: "center"
        }}
      >
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
          blurRadius={3}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Quicksand",
                fontSize: 28,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                textShadowColor: "#000000"
              }}
            >
              Checking for your Driver...
            </Text>
            <ActivityIndicator size="large" color="white" />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles1 = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  navBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: 64,
    width: width,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  navBarText: {
    color: "#19B5FE",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 30
  },
  map: {
    width: width,
    height: height - 80
  },
  bottomBar: {
    position: "absolute",
    height: 100,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: width,
    padding: 10,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  bottomBarGroup: {
    flex: 1
  },
  bottomBarHeader: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center"
  },
  bottomBarContent: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#ff6666",
    textAlign: "center"
  },
  bottomBarContent2: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#19B5FE",
    textAlign: "center"
  },
  bottomBarContent3: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "yellow",
    textAlign: "center"
  },
  topBar: {
    position: "absolute",
    height: 70,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: width,
    padding: 10,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  topBarGroup: {
    flex: 1
  },
  topBarHeader: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center"
  },
  topBarContent: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#19B5FE",
    textAlign: "center"
  }
});
