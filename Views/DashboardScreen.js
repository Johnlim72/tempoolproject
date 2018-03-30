import React from "react";
import {
  AppRegistry,
  Alert,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
  View,
  Text,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import { Switch } from "react-native-switch";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

const ACCESS_TOKEN = "accessToken";

export default class DashboardScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextEmail: this.props.navigation.state.params.TextEmail,
      SwitchOnValueHolder: true,
      disabled: false
    };
  }

  async deleteToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      this.props.navigation.navigate("Initial");
    } catch (error) {
      Alert.alert("An error occurred: " + error);
    }
  }

  ShowAlert = value => {
    this.setState({
      SwitchOnValueHolder: value
    });

    if (value == true) {
      //Perform any task here which you want to execute on Switch ON event.
      //  Alert.alert("Rider status selected.");
      this.setState({ disabled: false });
    } else {
      //Perform any task here which you want to execute on Switch OFF event.
      Alert.alert(
        "Driver Status Selected",
        "Would you like to fill out your schedule?",
        [
          {
            text: "Yes",
            onPress: () =>
              this.props.navigation.navigate("DriverSchedule", {
                TextEmail: this.props.navigation.state.params.TextEmail
              })
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed")
          }
        ],
        { cancelable: false }
      );
      this.setState({ disabled: true });
    }
  };

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              marginTop: 20
            }}
          >
            <View
              style={{
                flex: 1,
                paddingHorizontal: 50,
                paddingTop: 10,
                borderRadius: 10,
                backgroundColor: "white"
              }}
            >
              <Text
                style={{
                  color: "darkred",
                  fontFamily: "Futura",
                  fontSize: 30,
                  paddingBottom: 10
                }}
              >
                Dashboard
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <Text style={{ marginRight: 10 }}>Rider</Text>
                <Switch
                  onValueChange={value => this.ShowAlert(value)}
                  activeText={""}
                  inActiveText={""}
                  disabled={false}
                  circleSize={30}
                  barHeight={30}
                  circleBorderWidth={3}
                  backgroundActive={"darkred"}
                  backgroundInactive={"#003399"}
                  circleActiveColor={"#cc0000"}
                  circleInActiveColor={"#1a75ff"}
                  style={{ transform: [{ scaleX: 10 }, { scaleY: 0.8 }] }}
                  value={this.state.SwitchOnValueHolder}
                />
                <Text style={{ marginLeft: 10 }}>Driver</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 5, marginTop: 10 }}>
            <View style={[styles.buttonContainer, { marginTop: 0 }]}>
              <Button
                title="Find a Ride"
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
                color="darkred"
                disabled={this.state.disabled}
              />
            </View>

            <View style={[styles.buttonContainer, { marginTop: 0 }]}>
              <Button
                title="Schedule a Ride"
                onPress={() =>
                  this.props.navigation.navigate("Location", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
                color="darkred"
                disabled={this.state.disabled}
              />
            </View>

            <View style={[styles.buttonContainer, { marginTop: 0 }]}>
              <Button
                title="List of Rides"
                onPress={() =>
                  this.props.navigation.navigate("RideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
                color="darkred"
                disabled={!this.state.disabled}
              />
            </View>

            <View style={[styles.buttonContainer, { marginTop: 0 }]}>
              <Button
                title="Profile"
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
                }
                color="darkred"
              />
            </View>

            <View style={[styles.buttonContainer, { marginTop: 0 }]}>
              <Button title="Logout" onPress={this.deleteToken.bind(this)} />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
