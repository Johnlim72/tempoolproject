import React from "react";
import {
  AppRegistry,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Button,
  ImageBackground,
  Dimensions,
  View,
  Text,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import geolib from "geolib";
import haversine from "haversine";
import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import pick from "lodash/pick";

const { width, height } = Dimensions.get("window");
const background = require("./dark.png");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";

const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class ViewMatchedDriverScreen extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      userID: this.props.navigation.state.params.userID,
      TextEmail: this.props.navigation.state.params.TextEmail,
      ride_ID: this.props.navigation.state.params.ride_ID,
      rider_address: this.props.navigation.state.params.rider_address,
      rider_loc_lat: this.props.navigation.state.params.rider_loc_lat,
      rider_loc_long: this.props.navigation.state.params.rider_loc_long,
      rider_datetime: this.props.navigation.state.params.rider_datetime,
      acceptedOrPotential: this.props.navigation.state.params
        .acceptedOrPotential,
      driverID: this.props.navigation.state.params.driverID,
      driver_address: this.props.navigation.state.params.driver_address,
      driver_latitude: this.props.navigation.state.params.driver_latitude,
      driver_longitude: this.props.navigation.state.params.driver_longitude,
      completed: this.props.navigation.state.params.completed,
      currLatitude: this.props.navigation.state.params.currLatitude,
      currLongitude: this.props.navigation.state.params.currLongitude,
      pickedUpRider: this.props.navigation.state.params.pickedUpRider,
      completedRide: this.props.navigation.state.params.completedRide,
      startedRide: this.props.navigation.state.params.startedRide,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      currentLatitude: "",
      currentLongitude: "",
      coordinatesChecked: false,
      driver_coordinates: {
        latitude: parseFloat(
          this.props.navigation.state.params.driver_latitude
        ),
        longitude: parseFloat(
          this.props.navigation.state.params.driver_longitude
        )
      },
      rider_coordinates: {
        latitude: parseFloat(this.props.navigation.state.params.rider_loc_lat),
        longitude: parseFloat(this.props.navigation.state.params.rider_loc_long)
      },
      emailDriver: "",
      firstNameDriver: "",
      lastNameDriver: "",
      phoneNumberDriver: ""
    };


    console.log("ViewMatchedDriverScreen: " + this.state.driver_latitude);
  }

  componentDidMount() {
    this.checkForCoordinates();
  }

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  componentWillUnmount() {
    clearInterval(this.timerGetCoordinates);

    navigator.geolocation.clearWatch(this.watchID);
  }

  checkForCoordinates() {
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/getMatchedCoordinates.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ride_ID: this.state.ride_ID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        console.log("responseJson: ", responseJson);
        const { routeCoordinates, distanceTravelled } = this.state;

        const newLatLngs = {
          latitude: parseFloat(responseJson.currLatitude),
          longitude: parseFloat(responseJson.currLongitude)
        };

        this.setState({
          routeCoordinates: routeCoordinates.concat(newLatLngs),
          distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
          prevLatLng: newLatLngs,
          currentLatitude: newLatLngs.latitude,
          currentLongitude: newLatLngs.longitude,
          coordinatesChecked: true
        });

        console.log(this.state.routeCoordinates);
      })
      .catch(error => {
        console.error(error);
      });

    this.timerGetCoordinates = setInterval(() => {
      fetch(
        "http://cis-linux2.temple.edu/~tuf41055/php/getMatchedCoordinates.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ride_ID: this.state.ride_ID
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          //Then open Profile activity and send user email to profile activity.
          console.log("responseJson: ", responseJson);
          const { routeCoordinates, distanceTravelled } = this.state;

          const newLatLngs = {
            latitude: parseFloat(responseJson.currLatitude),
            longitude: parseFloat(responseJson.currLongitude)
          };

          this.setState({
            routeCoordinates: routeCoordinates.concat(newLatLngs),
            distanceTravelled:
              distanceTravelled + this.calcDistance(newLatLngs),
            prevLatLng: newLatLngs,
            currentLatitude: newLatLngs.latitude,
            currentLongitude: newLatLngs.longitude,
            coordinatesChecked: true,
            pickedUpRider: responseJson.pickedUpRider,
            completedRide: responseJson.completedRide
          });

          if (this.state.pickedUpRider == true) {
            this.setState({
              driver_coordinates: {
                latitude: 39.980326,
                longitude: -75.15704
              }
            });
          }

          if (this.state.completedRide == true) {
            Alert.alert(
              "Completed!",
              "Driver completed the ride, have a good day at campus!",
              [
                {
                  text: "OK",
                  onPress: () =>
                    this.props.navigation.navigate("Dashboard", {
                      TextEmail: this.props.navigation.state.params.TextEmail,
                      userID: this.state.userID
                    })
                }
              ],
              { cancelable: false }
            );

            clearInterval(this.timerGetCoordinates);
          }
          console.log(this.state.routeCoordinates);
        })
        .catch(error => {
          console.error(error);
        });
    }, 2000);
  }

  render() {
    if (this.state.coordinatesChecked == true) {
      return (
        <View style={styles1.container}>
          <MapView
            region={{
              latitude: parseFloat(this.state.currentLatitude),
              longitude: parseFloat(this.state.currentLongitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            style={styles1.map}
            mapType="hybrid"
            showsUserLocation={true}
            followUserLocation={true}
          >
            <MapView.Marker
              coordinate={this.state.rider_coordinates}
              pinColor="darkred"
            />
            <MapView.Marker
              coordinate={this.state.driver_coordinates}
              pinColor="blue"
            />
            <MapViewDirections
              origin={this.state.rider_coordinates}
              destination={this.state.driver_coordinates}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="yellow"
            />
            <Polyline
              coordinates={this.state.routeCoordinates}
              strokeColor="darkred" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={6}
            />
          </MapView>
          <View style={styles1.topBar}>
            <View style={styles1.topBarGroup}>
              <Text style={styles1.topBarHeader}>Driver Name</Text>
              <Text style={styles1.topBarContent}>
                {this.state.firstNameDriver + " " + this.state.lastNameDriver}
              </Text>
            </View>
            <View style={styles1.topBarGroup}>
              <Text style={styles1.topBarHeader}>Phone Number</Text>
              <Text style={styles1.topBarContent}>
                {this.state.phoneNumberDriver}
              </Text>
            </View>
            <View style={styles1.topBarGroup}>
              <Text style={styles1.topBarHeader}>E-mail</Text>
              <Text style={styles1.topBarContent}>
                {this.state.emailDriver}
              </Text>
            </View>
          </View>
          {this.state.pickedUpRider ? (
            <View style={styles1.bottomBar}>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>Rider Address</Text>
                <Text style={styles1.bottomBarContent2}>
                  {this.state.rider_address}
                </Text>
              </View>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>To</Text>
                <Text style={styles1.bottomBarContent3}>
                  {(
                    parseFloat(this.state.distanceTravelled) * 0.621371
                  ).toFixed(2)}{" "}
                  mi
                </Text>
              </View>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>Temple University</Text>
                <Text style={styles1.bottomBarContent}>
                  1803 N. Broad St., Philadelphia, PA 19121, USA
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles1.bottomBar}>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>Driver Address</Text>
                <Text style={styles1.bottomBarContent2}>
                  {this.state.driver_address}
                </Text>
              </View>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>To</Text>
                <Text style={styles1.bottomBarContent3}>
                  {(
                    parseFloat(this.state.distanceTravelled) * 0.621371
                  ).toFixed(2)}{" "}
                  mi
                </Text>
              </View>
              <View style={styles1.bottomBarGroup}>
                <Text style={styles1.bottomBarHeader}>Rider Address</Text>
                <Text style={styles1.bottomBarContent}>
                  {this.state.address}
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles1 = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  navBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: 64,
    width: width,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  navBarText: {
    color: "#19B5FE",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 30
  },
  map: {
    width: width,
    height: height - 80
  },
  bottomBar: {
    position: "absolute",
    height: 100,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: width,
    padding: 10,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  bottomBarGroup: {
    flex: 1
  },
  bottomBarHeader: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center"
  },
  bottomBarContent: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#ff6666",
    textAlign: "center"
  },
  bottomBarContent2: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#19B5FE",
    textAlign: "center"
  },
  bottomBarContent3: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "yellow",
    textAlign: "center"
  },
  topBar: {
    position: "absolute",
    height: 70,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: width,
    padding: 10,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  topBarGroup: {
    flex: 1
  },
  topBarHeader: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center"
  },
  topBarContent: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: "#19B5FE",
    textAlign: "center"
  }
});
