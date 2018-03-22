import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class ProfileScreen extends React.Component {
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
      TextInputPhoneNumber: ""
    };

    const { TextInputFirstName } = "";
    const { TextInputLastName } = "";
    const { TextInputEmail } = "";
    const { TextPassword } = "";
    const { TextInputPhoneNumber } = "";

    fetch("https://tempool.000webhostapp.com/php/prepopulate.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: TextInputFirstName,
        lastName: TextInputLastName,
        email: this.props.navigation.state.params.Email,
        password: TextPassword,
        phoneNumber: TextInputPhoneNumber
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextInputFirstName: responseJson.firstName,
          TextInputLastName: responseJson.lastName,
          TextInputEmail: responseJson.email,
          TextPassword: responseJson.password,
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
    const { TextInputEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextInputPhoneNumber } = this.state;

    fetch("https://tempool.000webhostapp.com/php/update_user_info.php", {
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
              Profile
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
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                First Name:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="First Name"
                  defaultValue={this.state.TextInputFirstName}
                  onChangeText={TextInputFirstName =>
                    this.setState({ TextInputFirstName })
                  }
                  style={[styles.input, { color: "black" }]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                Last Name:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Last Name"
                  defaultValue={this.state.TextInputLastName}
                  onChangeText={TextInputLastName =>
                    this.setState({ TextInputLastName })
                  }
                  style={[styles.input, { color: "black" }]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                TU E-mail:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="TU E-mail"
                  placeholderTextColor="#b3b3b3"
                  defaultValue={this.state.TextInputEmail}
                  editable={false}
                  onChangeText={TextInputEmail =>
                    this.setState({ TextInputEmail })
                  }
                  style={[styles.input, { color: "#a6a6a6" }]}
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                Password:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Password"
                  defaultValue={this.state.TextPassword}
                  onChangeText={TextPassword => this.setState({ TextPassword })}
                  style={[styles.input, { color: "black" }]}
                  secureTextEntry
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                Confirm Password:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Confirm Password"
                  defaultValue={this.state.TextPassword}
                  style={[styles.input, { color: "black" }]}
                  secureTextEntry
                />
              </View>
              <Text
                style={{
                  color: "darkred",
                  fontSize: 18,
                  paddingHorizontal: 10,
                  textDecorationLine: "underline"
                }}
              >
                Phone Number:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Phone Number"
                  defaultValue={this.state.TextInputPhoneNumber}
                  onChangeText={TextInputPhoneNumber =>
                    this.setState({ TextInputPhoneNumber })
                  }
                  style={[styles.input, { color: "black" }]}
                />
              </View>
              <TouchableOpacity
                onPress={this.UpdateDataToServer}
                activeOpacity={0.5}
              >
                <View
                  style={{
                    backgroundColor: "darkred",
                    borderRadius: 10,
                    height: 60,
                    marginTop: 10,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    title="Save"
                    onPress={this.UpdateDataToServer}
                    color="darkred"
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
