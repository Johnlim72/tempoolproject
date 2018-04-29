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
const background = require("./dark.jpg");

const USERID = "userID";

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class UpdateScheduleScreen extends React.Component {

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

      this.Update();
    } catch (error) {
      console.log("Something went wrong");
      Alert.alert("An Error occurred: " + error);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      rowData: this.props.navigation.state.params.rowData,
      address: this.props.navigation.state.params.rowData.addressText,
      TextDate: this.props.navigation.state.params.rowData.departureDateTime,
      userID: this.props.navigation.state.params.rowData.userID,
      idDriver: this.props.navigation.state.params.rowData.idDriver,
      dateText: this.props.navigation.state.params.rowData.departureDateTime,
      timeText: this.props.navigation.state.params.rowData.departureDateTime,
      dateSelected: false,
      chosenDate: this.props.navigation.state.params.rowData.departureDateTime,
      URL: ""
    };
  }

  Update = () => {
    console.log("rowData", this.state.rowData);
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/updateSchedule.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idDriver: this.state.idDriver,
        addressText: this.state.address,
        longitude: this.state.rowData.longitude,
        latitude: this.state.rowData.latitude,
        departureDateTime: this.state.chosenDate
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Schedule successfully updated.") {
          Alert.alert(
            "Success!",
            "Schedule updated.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("ScheduleList", {
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

  PickLocation = () => {
    this.props.navigation.navigate("UpdateLocation", {
      address: this.state.address,
      rowData: this.state.rowData
    });
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
    } else {
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
            Date & Time:
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
            {this.state.dateText}
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
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
              margin: 20,
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
                defaultValue={this.state.rowData.addressText}
                multiline={true}
                editable={true}
                style={[
                  styles.inputAddress,
                  { color: "black", fontFamily: "Quicksand" }
                ]}
              />
            </View>
            <MapView
              region={{
                latitude: parseFloat(this.state.rowData.latitude),
                longitude: parseFloat(this.state.rowData.longitude),
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
                  latitude: parseFloat(this.state.rowData.latitude),
                  longitude: parseFloat(this.state.rowData.longitude)
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
                  marginTop: 30
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
              Update Schedule
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
