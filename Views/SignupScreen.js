import React from "react";
import {
  AppRegistry,
  Alert,
  AsyncStorage,
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

const ACCESS_TOKEN = "accessToken";
const EMAIL = "email";

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputFirstName: "",
      TextInputLastName: "",
      TextInputEmail: "",
      TextPassword: "",
      TextInputPhoneNumber: "",
      TextPasswordConfirm: ""
    };
  }

  async storeToken(accessToken, email) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      await AsyncStorage.setItem(EMAIL, email);
      console.log("Token was stored successfully");
    } catch (error) {
      console.log("Error storing token: " + error);
    }
  }

  async InsertDataToServer() {
    const { TextInputFirstName } = this.state;
    const { TextInputLastName } = this.state;
    const { TextInputEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextPasswordConfirm } = this.state;
    const { TextInputPhoneNumber } = this.state;

    // Check that all fields have been entered

    if(TextInputFirstName != ""
      && TextInputLastName != ""
      && TextInputEmail != ""
      && TextPassword != ""
      && TextInputPhoneNumber != ""
      && TextPasswordConfirm != "") {

        if(TextPassword === TextPasswordConfirm) {
          var emailDomain = TextInputEmail.substr(TextInputEmail.length - 10, TextInputEmail.length);

          if(emailDomain.toLowerCase() === "temple.edu"){
            try {
              let response = await fetch("http://cis-linux2.temple.edu/~tuf41055/php/submit_user_info.php", {
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
              });

              let responseText = await response.text();

              if(response.status >= 200 && response.status < 300) {
                let accessToken = responseText;
                this.storeToken(accessToken, TextInputEmail);

                Alert.alert(
                  "Success!",
                  "User created",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("Dashboard", {
                          Email: TextInputEmail,
                          accessToken: accessToken
                        })
                    }
                  ],
                  { cancelable: false }
                );

              } else {
                let error = responseText;
                throw error;
              }
            } catch(error) {
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
          style={[styles.background, {padding: 50}]}
          resizeMode="cover"
        >
          <View style={[styles.inputWrap, {marginTop: 120}]}>
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
              onChangeText={TextPasswordConfirm => this.setState({ TextPasswordConfirm })}
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
              onPress={this.InsertDataToServer.bind(this)}
              color="darkred"
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
