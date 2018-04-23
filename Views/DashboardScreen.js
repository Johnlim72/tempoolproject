import React from "react";
import {
  AppRegistry,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import { Switch } from "react-native-switch";
import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");
const background = require("./dark.jpg");

const ACCESS_TOKEN = "accessToken";
const EMAIL = "email";
const USERID = "userID";

export default class DashboardScreen extends React.Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      userID: this.props.navigation.state.params.userID,
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextUserID: "",
      SwitchOnValueHolder: true,
      disabled: false,
      status: ""
    };
  }

  async deleteToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(USERID);
      await AsyncStorage.removeItem(EMAIL);
      this.props.navigation.navigate("Initial");
    } catch (error) {
      Alert.alert("An error occurred: " + error);
    }
  }

  ShowAlert = value => {
    this.setState({
      SwitchOnValueHolder: value
    });

    if (value == true) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  };

  getUserAndNavToList() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getUser.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driver_email: this.props.navigation.state.params.TextEmail
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextUserID: responseJson.idUser,
          status: responseJson.status
        });

        fetch("http://cis-linux2.temple.edu/~tuf41055/php/checkForQueue.php", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userID: responseJson.idUser
          })
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log("responseJson: ", responseJson);
          })

          .catch(error => {
            console.error(error);
          });

        fetch(
          "http://cis-linux2.temple.edu/~tuf41055/php/checkForStillLooking.php",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userID: responseJson.idUser
            })
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            console.log("responseJson: ", responseJson);
          })

          .catch(error => {
            console.error(error);
          });

        console.log("TextUserId: " + this.state.TextUserID);

        console.log(responseJson.status);

        fetch(
          "http://cis-linux2.temple.edu/~tuf41055/php/checkForMatchedRide.php",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userID: this.state.TextUserID,
              status: responseJson.status
            })
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson == "Rider") {
              Alert.alert(
                "Matched a ride for you!",
                "Press OK to see the ride!",
                [
                  {
                    text: "OK",
                    onPress: () =>
                      this.props.navigation.navigate("RiderRideList", {
                        TextEmail: this.state.TextEmail,
                        TextUserID: this.state.userID
                      })
                  }
                ],
                { cancelable: false }
              );
            } else if (responseJson == "Driver") {
              Alert.alert(
                "Matched a ride for you!",
                "Press OK to see the ride!",
                [
                  {
                    text: "OK",
                    onPress: () =>
                      this.props.navigation.navigate("RideList", {
                        TextEmail: this.state.TextEmail,
                        TextUserID: this.state.userID
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
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.getUserAndNavToList();
  }
  render() {
    const { goBack } = this.props.navigation;

    if (this.state.status == "Rider") {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
                alignItems: "center",
                padding: 20,
                marginTop: 20
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Quicksand",
                  fontSize: 40,
                  fontWeight: "400",
                  paddingBottom: 10,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                  textShadowColor: "#000000"
                }}
              >
                Dashboard
              </Text>
            </View>
            <View style={{ flex: 5, marginTop: 10, padding: 10 }}>
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
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder,
                    userID: this.state.userID,
                    findRideNow: true
                  })
                }
              >
                Find a Ride
              </Button>
              <Button
                style={{
                  backgroundColor: "#b30000",
                  borderColor: "#b30000",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder,
                    userID: this.state.userID,
                    findRideNow: false
                  })
                }
              >
                Schedule a Ride
              </Button>
              <Button
                style={{
                  backgroundColor: "#e60000",
                  borderColor: "#e60000",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("RiderScheduleList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.TextUserID
                  })
                }
              >
                Your Rider Schedules
              </Button>

              <Button
                style={{
                  backgroundColor: "#4d4dff",
                  borderColor: "#4d4dff",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("RiderRideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.TextUserID
                  })
                }
              >
                List of Rides
              </Button>
              <Button
                style={{
                  backgroundColor: "#ff6666",
                  borderColor: "#ff6666",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
              >
                Profile
              </Button>
              <Button
                style={{
                  backgroundColor: "white",
                  borderColor: "white",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "darkred",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={this.deleteToken.bind(this)}
              >
                Logout
              </Button>
            </View>
          </ImageBackground>
        </View>
      );
    } else if (this.state.status == "Driver") {
      //driver render
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
                alignItems: "center",
                padding: 20,
                marginTop: 20
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400",
                  fontSize: 40,
                  paddingBottom: 10,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                  textShadowColor: "#000000"
                }}
              >
                Dashboard
              </Text>
            </View>
            <View style={{ flex: 5, marginTop: 10, padding: 10 }}>
              <Button
                style={{
                  backgroundColor: "#000066",
                  borderColor: "#000066",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder,
                    userID: this.state.userID,
                    driverNowOrLater: "Now"
                  })
                }
              >
                Pick Up a Rider Now
              </Button>
              <Button
                style={{
                  backgroundColor: "#000099",
                  borderColor: "#000099",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder,
                    userID: this.state.userID,
                    driverNowOrLater: "Later"
                  })
                }
              >
                Input a Schedule
              </Button>
              <Button
                style={{
                  backgroundColor: "#0000e6",
                  borderColor: "#0000e6",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("ScheduleList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.TextUserID
                  })
                }
              >
                Your Driver Schedules
              </Button>

              <Button
                style={{
                  backgroundColor: "#4d4dff",
                  borderColor: "#4d4dff",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("RideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.state.TextUserID
                  })
                }
              >
                List of Rides
              </Button>
              <Button
                style={{
                  backgroundColor: "#8080ff",
                  borderColor: "#8080ff",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
              >
                Profile
              </Button>
              <Button
                style={{
                  backgroundColor: "white",
                  borderColor: "white",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "navy",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={this.deleteToken.bind(this)}
              >
                Logout
              </Button>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ImageBackground
            source={background}
            style={styles.background}
            resizeMode="cover"
          >
            <ActivityIndicator size="large" color="white" />
          </ImageBackground>
        </View>
      );
    }
  }
}
