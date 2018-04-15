import React from "react";
import {
  AppRegistry,
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

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class DriverLookingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.navigation.state.params.TextAddress,
      longitude: this.props.navigation.state.params.TextLongitude,
      latitude: this.props.navigation.state.params.TextLatitude,
      userID: this.props.navigation.state.params.userID,
      list1: [],
      loader: true,
      driverID: null,
      rideID: null,
      status: "Potential",
      acceptedRide: false,
      driverName: "",
      driverEmail: "",
      driverPhoneNumber: "",
      driver_address: "",
      driver_longitude: "",
      driver_latitude: ""
    };
  }

  waitForRequest() {
    var timer = setInterval(() => {
      fetch("http://cis-linux2.temple.edu/~tuf41055/php/checkForRequest.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          driverID: this.state.userID
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error == 0) {
            this.setState({
              status: responseJson.status
            });
          } else {
            Alert.alert("Error");
            status = "Error";
          }

          if (this.state.status === "Accepted") {
            Alert.alert("status: " + responseJson.status);
            this.setState({
              loader: false,
              acceptedRide: true,
              driverName: responseJson.driverName,
              driverEmail: responseJson.driverEmail,
              driverPhoneNumber: responseJson.driverPhoneNumber
            });

            clearInterval(timer);
          }
        })
        .catch(error => {
          Alert.alert("Error: " + error.toString());
        });
    }, 10000);
  }

  componentDidMount() {
    this.waitForRequest();
  }

  renderRide() {
    if (this.state.acceptedRide == true) {
      return (
        <View>
          <Text
            style={{
              fontFamily: "Quicksand",
              fontSize: 30,
              paddingTop: 20
            }}
          >
            Driver: {this.state.driverName}
          </Text>
          <Text
            style={{
              fontFamily: "Quicksand",
              fontSize: 30,
              paddingTop: 20
            }}
          >
            Email: {this.state.driverEmail}
          </Text>
          <Text
            style={{
              fontFamily: "Quicksand",
              fontSize: 30,
              paddingTop: 20
            }}
          >
            Phone Number: {this.state.driverPhoneNumber}
          </Text>
        </View>
      );
    }
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
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.loader ? (
              <Text
                style={{
                  color: "white",
                  fontFamily: "Quicksand",
                  fontSize: 30,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Waiting for Request...
              </Text>
            ) : (
              <Text
                style={{
                  color: "white",
                  fontFamily: "Quicksand",
                  fontSize: 30,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Find a Ride
              </Text>
            )}
          </View>

          <View style={{ flex: 5 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                margin: 10
              }}
            >
              {this.renderRide()}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
