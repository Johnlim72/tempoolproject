import React from "react";
import {
  AppRegistry,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
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
const background = require("./dark.jpg");

export default class PickUpRiderNowScreen extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false,
    header: null
  };

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
      driverEmail: this.props.navigation.state.params.TextEmail,
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

    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/submitDriverReturnDriver.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          driver_address: this.state.address,
          driver_latitude: this.state.latitude,
          driver_longitude: this.state.longitude,
          userID: this.state.userID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        console.log("driver from submitDriverReturnDriver", responseJson);
        this.setState({
          driverScheduleID: responseJson.idDriver
        });

        this.updateScheduleForLooking();
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateScheduleForLooking() {
    //looking
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateScheduleForLooking.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idDriver: this.state.driverScheduleID,
          looking: "Looking"
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Schedule successfully updated to looking.") {
          console.log(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateScheduleForNotLooking() {
    //not looking
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateScheduleForLooking.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idDriver: this.state.driverScheduleID,
          looking: "Not Looking"
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Schedule successfully updated to looking.") {
          console.log(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.waitForRequest();
  }

  waitForRequest() {
    this.timer = setInterval(() => {
      fetch("http://cis-linux2.temple.edu/~tuf41055/php/checkForRequest.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          driverScheduleID: this.state.driverScheduleID
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
            this.updateScheduleForNotLooking();
            this.getRider();
            clearInterval(this.timer);
          }
        })
        .catch(error => {
          Alert.alert("Error: " + error.toString());
        });
      console.log("in setInterval");
    }, 10000);
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

  updateRide(acceptedOrPotential) {
    this.setState({ acceptedOrPotential: acceptedOrPotential });
    console.log("acceptedOrPotential: " + acceptedOrPotential);
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/updateRideFindNow.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ride_ID: this.state.ride_ID,
        acceptedOrPotential: acceptedOrPotential,
        driver_latitude: this.state.driver_latitude,
        driver_longitude: this.state.driver_longitude
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Ride Declined.") {
          Alert.alert(
            "Ride Declined",
            "Do you want to keep looking for other riders?",
            [
              {
                text: "Yes",
                onPress: () =>
                  this.props.navigation.navigate("PickUpRiderNow", {
                    TextAddress: this.state.address,
                    TextLatitude: this.state.latitude,
                    TextLongitude: this.state.longitude,
                    TextEmail: this.state.driverEmail,
                    userID: this.state.userID
                  })
              },
              {
                text: "No",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    userID: this.state.driverID
                  })
              }
            ],
            { cancelable: false }
          );
        }
        this.updateScheduleForNotLooking();
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    clearInterval(this.timer);

    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateScheduleForLooking.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idDriver: this.state.driverScheduleID,
          looking: "Not Looking"
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Schedule successfully updated to looking.") {
          console.log(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  goToRideScreen() {
    this.updateRide("Accepted");
    this.props.navigation.navigate("AltViewDirections", {
      ride_ID: this.state.ride_ID,
      driver_address: this.state.driver_address,
      rider_address: this.state.rider_address,
      rider_loc_lat: this.state.rider_loc_lat,
      rider_loc_long: this.state.rider_loc_long,
      driver_latitude: this.state.driver_latitude,
      driver_longitude: this.state.driver_longitude,
      TextRiderFirstName: this.state.TextRiderFirstName,
      TextRiderLastName: this.state.TextRiderLastName,
      TextRiderEmail: this.state.TextRiderEmail,
      TextRiderPhoneNumber: this.state.TextRiderPhoneNumber,
      userID: this.state.userID,
      TextEmail: this.state.driverEmail
    });
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
              backgroundColor: "green",
              borderColor: "green",
              borderRadius: 22,
              borderWidth: 2,
              marginTop: 20
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={() =>
              Alert.alert(
                "Warning",
                "Pressing 'OK' will accept and start your ride now",
                [
                  {
                    text: "OK",
                    onPress: () => this.goToRideScreen()
                  },
                  {
                    text: "Cancel"
                  }
                ],
                { cancelable: false }
              )
            }
          >
            Start Ride Now
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
          blurRadius={3}
        >
          <View
            style={{
              flex: 0.1,
              margin: 10,
              marginTop: 20,
              marginBottom: 0
            }}
          >
            <Button
              style={{
                borderColor: "black",
                borderRadius: 22,
                borderWidth: 2,
                width: "10%"
              }}
              textStyle={{
                fontSize: 18,
                color: "white",
                fontFamily: "Quicksand",
                fontWeight: "400"
              }}
              onPress={() =>
                this.props.navigation.navigate("Dashboard", {
                  TextEmail: this.props.navigation.state.params.TextEmail,
                  Status: this.state.SwitchOnValueHolder,
                  userID: this.state.userID,
                  findRideNow: false
                })
              }
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("./home.png")}
              />
            </Button>
          </View>
          {this.state.loader ? (
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
                  fontSize: 35,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                  textShadowColor: "#000000"
                }}
              >
                Waiting for Request...
              </Text>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
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
                  fontSize: 35,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                  textShadowColor: "#000000"
                }}
              >
                Found Rider
              </Text>
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
          )}
        </ImageBackground>
      </View>
    );
  }
}
