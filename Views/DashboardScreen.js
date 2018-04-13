import React from "react";
import {
  AppRegistry,
  Alert,
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
const background = require("./login3_bg.jpg");

const ACCESS_TOKEN = "accessToken";
const EMAIL = "email";
const USERID = "userID";

export default class DashboardScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextUserID: "",
      SwitchOnValueHolder: true,
      disabled: false,
      userID: this.props.navigation.state.params.userID
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
          TextUserID: responseJson.idUser
        });

        console.log("TextUserId: " + this.state.TextUserID);
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

    if (this.state.SwitchOnValueHolder == true) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
                alignItems: "center",
                padding: 20,
                marginTop: 20
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 50,
                  paddingTop: 10,
                  borderRadius: 10,
                  backgroundColor: "white"
                }}
              >
                <Text
                  style={{
                    color: "darkred",
                    fontFamily: "Quicksand",
                    fontSize: 30,
                    fontWeight: "400",
                    paddingBottom: 10
                  }}
                >
                  Dashboard
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                >
                  <Text
                    style={{
                      marginRight: 10,
                      fontFamily: "Quicksand",
                      fontWeight: "400",
                      color: "black"
                    }}
                  >
                    Driver
                  </Text>
                  <Switch
                    onValueChange={value => this.ShowAlert(value)}
                    activeText={""}
                    inActiveText={""}
                    disabled={false}
                    circleSize={30}
                    barHeight={30}
                    circleBorderWidth={3}
                    backgroundActive={"darkred"}
                    backgroundInactive={"#003399"}
                    circleActiveColor={"#cc0000"}
                    circleInActiveColor={"#1a75ff"}
                    style={{ transform: [{ scaleX: 10 }, { scaleY: 0.8 }] }}
                    value={this.state.SwitchOnValueHolder}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "Quicksand",
                      fontWeight: "400",
                      color: "black"
                    }}
                  >
                    Rider
                  </Text>
                </View>
              </View>
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
    } else {
      //driver render
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
                alignItems: "center",
                padding: 20,
                marginTop: 20
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 50,
                  paddingTop: 10,
                  borderRadius: 10,
                  backgroundColor: "white"
                }}
              >
                <Text
                  style={{
                    color: "darkred",
                    fontFamily: "Quicksand",
                    fontWeight: "400",
                    fontSize: 30,
                    paddingBottom: 10
                  }}
                >
                  Dashboard
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                >
                  <Text
                    style={{
                      marginRight: 10,
                      fontFamily: "Quicksand",
                      fontWeight: "400",
                      color: "black"
                    }}
                  >
                    Driver
                  </Text>
                  <Switch
                    onValueChange={value => this.ShowAlert(value)}
                    activeText={""}
                    inActiveText={""}
                    disabled={false}
                    circleSize={30}
                    barHeight={30}
                    circleBorderWidth={3}
                    backgroundActive={"darkred"}
                    backgroundInactive={"#003399"}
                    circleActiveColor={"#cc0000"}
                    circleInActiveColor={"#1a75ff"}
                    style={{ transform: [{ scaleX: 10 }, { scaleY: 0.8 }] }}
                    value={this.state.SwitchOnValueHolder}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "Quicksand",
                      fontWeight: "400",
                      color: "black"
                    }}
                  >
                    Rider
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 5, marginTop: 10, padding: 10 }}>
              <Button
                style={{
                  backgroundColor: "#0000b3",
                  borderColor: "#0000b3",
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
                    userID: this.state.userID
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
                Your Schedules
              </Button>
              <Button
                style={{
                  backgroundColor: "#1a1aff",
                  borderColor: "#1a1aff",
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
                Start Looking for Riders
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
    }
  }
}
