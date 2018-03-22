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

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      Address: "",
      Location: "",
      Date: "",
      Time: ""
    };
  }

  InsertRideToServer = () => {
    const { Address } = this.state;
    const { Location } = this.state;
    const { Date } = this.state;
    const { Time } = this.state;

    fetch("https://tempool.000webhostapp.com/php/update_user_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: Address,
        location: Location,
        date: Date,
        time: Time
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "Ride successfully inserted.") {
          //Then open Profile activity and send user email to profile activity.

          Alert.alert(
            "Success!",
            "Ride inserted",
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
              Schedule a Ride
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

              <TouchableOpacity
                onPress={this.InsertRideToServer}
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
                    onPress={this.InsertRideToServer}
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
