import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
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
import Button from "apsl-react-native-button";

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
      ride_ID: null,
      status: "Not Found",
      riderRequested: false,
      driverName: "",
      driverEmail: "",
      driverPhoneNumber: "",
      TextRiderEmail: "",
      TextRiderFirstName: "",
      TextRiderLastName: "",
      TextRiderPhoneNumber: "",
      riderID: "",
      rider_address: "",
      rider_loc_lat: "",
      rider_loc_long: "",
      rider_datetime: "",
      driverID: "",
      driverScheduleID: "",
      driver_address: "",
      driver_latitude: "",
      driver_longitude: "",
      acceptedOrPotential: ""
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
          driverScheduleID: this.props.navigation.state.params.rowData.idDriver
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

          if (this.state.status === "Found") {
            this.setState({
              loader: false,
              riderRequested: true,
              ride_ID: responseJson.ride_ID,
              riderID: responseJson.riderID,
              rider_address: responseJson.rider_address,
              rider_loc_lat: responseJson.rider_loc_lat,
              rider_loc_long: responseJson.rider_loc_long,
              rider_datetime: responseJson.rider_datetime,
              driverID: responseJson.driverID,
              driverScheduleID: responseJson.driverScheduleID,
              driver_address: responseJson.driver_address,
              driver_latitude: responseJson.driver_latitude,
              driver_longitude: responseJson.driver_longitude
            });

            this.getRider();
            clearInterval(timer);
          }
        })
        .catch(error => {
          Alert.alert("Error: " + error.toString());
        });
    }, 10000);
  }

  updateRide(acceptedOrPotential) {
    this.setState({ acceptedOrPotential: acceptedOrPotential });
    console.log("acceptedOrPotential: " + acceptedOrPotential);
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/updateRide.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ride_ID: this.state.ride_ID,
        acceptedOrPotential: acceptedOrPotential
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Ride Accepted.") {
          Alert.alert(
            "Success!",
            "Ride Accepted.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("RideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.driverID
                  })
              }
            ],
            { cancelable: false }
          );
        } else if (responseJson == "Ride Declined.") {
          Alert.alert(
            "Success!",
            "Ride Declined.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("RideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.driverID
                  })
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  getRider() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getRiderForList.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        riderID: this.state.riderID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          TextRiderEmail: responseJson.email,
          TextRiderFirstName: responseJson.firstName,
          TextRiderLastName: responseJson.lastName,
          TextRiderPhoneNumber: responseJson.phoneNumber
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.waitForRequest();
  }

  renderRide() {
    if (this.state.riderRequested == true) {
      return (
        <View>
          <View>
            <Text
              style={[
                styles.textViewContainer,
                {
                  marginBottom: 20,
                  fontSize: 30,
                  fontFamily: "Quicksand"
                }
              ]}
            >
              {"Ride Details"}
            </Text>
            <Text style={styles.textViewContainer2}>{"Name"}</Text>
            <Text style={styles.textViewContainer}>
              {this.state.TextRiderFirstName +
                " " +
                this.state.TextRiderLastName}
            </Text>
            <Text style={styles.textViewContainer2}>{"Email"}</Text>
            <Text style={styles.textViewContainer}>
              {this.state.TextRiderEmail}
            </Text>
            <Text style={styles.textViewContainer2}>{"Pickup Time"}</Text>
            <Text style={styles.textViewContainer}>
              {this.state.rider_datetime}
            </Text>
            <Text style={styles.textViewContainer2}>{"Address"}</Text>
            <Text style={styles.textViewContainer}>
              {this.state.rider_address}
            </Text>
          </View>

          <Button
            style={{
              backgroundColor: "darkred",
              borderColor: "darkred",
              borderRadius: 22,
              borderWidth: 2
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={
              () => this.updateRide("Accepted")
              // () =>
              // this.props.navigation.navigate("RideList", {
              //   TextEmail: this.props.navigation.state.params.TextEmail,
              //   TextUserID: this.props.navigation.state.params
              //     .ListViewClickItemHolder
              // }),
            }
          >
            Accept
          </Button>

          <Button
            style={{
              backgroundColor: "darkred",
              borderColor: "darkred",
              borderRadius: 22,
              borderWidth: 2
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={
              () => this.updateRide("Declined")
              // () =>
              // this.props.navigation.navigate("RideList", {
              //   TextEmail: this.props.navigation.state.params.TextEmail,
              //   TextUserID: this.props.navigation.state.params
              //     .ListViewClickItemHolder
              // })
            }
          >
            Decline
          </Button>
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
                Found Rider
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
