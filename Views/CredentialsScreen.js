import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  Text,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style"

export default class CredentialsScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "darkred"
        }}
      >
        <Text style={{ color: "darkred" }}>Credentials Screen</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Go to Login"
            onPress={() => this.props.navigation.navigate("Login")}
            color="darkred"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Go to Sign Up"
            onPress={() => this.props.navigation.navigate("Signup")}
            color="darkred"
          />
        </View>
      </View>
    );
  }
}
