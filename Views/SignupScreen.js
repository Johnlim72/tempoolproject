import React from "react";
import {
  AppRegistry,
  Alert,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  View,
  Text,
  TextInput
} from "react-native";
import { StackNavigator, NavigationOptions } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");

const background = require("./dark.jpg");
const lockIcon = require("./login1_lock.png");
const personIcon = require("./login1_person.png");

const ACCESS_TOKEN = "accessToken";
const EMAIL = "email";
const USERID = "userID";

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputFirstName: "",
      TextInputLastName: "",
      TextEmail: "",
      TextPassword: "",
      TextInputPhoneNumber: "",
      TextPasswordConfirm: ""
    };
  }

  async storeToken(accessToken, email, userID) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      await AsyncStorage.setItem(EMAIL, email);
      await AsyncStorage.setItem(USERID, userID);
      console.log("Token was stored successfully");
    } catch (error) {
      console.log("Error storing token: " + error);
    }
  }

  async InsertDataToServer() {
    const { TextInputFirstName } = this.state;
    const { TextInputLastName } = this.state;
    const { TextEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextPasswordConfirm } = this.state;
    const { TextInputPhoneNumber } = this.state;

    // Check that all fields have been entered

    if (
      TextInputFirstName != "" &&
      TextInputLastName != "" &&
      TextEmail != "" &&
      TextPassword != "" &&
      TextInputPhoneNumber != "" &&
      TextPasswordConfirm != ""
    ) {
      if (TextPassword === TextPasswordConfirm) {
        var emailDomain = TextEmail.substr(
          TextEmail.length - 10,
          TextEmail.length
        );

        if (emailDomain.toLowerCase() === "temple.edu") {
          try {
            let response = await fetch(
              "http://cis-linux2.temple.edu/~tuf70921/php/submit_user_info.php",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  firstName: TextInputFirstName,
                  lastName: TextInputLastName,
                  email: TextEmail,
                  password: TextPassword,
                  phoneNumber: TextInputPhoneNumber
                })
              }
            );

            let responseText = await response.text();
            if (response.status >= 200 && response.status < 300) {
              let responseJson = JSON.parse(responseText);
              if (responseJson.error != 1) {
                let accessToken = responseJson.token;
                let userID = responseJson.userID;

                this.storeToken(accessToken, TextEmail, userID);

                Alert.alert(
                  "Success!",
                  "User created",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("Dashboard", {
                          TextEmail: TextEmail,
                          accessToken: accessToken,
                          userID: userID
                        })
                    }
                  ],
                  { cancelable: false }
                );
              } else {
                let error = responseJson.errorMessage;
                throw error;
              }
            } else {
              let error = responseJson.errorMessage;
              throw error;
            }
          } catch (error) {
            Alert.alert(error);
          }
        } else {
          Alert.alert("Please use a temple.edu email");
        }
      } else {
        Alert.alert("Passwords don't match");
      }
    } else {
      Alert.alert("Please fill in all fields");
    }
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
          style={[styles.background, { padding: 10 }]}
          resizeMode="cover"
          blurRadius={3}
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 10,
              padding: 10,
              margin: 10,
              marginTop: 90
            }}
          >
            <View style={[styles.inputWrap]}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="First Name"
                onChangeText={TextInputFirstName =>
                  this.setState({ TextInputFirstName })
                }
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Last Name"
                onChangeText={TextInputLastName =>
                  this.setState({ TextInputLastName })
                }
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="TU E-mail"
                placeholderTextColor="#b3b3b3"
                onChangeText={TextEmail => this.setState({ TextEmail })}
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Password"
                onChangeText={TextPassword => this.setState({ TextPassword })}
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
                secureTextEntry
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Confirm Password"
                onChangeText={TextPasswordConfirm =>
                  this.setState({ TextPasswordConfirm })
                }
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
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
                style={[
                  styles.input,
                  {
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: "bold"
                  }
                ]}
              />
            </View>
            <Button
              style={{
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: 22,
                borderWidth: 2,
                marginTop: 30
              }}
              textStyle={{
                fontSize: 18,
                color: "darkred",
                fontFamily: "Quicksand",
                fontWeight: "400"
              }}
              onPress={this.InsertDataToServer.bind(this)}
            >
              Sign Up
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
