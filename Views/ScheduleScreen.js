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
import DatePicker from "react-native-datepicker";
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
      TextAddress: "",
      TextLatitude: "",
      TextLongitude: "",
      TextDate: "03-25-2018",
      TextTime: ""
    };
  }

  InsertRideToServer = () => {
    const { TextAddress } = this.state;
    const { TextLatitude } = this.state;
    const { TextLongitude } = this.state;
    const { TextDate } = this.state;
    const { TextTime } = this.state;

    fetch("http://cis-linux2.temple.edu/~tuf70921/php/update_user_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: TextAddress,
        latitude: TextLatitude,
        longitude: TextLongitude,
        date: TextDate,
        time: TextTime
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
                onPress: () => this.props.navigation.navigate("Dashboard")
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

  PickLocation = () => {
    this.props.navigation.navigate("Location", {
      TextAddress: this.state.TextAddress,
      TextLatitude: this.state.TextLatitude,
      TextLongitude: this.state.TextLongitude
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
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              margin: 10,
              flex: 5
            }}
          >
            <Button
              title="Pick Location"
              onPress={this.PickLocation}
              color="darkred"
            />
            <Text
              style={{
                color: "darkred",
                fontSize: 18,
                paddingHorizontal: 10,
                textDecorationLine: "underline",
                marginTop: 20
              }}
            >
              Address:
            </Text>
            <View style={styles.inputWrapAddress}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Address: "s
                defaultValue={this.props.navigation.state.params.TextAddress}
                multiline={true}
                editable={true}
                onChangeText={TextAddress => this.setState({ TextAddress })}
                style={[styles.inputAddress, { color: "black"}]}
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
              Latitude:
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Latitude"
                defaultValue={this.props.navigation.state.params.TextLatitude}
                onChangeText={TextLatitude => this.setState({ TextLatitude })}
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
              Longitude
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholderTextColor="#b3b3b3"
                placeholder="Longitude"
                defaultValue={this.props.navigation.state.params.TextLongitude}
                onChangeText={TextLongitude => this.setState({ TextLongitude })}
                style={[styles.input, { color: "black" }]}
              />
            </View>
            <Text
              style={{
                color: "darkred",
                fontSize: 18,
                paddingHorizontal: 10,
                textDecorationLine: "underline",
                marginTop: 20
              }}
            >
              Date:
            </Text>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.TextDate}
              mode="datetime"
              placeholder="select date"
              format="MM-DD-YYYY, h:mm a"
              minDate="01-01-2018"
              maxDate="12-31-2100"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={TextDate => {
                this.setState({ TextDate: TextDate });
              }}
            />

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
        </ImageBackground>
      </View>
    );
  }
}
