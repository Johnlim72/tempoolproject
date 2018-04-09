import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
  AsyncStorage
} from "react-native";

import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import DatePicker from "react-native-datepicker";
import geolib from "geolib";
import styles from "./style";
import DateTimePicker from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

const USERID = "userID";

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    isDateTimePickerVisible: false,
    chosenDate: null,
    userID: null
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    //Alert.alert(date.toTimeString());
    this.state.chosenDate = date;
    this._hideDateTimePicker();
  };

  async getToken() {
    try {
      let userID = await AsyncStorage.getItem(USERID);
      console.log("userID in gettoken: " + userID);
      if (userID) {
        this.state.userID = userID;
        this.Insert();
      }
    } catch (error) {
      console.log("Something went wrong");
      Alert.alert("An Error occurred: " + error);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      TextEmail: this.props.navigation.state.params.TextEmail.toString(),
      TextAddress: this.props.navigation.state.params.TextAddress.toString(),
      TextLatitude: this.props.navigation.state.params.TextLatitude,
      TextLongitude: this.props.navigation.state.params.TextLongitude,
      TextDate: "03-25-2018",
      Status: this.props.navigation.state.params.Status,
      StatusText: "",
      userID: this.props.navigation.state.params.userID,
      FindOrSchedule: this.props.navigation.state.params.FindOrSchedule,
      FindOrScheduleText: "",
      chosenDate: null,
      URL: "",
      matchedTimesList: [
        { latitude: 39.4998492, longitude: -75.1642928 },
        { latitude: 39.9440539, longitude: -75.1687654 },
        { latitude: 39.9782995, longitude: -75.1575448 }
      ]
    };

    if (this.state.Status == true) {
      this.state.StatusText = "Rider";
    } else {
      this.state.StatusText = "Driver";
    }

    if (this.state.FindOrSchedule == "Find") {
      this.state.FindOrScheduleText = "Find a Ride Now";
    } else {
      this.state.FindOrScheduleText = "Schedule a Ride For Later";
    }
  }

  InsertRiderToServer = () => {
    const { TextEmail } = this.state;
    const { TextAddress } = this.state;
    const { TextLatitude } = this.state;
    const { TextLongitude } = this.state;
    const { TextDate } = this.state;

    fetch("http://cis-linux2.temple.edu/~tuf70921/php/submit_rider_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rideDateTime: this.state.chosenDate,
        rider_address: TextAddress.toString(),
        rider_latitude: TextLatitude.toString(),
        rider_longitude: TextLongitude.toString(),
        userID: this.state.userID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Rider successfully inserted.") {
          Alert.alert(
            "Success!",
            "Rider inserted",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail.toString()
                  })
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(responseJson.toString());
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  InsertDriverToServer = () => {
    const { TextEmail } = this.state;
    const { TextAddress } = this.state;
    const { TextLatitude } = this.state;
    const { TextLongitude } = this.state;
    const { TextDate } = this.state;

    console.log("insertdrivertoserver driver id: " + this.state.userID);

    fetch("http://cis-linux2.temple.edu/~tuf70921/php/submit_driver_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rideDateTime: this.state.chosenDate,
        driver_address: TextAddress.toString(),
        driver_latitude: TextLatitude.toString(),
        driver_longitude: TextLongitude.toString(),
        userID: this.state.userID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Driver successfully inserted.") {
          Alert.alert(
            "Success!",
            "Driver inserted",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail.toString()
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
  };

  Insert = () => {
    if (this.state.StatusText == "Rider") {
      this.InsertRiderToServer();
    } else {
      this.InsertDriverToServer();
    }
  };

  PickLocation = () => {
    this.props.navigation.navigate("Location", {
      TextAddress: this.state.TextAddress,
      TextLatitude: this.state.TextLatitude,
      TextLongitude: this.state.TextLongitude,
      TextEmail: this.props.navigation.state.params.TextEmail,
      Status: this.state.Status,
      FindOrSchedule: this.props.navigation.state.params.FindOrSchedule
    });
  };

  GetShortestDistance = () => {
    var distance;
    var min;
    if (this.state.matchedTimesList.length > 0) {
      for (var i = 0; i < this.state.matchedTimesList.length; i++) {
        distance = geolib.getDistance(
          {
            latitude: this.state.matchedTimesList[i].latitude,
            longitude: this.state.matchedTimesList[i].longitude
          },
          { latitude: 39.9811935, longitude: -75.15535119999998 }
        );
        console.log(distance);
        if (i == 0) {
          min = distance;
        } else if (distance < min) {
          min = distance;
        }
      }
      console.log("shortest distance is " + min);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "darkred",
          justifyContent: "center",
          alignItems: "center"
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
              {this.state.FindOrScheduleText}
            </Text>
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
              {this.state.StatusText}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              margin: 10,
              flex: 5
            }}
          >
            <Button
              title="Pick Location"
              onPress={this.PickLocation}
              color="darkred"
            />
            <Text
              style={{
                color: "darkred",
                fontSize: 18,
                paddingHorizontal: 10,
                textDecorationLine: "underline",
                marginTop: 20
              }}
            >
              Address:
            </Text>
            <View style={styles.inputWrapAddress}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Address: "
                s
                defaultValue={this.props.navigation.state.params.TextAddress}
                multiline={true}
                editable={true}
                onChangeText={TextAddress => this.setState({ TextAddress })}
                style={[styles.inputAddress, { color: "black" }]}
              />
            </View>

            <Text
              style={{
                color: "darkred",
                fontSize: 18,
                paddingHorizontal: 10,
                textDecorationLine: "underline",
                marginTop: 20
              }}
            >
              Date:
            </Text>

            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text>Show DatePicker</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode="datetime"
              />
            </View>

            <TouchableOpacity activeOpacity={0.5} onPress={this.Insert}>
              <View
                style={{
                  backgroundColor: "darkred",
                  borderRadius: 10,
                  height: 60,
                  marginTop: 10,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button
                  title="Save"
                  onPress={this.getToken.bind(this)}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
