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

export default class RideScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputRide_ID: "",
      TextInputRiderName: "",
      TextInputStartTime: "",
      TextInputLocation: ""
    };

    const { TextInputRide_ID } = "";
    const { TextInputRiderName } = "";
    const { TextInputStartTime } = "";
    const { TextInputLocation } = "";

    fetch("http://cis-linux2.temple.edu/~tuf70921/php/ride_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rider_name: TextInputRiderName,
        ride_ID: this.props.navigation.state.params.ride_ID,
        start_time: TextInputStartTime,
        address: TextInputLocation
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({

          TextInputRide_ID: responseJson.ride_ID,
          TextInputRiderName: responseJson.rider_name,
          TextInputStartTime: responseJson.start_time,
          TextInputLocation: response.address
        });

        console.log(responseJson);
      })

      .catch(error => {
        console.error(error);
      });
  }


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
              Rides
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
                Rider Name:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Rider Name"
                  defaultValue={this.state.TextInputRiderName}
                  onChangeText={TextInputRiderName =>
                    this.setState({ TextInputRiderName })
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
                Location:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Last Name"
                  defaultValue={this.state.TextInputLastName}
                  onChangeText={TextInputLocation =>
                    this.setState({ TextInputLocation })
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
                Time:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="TU E-mail"
                  placeholderTextColor="#b3b3b3"
                  defaultValue={this.state.TextInputEmail}
                  editable={false}
                  onChangeText={TextInputStartTime =>
                    this.setState({ TextInputStartTime })
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

                Ride ID:
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholderTextColor="#b3b3b3"
                  placeholder="Ride ID"
                  defaultValue={this.state.TextInputRide_ID}
                  onChangeText={TextInputRide_ID =>
                    this.setState({ TextInputRide_ID })
                  }
                  style={[styles.input, { color: "black" }]}
                />
              </View>

            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
