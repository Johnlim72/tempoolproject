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
const background = require("./dark.png");

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
      URL: ""
    };
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
          blurRadius={3}
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
              Driver Schedule
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
              Driver
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
                color: "white",
                fontFamily: "Futura",
                fontSize: 30,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              Monday
            </Text>
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
              Tuesday
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
              Wednesday
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
              Thursday
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
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.InsertDriverToServer}
            >
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
                  onPress={this.InsertDriverToServer}
                  color="darkred"
                />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
