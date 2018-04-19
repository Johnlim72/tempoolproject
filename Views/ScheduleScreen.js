import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
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
import Button from "apsl-react-native-button";
import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

const USERID = "userID";

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    this.state.dateSelected = true;
    this.state.dateText = date.toLocaleDateString();
    this.state.timeText = date.toLocaleTimeString();
    this._hideDateTimePicker();
  };

  async getToken() {
    try {
      let userID = await AsyncStorage.getItem(USERID);
      console.log("userID in gettoken: " + userID);

      this.Insert();
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
      dateText: "",
      timeText: "",
      dateSelected: false,
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

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/submit_driver_info.php", {
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
            "Success! Driver Inserted",
            "Would you like to start looking for riders now?",
            [
              {
                text: "Yes",
                onPress: () =>
                  this.props.navigation.navigate("StartLooking", {
                    TextEmail: this.props.navigation.state.params.TextEmail.toString(),
                    TextUserID: this.state.userID
                  })
              },
              {
                text: "No",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail.toString(),
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

  isDateSelected() {
    if (this.state.dateSelected == true) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50
          }}
        >
          <Text
            style={{
              color: "darkred",
              fontFamily: "Quicksand",
              fontSize: 24,
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Date: {this.state.dateText}
          </Text>
          <Text
            style={{
              color: "darkred",
              fontFamily: "Quicksand",
              fontSize: 24,
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Time: {this.state.timeText}
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
                fontFamily: "Quicksand",
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
                fontFamily: "Quicksand",
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
              padding: 10,
              margin: 10,
              flex: 5
            }}
          >
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
              onPress={this.PickLocation}
            >
              Pick different location
            </Button>

            <View style={styles.inputWrapAddress}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Address: "
                defaultValue={this.props.navigation.state.params.TextAddress}
                multiline={true}
                editable={true}
                onChangeText={TextAddress => this.setState({ TextAddress })}
                style={[
                  styles.inputAddress,
                  { color: "black", fontFamily: "Quicksand" }
                ]}
              />
            </View>
            <MapView
              region={{
                latitude: parseFloat(
                  this.props.navigation.state.params.TextLatitude
                ),
                longitude: parseFloat(
                  this.props.navigation.state.params.TextLongitude
                ),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              }}
              mapType="hybrid"
              showsUserLocation={true}
              followUserLocation={true}
              style={{
                width: width * 0.9,
                height: height / 4
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: parseFloat(
                    this.props.navigation.state.params.TextLatitude
                  ),
                  longitude: parseFloat(
                    this.props.navigation.state.params.TextLongitude
                  )
                }}
              />
            </MapView>

            <View
              style={{
                flex: 1,
                borderTopWidth: 1,
                borderTopColor: "black",
                marginTop: 5
              }}
            >
              <Button
                style={{
                  backgroundColor: "darkred",
                  borderColor: "darkred",
                  borderRadius: 22,
                  borderWidth: 2,
                  marginTop: 5
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={this._showDateTimePicker}
              >
                Click to choose date
              </Button>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode="datetime"
              />
            </View>

            {this.isDateSelected()}

            <Button
              style={{
                backgroundColor: "green",
                borderColor: "green",
                borderRadius: 22,
                borderWidth: 2
              }}
              textStyle={{
                fontSize: 18,
                color: "white",
                fontFamily: "Quicksand",
                fontWeight: "400"
              }}
              onPress={this.getToken.bind(this)}
            >
              Insert Schedule
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
