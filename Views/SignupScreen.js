import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Button,
  View,
  Text,
  TextInput
} from "react-native";
import { StackNavigator, NavigationOptions } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");

const background = require("./login3_bg.jpg");
const lockIcon = require("./login1_lock.png");
const personIcon = require("./login1_person.png");

export default class SignupScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      TextInputFirstName: "",
      TextInputLastName: "",
      TextInputEmail: "",
      TextPassword: "",
      TextInputPhoneNumber: ""
    };
  }

  validateTempleEmail(email) {
    domain = email.substring(email.length - 10, email.length);
    if (domain.toLowerCase() === "temple.edu") {
      return true;
    } else {
      return false;
    }
  }

  InsertDataToServer = () => {
    const { TextInputFirstName } = this.state;
    const { TextInputLastName } = this.state;
    const { TextInputEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextInputPhoneNumber } = this.state;

    fetch("https://tempool.000webhostapp.com/php/submit_user_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: TextInputFirstName,
        lastName: TextInputLastName,
        email: TextInputEmail,
        password: TextPassword,
        phoneNumber: TextInputPhoneNumber
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "User successfully created.") {
          //Then open Profile activity and send user email to profile activity.
          Alert.alert(
            "Success!",
            "User created",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    Email: TextInputEmail
                  })
              }
            ],
            { cancelable: false }
          );
          console.log(responseJson);
        } else {
          Alert.alert(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

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
          <View style={styles.inputWrap}>
            <TextInput
              placeholderTextColor="#b3b3b3"
              placeholder="First Name"
              onChangeText={TextInputFirstName =>
                this.setState({ TextInputFirstName })
              }
              style={[styles.input, { color: "white" }]}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholderTextColor="#b3b3b3"
              placeholder="Last Name"
              onChangeText={TextInputLastName =>
                this.setState({ TextInputLastName })
              }
              style={[styles.input, { color: "white" }]}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="TU E-mail"
              placeholderTextColor="#b3b3b3"
              onChangeText={TextInputEmail => this.setState({ TextInputEmail })}
              style={[styles.input, { color: "white" }]}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholderTextColor="#b3b3b3"
              placeholder="Password"
              onChangeText={TextPassword => this.setState({ TextPassword })}
              style={[styles.input, { color: "white" }]}
              secureTextEntry
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholderTextColor="#b3b3b3"
              placeholder="Confirm Password"
              style={[styles.input, { color: "white" }]}
              secureTextEntry
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholderTextColor="#b3b3b3"
              placeholder="Phone Number"
              onChangeText={TextInputPhoneNumber =>
                this.setState({ TextInputPhoneNumber })
              }
              style={[styles.input, { color: "white" }]}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Sign Up"
              onPress={this.InsertDataToServer}
              color="darkred"
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
