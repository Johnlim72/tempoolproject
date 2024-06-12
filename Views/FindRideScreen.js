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
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style"

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class FindRideScreen extends React.Component {
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
          >
          </View>
        </View>
        </ImageBackground>
      </View>
    );
  }
}
