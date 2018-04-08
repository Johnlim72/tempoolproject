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
      TextRiderEmail: "",
      TextRiderFirstName: "",
      TextRiderLastName: "",
      TextRiderPhoneNumber: "",
      TextRiderDateTime: "",
      TextRiderAddress: ""
    };
  }

  componentDidMount() {
    console.log(
      "listviewclickitemholder2: " +
        this.props.navigation.state.params.ListViewCLickItemHolder2
    );
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getRiderForList.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        riderID: this.props.navigation.state.params.ListViewCLickItemHolder2
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          TextRiderEmail: responseJson.email,
          TextRiderFirstName: responseJson.firstName,
          TextRiderLastName: responseJson.lastName,
          TextRiderPhoneNumber: responseJson.phoneNumber
        });
      })
      .catch(error => {
        console.error(error);
      });

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/filter.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        driverID: this.props.navigation.state.params.ListViewClickItemHolder,
        riderID: this.props.navigation.state.params.ListViewCLickItemHolder2
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextRiderDateTime: responseJson[0].rider_datetime,
          TextRiderAddress: responseJson[0].rider_address
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
          <Text
            style={[
              styles.textViewContainer,
              { marginBottom: 20, fontSize: 30 }
            ]}
          >
            {" "}
            {"Ride Details"}{" "}
          </Text>
          <Text style={styles.textViewContainer}>
            {" "}
            {"Email = " + this.state.TextRiderEmail}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Name = " +
              this.state.TextRiderFirstName +
              " " +
              this.state.TextRiderLastName}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Pickup Time = " + this.state.TextRiderDateTime}{" "}
          </Text>

          <Text style={styles.textViewContainer}>
            {" "}
            {"Address = " + this.state.TextRiderAddress}{" "}
          </Text>
        </View>
        <View style={[styles.buttonContainer, { marginTop: 0 }]}>
          <Button
            title="Accept"
            onPress={() =>
              this.props.navigation.navigate("RideList", {
                TextEmail: this.props.navigation.state.params.TextEmail,
                TextUserID: this.props.navigation.state.params
                  .ListViewClickItemHolder
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
                TextEmail: this.props.navigation.state.params.TextEmail,
                TextUserID: this.props.navigation.state.params
                  .ListViewClickItemHolder
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
