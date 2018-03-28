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
  ListView,
  Dimensions,
  ActivityIndicator,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class RideDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      TextEmail: "",
      TextRiderName: "",
      TextDate: "",
      TextLocation: ""
    };
  }

  componentDidMount() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/filter.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        driver_email: this.props.navigation.state.params.ListViewClickItemHolder
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextEmail: responseJson[0].rider_email,
          TextRiderName: responseJson[0].rider_name,
          TextDate: responseJson[0].start_time,
          TextLocation: responseJson[0].address
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={[styles.textViewContainer, { marginBottom: 20, fontSize: 30 }]}>
            {" "}
            {"Ride Details"}{" "}
          </Text>
          <Text style={styles.textViewContainer}>
            {" "}
            {"Email = " + this.state.TextEmail}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Rider Name = " + this.state.TextRiderName}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Time = " + this.state.TextDate}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Location = " + this.state.TextLocation}{" "}
          </Text>
        </View>
        <View style={[styles.buttonContainer, { marginTop: 0 }]}>
          <Button
            title="Accept"
            onPress={() =>
              this.props.navigation.navigate("RideList", {
                TextEmail: this.props.navigation.state.params.TextEmail
              })
            }
            color="darkred"
            disabled={this.state.disabled}
          />
        </View>
        <View style={[styles.buttonContainer, { marginTop: 0 }]}>
          <Button
            title="Decline"
            onPress={() =>
              this.props.navigation.navigate("RideList", {
                TextEmail: this.props.navigation.state.params.TextEmail
              })
            }
            color="darkred"
            disabled={this.state.disabled}
          />
        </View>
      </View>
    );
  }
}
