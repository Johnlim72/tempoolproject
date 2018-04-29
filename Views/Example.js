import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");

const arr = [];
for (var i = 0; i < 5; i++) {
  arr.push(i);
}

export default class Example extends React.Component {


  render() {

    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  box: {
    flex: 1,
    backgroundColor: "#333",
    width: width,
    marginHorizontal: 5
  }
});
