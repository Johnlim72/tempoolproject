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
      loader: true
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
        console.log("drivers: ", responseJson);

        this.setState({
          loader: false,
          list1: responseJson
        });
        this.findShortDriver();
      })
      .catch(error => {
        Alert.alert(error.toString());
      });

    //Alert.alert("inside find");

    //   let responseText = await response.text();
    //   //Alert.alert(responseText);
    //   if (response.status >= 200 && response.status < 300) {
    //     let responseJson = JSON.parse(responseText);
    //     Alert.alert("success");
    //     //Alert.alert(responseText);
    //   } else {
    //     let error = JSON.parse(responseText);
    //     throw "Error";
    //     //throw error.errorMessage;
    //   }
    //
    // } catch (error) {
    //   Alert.alert(error);
    // }
  }

  findShortDriver() {
    //console.log("list1: ", this.state.list1);
    var count = this.state.list1.rows.length;
    console.log("count: " + count);
    var distance;
    var min;
    if (this.state.list1.length > 0) {

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
  }
  componentDidMount() {

      this.findDriver();
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
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
