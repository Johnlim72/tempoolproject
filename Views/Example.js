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

export default class ExampleScreen extends React.Component {
  componentWillMount() {
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.stagger(300, [
      Animated.timing(this.animatedValue1, {
        toValue: height,
        duration: 1500
      }),
      Animated.timing(this.animatedValue2, {
        toValue: height,
        duration: 3000
      }),
      Animated.timing(this.animatedValue3, {
        toValue: 500,
        duration: 400
      })
    ]).start();
  }

  render() {
    const animatedStyle1 = {
      height: this.animatedValue1,
      width: width
    };
    const animatedStyle2 = {
      height: this.animatedValue2,
      width: width
    };
    const animatedStyle3 = {
      height: this.animatedValue3,
      width: width
    };
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle1]}>
          <Text>hi</Text>
        </Animated.View>
        <Animated.View style={[styles.box, animatedStyle2]}>
          <Text>hi</Text>
        </Animated.View>
        <Animated.View style={[styles.box, animatedStyle3]}>
          <Text>hi</Text>
        </Animated.View>
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
