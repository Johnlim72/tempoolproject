import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputFirstName: "",
      TextInputLastName: "",
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextPassword: "",
      TextInputPhoneNumber: "",
      TextPasswordConfirm: ""
    };

    //this.props.navigation.state.params.Email

    const { TextInputFirstName } = "";
    const { TextInputLastName } = "";
    const { TextEmail } = this.props.navigation.state.params.TextEmail;
    const { TextPassword } = "";
    const { TextInputPhoneNumber } = "";

    //Alert.alert("Email: " + this.props.navigation.state.params.Email);

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/prepopulate.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: TextInputFirstName,
        lastName: TextInputLastName,
        email: this.props.navigation.state.params.TextEmail,
        password: TextPassword,
        phoneNumber: TextInputPhoneNumber
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextInputFirstName: responseJson.firstName,
          TextInputLastName: responseJson.lastName,
          TextEmail: responseJson.email,
          TextPassword: "",
          TextPasswordConfirm: "",
          TextInputPhoneNumber: responseJson.phoneNumber
        });

        console.log(responseJson);
      })

      .catch(error => {
        console.error(error);
      });
  }

  UpdateDataToServer = () => {
    const { TextInputFirstName } = this.state;
    const { TextInputLastName } = this.state;
    const { TextEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextPasswordConfirm } = this.state;
    const { TextInputPhoneNumber } = this.state;

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

        if (emailDomain === "temple.edu") {
          fetch(
            "http://cis-linux2.temple.edu/~tuf41055/php/update_user_info.php",
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
          )
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson === "User successfully updated.") {
                //Then open Profile activity and send user email to profile activity.

                Alert.alert(
                  "Success!",
                  "User updated",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("Dashboard", {
                          TextEmail: this.state.TextEmail
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
        } else {
          Alert.alert("Please use a temple.edu email");
        }
      } else {
        Alert.alert("Passwords don't match");
      }
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "darkred",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 10
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Quicksand",
                fontSize: 30,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              Profile
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                margin: 20,
                marginBottom: 30
              }}
            >
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                First Name
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="First Name"
                  defaultValue={this.state.TextInputFirstName}
                  onChangeText={TextInputFirstName =>
                    this.setState({ TextInputFirstName })
                  }
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                Last Name
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Last Name"
                  defaultValue={this.state.TextInputLastName}
                  onChangeText={TextInputLastName =>
                    this.setState({ TextInputLastName })
                  }
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                TU E-mail
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="TU E-mail"
                  placeholderTextColor="#b3b3b3"
                  defaultValue={this.state.TextEmail}
                  editable={false}
                  onChangeText={TextEmail => this.setState({ TextEmail })}
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                Password
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Password"
                  defaultValue={this.state.TextPassword}
                  onChangeText={TextPassword => this.setState({ TextPassword })}
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                  secureTextEntry
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                Confirm Password
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Confirm Password"
                  defaultValue={this.state.TextPasswordConfirm}
                  onChangeText={TextPasswordConfirm =>
                    this.setState({ TextPasswordConfirm })
                  }
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                  secureTextEntry
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline",
                  fontFamily: "Quicksand"
                }}
              >
                Phone Number
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Phone Number"
                  defaultValue={this.state.TextInputPhoneNumber}
                  onChangeText={TextInputPhoneNumber =>
                    this.setState({ TextInputPhoneNumber })
                  }
                  style={[
                    styles.input,
                    { color: "black", fontFamily: "Quicksand" }
                  ]}
                />
              </View>

              <Button
                style={{
                  backgroundColor: "darkred",
                  borderColor: "darkred",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={this.UpdateDataToServer}
              >
                Save
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
