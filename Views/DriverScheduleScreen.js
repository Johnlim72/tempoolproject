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
import DatePicker from "react-native-datepicker";
import styles from "./style";

export default class DriverScheduleScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: ""
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "darkred"
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 50
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "darkred",
                fontFamily: "Futura",
                fontSize: 30,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              Driver Leaving Times
            </Text>
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
            Monday:
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.Monday}
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
            onDateChange={Monday => {
              this.setState({ Monday: Monday });
            }}
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
            Tuesday:
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.Tuesday}
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
            onDateChange={Tuesday => {
              this.setState({ Tuesday: Tuesday });
            }}
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
            Wednesday:
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.Wednesday}
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
            onDateChange={Wednesday => {
              this.setState({ Wednesday: Wednesday });
            }}
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
            Thursday:
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.Thursday}
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
            onDateChange={Thursday => {
              this.setState({ Thursday: Thursday });
            }}
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
            Friday:
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.Friday}
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
            onDateChange={Friday => {
              this.setState({ Friday: Friday });
            }}
          />
        </View>
      </View>
    );
  }
}
