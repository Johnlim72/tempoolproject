import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Dimensions,
  Button,
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");

const ACCESS_TOKEN = "accessToken";
const EMAIL = "email";

const background = require("./login3_bg.jpg");
const lockIcon = require("./login1_lock.png");
const personIcon = require("./login1_person.png");

export default class InitialScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputEmail: "",
      TextPassword: ""
    };
  }

  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      let email = await AsyncStorage.getItem(EMAIL);
      if(accessToken) {
        this.props.navigation.navigate("Dashboard", {
          accessToken: accessToken,
          TextEmail: email
        });
      }
    } catch(error) {
        console.log("Something went wrong");
        Alert.alert("An Error occurred: " + error);
    }
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

  async UserLoginFunction() {
    const { TextInputEmail } = this.state;
    const { TextPassword } = this.state;

    if(TextInputEmail != ""
      && TextPassword != "") {
        var emailDomain = TextInputEmail.substr(TextInputEmail.length - 10, TextInputEmail.length);
        if(emailDomain === "temple.edu"){
          try {
            let response = await fetch("http://cis-linux2.temple.edu/~tuf41055/php/login.php", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: TextInputEmail,
                password: TextPassword
              })
            });

            let responseText = await response.text();

            if(response.status >= 200 && response.status < 300) {
              //Alert.alert(responseText);
              if(responseText != "error") {
                //Alert.alert("Inside if message not equal to error");
                let accessToken = responseText;
                this.storeToken(accessToken, TextInputEmail);
                this.props.navigation.navigate("Dashboard", {
                  TextEmail: TextInputEmail,
                  accessToken: accessToken
                });
              } else {
                //Alert.alert("Inside error");
                throw "Invalid credentials";
              }
            } else {
              let error = responseText;
              throw error;
            }
          } catch(error) {
            Alert.alert("An error occurred: " + error);
          }
        } else {
          Alert.alert("Are you sure the email is correct? It needs to be a temple.edu email");
        }
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Futura",
                marginTop: 250,
                fontSize: 50
              }}
            >
              Tempool
            </Text>
          </View>
          <View style={[styles.wrapper, { paddingTop: 300 }]}>
            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Image
                  source={personIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                placeholder="TU E-mail"
                placeholderTextColor="#b3b3b3"
                autoCapitalize="none"
                onChangeText={TextInputEmail =>
                  this.setState({ TextInputEmail })
                }
                style={[styles.input, { color: "white" }]}
              />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Image
                  source={lockIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Password"
                onChangeText={TextPassword => this.setState({ TextPassword })}
                style={[styles.input, { color: "white" }]}
                secureTextEntry
              />
            </View>
            <TouchableOpacity activeOpacity={0.5}>
              <View>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.UserLoginFunction.bind(this)}
              activeOpacity={0.5}
            >
              <View style={styles.button}>
                <Button
                  title="Sign in"
                  onPress={this.UserLoginFunction.bind(this)}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.container, { marginBottom: 15 }]}>
            <View style={styles.signupWrap}>
              <Text style={styles.accountText}>Don&#39;t have an account?</Text>
              <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.signUpButton}>
                  <Button
                    title="Sign up"
                    onPress={() => this.props.navigation.navigate("Signup")}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
