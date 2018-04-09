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

export default class FindRideScreen extends React.Component {
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
    };
  }

  findDriver() {
    fetch(
      "http://cis-linux2.temple.edu/~tuf70921/php/get_drivers_within_schedule.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: this.state.address,
          longitude: this.state.longitude,
          latitude: this.state.latitude,
          userID: this.state.userID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Alert.alert(responseJson.toString());
        //Alert.alert("num_rows: " + responseJson.num_rows);
        console.log("drivers: ", responseJson);
        if (responseJson.num_rows > 0) {
          this.setState({
            list1: responseJson
          });
          this.findShortDriver();
        } else {
          Alert.alert("No drivers leaving soon");
        }
        //Alert.alert(responseJson.toString());

      })
      .catch(error => {
        Alert.alert(error.toString());
      });
  }

  findShortDriver() {
    //console.log("list1: ", this.state.list1);
    var count = this.state.list1.rows.length;

    var distance;
    var min;
    var minUser;

    if (count > 0) {
      for (var i = 0; i < count; i++) {
        distance = geolib.getDistance(
          {
            latitude: this.state.list1.rows[i].latitude,
            longitude: this.state.list1.rows[i].longitude
          },
          { latitude: this.state.latitude, longitude: this.state.longitude }
        );
        console.log(
          "userID: " +
            this.state.list1.rows[i].userID +
            ", distance: " +
            distance
        );
        if (i == 0) {
          min = distance;
          minUser = i;
        } else if (distance < min) {
          min = distance;
          minUser = i;
        }
      }
      console.log(
        "shortest distance is " +
          min +
          ", which is user: " +
          this.state.list1.rows[minUser].userID
      );
      this.setState({
        driverID: this.state.list1.rows[minUser].userID,
      });
      console.log("driverID: " + this.state.driverID);
      this.insertRideToServer();
    }
  }

  insertRideToServer() {

    fetch("http://cis-linux2.temple.edu/~tuf70921/php/submit_ride_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rider_address: this.state.address,
        rider_loc_lat: this.state.latitude,
        rider_loc_long: this.state.longitude,
        riderID: this.state.userID,
        driverID: this.state.driverID,
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson.error == 0) {
          this.setState({
            rideID: responseJson.rideID,
          });

          var timer = setInterval(() => {
            fetch("http://cis-linux2.temple.edu/~tuf70921/php/check_if_accepted.php", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                rideID: this.state.rideID,
              })
            })
            .then(response => response.json())
            .then(responseJson => {

              if(responseJson.error == 0) {
                this.setState({
                  status: responseJson.status,
                });
              } else {
                Alert.alert("Error");
                status = "Error";
              }

              if(this.state.status === "Accepted") {
                Alert.alert("status: " + responseJson.status);
                this.setState({
                  loader: false,
                  acceptedRide: true,
                  driverName: responseJson.driverName,
                  driverEmail: responseJson.driverEmail,
                  driverPhoneNumber: responseJson.driverPhoneNumber,
                });



                // Alert.alert(
                //   "Success!",
                //   "Potential Ride Inserted",
                //   [
                //     {
                //       text: "OK",
                //       onPress: () =>
                //         this.props.navigation.navigate("Dashboard", {
                //           TextEmail: this.props.navigation.state.params.TextEmail.toString()
                //         })
                //     }
                //   ],
                //   { cancelable: false }
                // );
                clearInterval(timer);
              }
            })
            .catch(error => {
              Alert.alert("Error: " + error.toString());
            });
          }, 10000);
        } else {
          Alert.alert("Error. " + responseJson.errorMessage);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.findDriver();
  }

  renderDriver() {
    if(this.state.acceptedRide == true) {
      return (
        <View>
        <Text>Driver: {this.state.driverName}</Text>
        <Text>Email: {this.state.driverEmail}</Text>
        <Text>Phone Number: {this.state.driverPhoneNumber}</Text>
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
                  fontFamily: "Futura",
                  fontSize: 30,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Loading...
              </Text>
            ) : (
              <Text
                style={{
                  color: "white",
                  fontFamily: "Futura",
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
                flex: 1,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                margin: 10
              }}
            >
              { this.renderDriver() }
              </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
