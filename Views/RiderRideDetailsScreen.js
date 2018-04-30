import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageBackground,
  ListView,
  Dimensions,
  ActivityIndicator,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");
const background = require("./dark.jpg");

export default class RiderRideDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rideID: "",
      acceptedOrPotential: "",
      TextRiderEmail: "",
      TextRiderFirstName: "",
      TextRiderLastName: "",
      TextRiderPhoneNumber: "",
      TextRiderDateTime: "",
      TextRiderAddress: "",
      rider_loc_lat: "",
      rider_loc_long: "",
      driver_address: "",
      driver_latitude: "",
      driver_longitude: ""
    };
  }

  componentDidMount() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getDriverForList.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        driverID: this.props.navigation.state.params.ListViewClickItemHolder
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

    console.log(
      "ListViewClickItemHolder3: ",
      this.props.navigation.state.params.ListViewClickItemHolder3
    );
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/filter.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Getting the id.
        driverID: this.props.navigation.state.params.ListViewClickItemHolder,
        riderID: this.props.navigation.state.params.ListViewClickItemHolder2,
        rideID: this.props.navigation.state.params.ListViewClickItemHolder3
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextRiderDateTime: responseJson[0].rider_datetime,
          TextRiderAddress: responseJson[0].rider_address,
          rideID: responseJson[0].ride_ID,
          rider_loc_lat: responseJson[0].rider_loc_lat,
          rider_loc_long: responseJson[0].rider_loc_long,
          driver_address: responseJson[0].driver_address,
          driver_latitude: responseJson[0].driver_latitude,
          driver_longitude: responseJson[0].driver_longitude
        });
        console.log("ride_ID: " + responseJson[0].ride_ID);
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateRide(acceptedOrPotential) {
    this.setState({ acceptedOrPotential: acceptedOrPotential });
    console.log("acceptedOrPotential: " + acceptedOrPotential);
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/updateRiderRide.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ride_ID: this.state.rideID,
        acceptedOrPotential: acceptedOrPotential
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (
          responseJson == "Ride RiderAccepted." ||
          responseJson == "Ride Accepted."
        ) {
          Alert.alert(
            "Success!",
            "Ride Accepted.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("RiderRideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.props.navigation.state.params
                      .ListViewClickItemHolder
                  })
              }
            ],
            { cancelable: false }
          );
        } else if (responseJson == "Ride Declined.") {
          Alert.alert(
            "Success!",
            "Ride Declined.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("RideRideList", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.props.navigation.state.params
                      .ListViewClickItemHolder
                  })
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.props.navigation.state.params.typeOfRides == "Potential") {
      return (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text
                style={[
                  styles.textViewContainer,
                  {
                    marginBottom: 20,
                    fontSize: 30,
                    fontFamily: "Quicksand"
                  }
                ]}
              >
                {"Ride Details"}
              </Text>
              <Text style={styles.textViewContainer2}>{"Name"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderFirstName +
                  " " +
                  this.state.TextRiderLastName}
              </Text>
              <Text style={styles.textViewContainer2}>{"Email"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderEmail}
              </Text>
              <Text style={styles.textViewContainer2}>{"Pickup Time"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderDateTime}
              </Text>
              <Text style={styles.textViewContainer2}>{"Address"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderAddress}
              </Text>
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
              onPress={
                () => this.updateRide("DriverAccepted")
                // () =>
                // this.props.navigation.navigate("RideList", {
                //   TextEmail: this.props.navigation.state.params.TextEmail,
                //   TextUserID: this.props.navigation.state.params
                //     .ListViewClickItemHolder
                // }),
              }
            >
              Accept
            </Button>

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
              onPress={
                () => this.updateRide("Declined")
                // () =>
                // this.props.navigation.navigate("RideList", {
                //   TextEmail: this.props.navigation.state.params.TextEmail,
                //   TextUserID: this.props.navigation.state.params
                //     .ListViewClickItemHolder
                // })
              }
            >
              Decline
            </Button>
          </View>
        </ScrollView>
      );
    } else if (this.props.navigation.state.params.typeOfRides == "Accepted") {
      return (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text
                style={[
                  styles.textViewContainer,
                  {
                    marginBottom: 20,
                    fontSize: 30,
                    fontFamily: "Quicksand"
                  }
                ]}
              >
                {"Ride Details"}
              </Text>
              <Text style={styles.textViewContainer2}>{"Name"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderFirstName +
                  " " +
                  this.state.TextRiderLastName}
              </Text>
              <Text style={styles.textViewContainer2}>{"Email"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderEmail}
              </Text>
              <Text style={styles.textViewContainer2}>{"Pickup Time"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderDateTime}
              </Text>
              <Text style={styles.textViewContainer2}>{"Address"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderAddress}
              </Text>
              <Button
                style={{
                  backgroundColor: "darkred",
                  borderColor: "darkred",
                  borderRadius: 22,
                  borderWidth: 2,
                  marginTop: 30
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() =>
                  this.props.navigation.navigate("ViewDirections", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    TextUserID: this.props.navigation.state.params
                      .ListViewClickItemHolder,
                    rider_loc_lat: this.state.rider_loc_lat,
                    rider_loc_long: this.state.rider_loc_long,
                    rider_address: this.state.TextRiderAddress,
                    driver_address: this.state.driver_address,
                    driver_longitude: this.state.driver_longitude,
                    driver_latitude: this.state.driver_latitude
                  })
                }
              >
                View Directions
              </Button>
            </View>
          </View>
        </ScrollView>
      );
    } else if (this.props.navigation.state.params.typeOfRides == "Past") {
      return (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text
                style={[
                  styles.textViewContainer,
                  {
                    marginBottom: 20,
                    fontSize: 30,
                    fontFamily: "Quicksand"
                  }
                ]}
              >
                {"Ride Details"}
              </Text>
              <Text style={styles.textViewContainer2}>{"Name"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderFirstName +
                  " " +
                  this.state.TextRiderLastName}
              </Text>
              <Text style={styles.textViewContainer2}>{"Email"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderEmail}
              </Text>
              <Text style={styles.textViewContainer2}>{"Pickup Time"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderDateTime}
              </Text>
              <Text style={styles.textViewContainer2}>{"Address"}</Text>
              <Text style={styles.textViewContainer}>
                {this.state.TextRiderAddress}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}
