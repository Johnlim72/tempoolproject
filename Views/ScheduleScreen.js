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
  TextInput
} from "react-native";

import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import DatePicker from "react-native-datepicker";
import geolib from "geolib";
import styles from "./style";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

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
      FindOrSchedule: this.props.navigation.state.params.FindOrSchedule,
      FindOrScheduleText: "",
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

  componentDidMount() {
    this.Clock = setInterval(() => this.GetTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.Clock);
  }

  GetTime() {
    // Creating variables to hold time.
    var date, TimeType, hour, minutes, seconds, fullTime;

    // Creating Date() function object.
    date = new Date();

    var date1 = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    // Getting current hour from Date object.
    hour = date.getHours();

    // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
    if (hour <= 11) {
      TimeType = "AM";
    } else {
      // If the Hour is Not less than equals to 11 then Set the Time format as PM.
      TimeType = "PM";
    }

    // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
    if (hour > 12) {
      hour = hour - 12;
    }

    // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format.
    if (hour == 0) {
      hour = 12;
    }

    // Getting the current minutes from date object.
    minutes = date.getMinutes();

    // Checking if the minutes value is less then 10 then add 0 before minutes.
    if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }

    //Getting current seconds from date object.
    seconds = date.getSeconds();

    // If seconds value is less than 10 then add 0 before seconds.
    if (seconds < 10) {
      seconds = "0" + seconds.toString();
    }

    // Adding all the variables in fullTime variable.
    fullTime =
      month +
      "-" +
      date1 +
      "-" +
      year +
      " " +
      hour.toString() +
      ":" +
      minutes.toString() +
      ":" +
      seconds.toString() +
      " " +
      TimeType.toString();

    // Setting up fullTime variable in State.
    this.setState({
      TextDate: fullTime
    });
  }

  InsertRiderToServer = () => {
    const { TextEmail } = this.state;
    const { TextAddress } = this.state;
    const { TextLatitude } = this.state;
    const { TextLongitude } = this.state;
    const { TextDate } = this.state;

    console.log(
      "TextEmail: " +
        TextEmail +
        "\nTextAddress: " +
        TextAddress +
        "\nTextLongitude: " +
        TextLongitude +
        "\nTextLatitude: " +
        TextLatitude +
        "\nTextDate: " +
        TextDate
    );

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/submit_rider_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rider_email: TextEmail.toString(),
        rider_address: TextAddress.toString(),
        rider_latitude: TextLatitude.toString(),
        rider_longitude: TextLongitude.toString(),
        rider_dateTime: TextDate.toString()
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

    console.log(
      "TextEmail: " +
        TextEmail +
        "\nTextAddress: " +
        TextAddress +
        "\nTextLongitude: " +
        TextLongitude +
        "\nTextLatitude: " +
        TextLatitude +
        "\nTextDate: " +
        TextDate
    );

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/submit_driver_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driver_email: TextEmail.toString(),
        driver_address: TextAddress.toString(),
        driver_latitude: TextLatitude.toString(),
        driver_longitude: TextLongitude.toString(),
        driver_dateTime: TextDate.toString()
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
        if ( i == 0) {
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
                textDecorationLine: "underline"
              }}
            >
              Latitude:
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Latitude"
                defaultValue={this.props.navigation.state.params.TextLatitude}
                onChangeText={TextLatitude => this.setState({ TextLatitude })}
                style={[styles.input, { color: "black" }]}
              />
            </View>
            <Text
              style={{
                color: "darkred",
                fontSize: 18,
                paddingHorizontal: 10,
                textDecorationLine: "underline"
              }}
            >
              Longitude
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Longitude"
                defaultValue={this.props.navigation.state.params.TextLongitude}
                onChangeText={TextLongitude => this.setState({ TextLongitude })}
                style={[styles.input, { color: "black" }]}
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
            <DatePicker
              style={{ width: 200 }}
              date={this.state.TextDate}
              mode="datetime"
              placeholder="select date"
              format="MM-DD-YYYY, h:mm a"
              minDate="01-01-2018"
              maxDate="12-31-2100"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={TextDate => {
                this.setState({ TextDate: TextDate });
              }}
            />

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
                <Button title="Save" onPress={this.Insert} color="darkred" />
                <Button
                  title="Save"
                  onPress={this.GetShortestDistance}
                  color="blue"
                />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
