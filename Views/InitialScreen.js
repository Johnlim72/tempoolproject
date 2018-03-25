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
  TouchableOpacity
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");

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

  UserLoginFunction = () => {
    const { TextInputEmail } = this.state;
    const { TextPassword } = this.state;

    if(TextInputEmail != ""
      && TextPassword != "") {
        var emailDomain = TextInputEmail.substr(TextInputEmail.length - 10, TextInputEmail.length);
        if(emailDomain === "temple.edu"){
          fetch("http://cis-linux2.temple.edu/~tuf70921/php/login.php", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: TextInputEmail,
              password: TextPassword
            })
          })
            .then(response => response.json())
            .then(responseJson => {
              // If server response message same as Data Matched
              if (responseJson === "Data Matched") {
                //Then open Profile activity and send user email to profile activity.
                this.props.navigation.navigate("Dashboard", {
                  Email: TextInputEmail
                });
                console.log(responseJson);
              } else {
                Alert.alert(responseJson);
              }
            })
            .catch(error => {
              console.error(error);
            });

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
              onPress={this.UserLoginFunction}
              activeOpacity={0.5}
            >
              <View style={styles.button}>
                <Button
                  title="Sign in"
                  onPress={this.UserLoginFunction}
                  color="darkred"
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
