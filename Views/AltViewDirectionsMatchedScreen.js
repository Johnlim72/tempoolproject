import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Alert,
  Text,
  Dimensions,
  StatusBar
} from "react-native";

import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import haversine from "haversine";

import Button from "apsl-react-native-button";
import pick from "lodash/pick";
import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class AltViewDirectionsMatchedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: "",
      rider_address: this.props.navigation.state.params.rider_address,
      driver_address: this.props.navigation.state.params.driver_address,
      ride_ID: this.props.navigation.state.params.ride_ID,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      rider_coordinates: {
        latitude: parseFloat(this.props.navigation.state.params.rider_loc_lat),
        longitude: parseFloat(this.props.navigation.state.params.rider_loc_long)
      },
      driver_coordinates: {
        latitude: parseFloat(
          this.props.navigation.state.params.driver_latitude
        ),
        longitude: parseFloat(
          this.props.navigation.state.params.driver_longitude
        )
      },
      pickedUpRider: false
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const newLatLngs = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        const positionLatLngs = pick(position.coords, [
          "latitude",
          "longitude"
        ]);

        this.setState({
          routeCoordinates: routeCoordinates.concat(positionLatLngs),
          distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
          prevLatLng: newLatLngs
        });

        this.updateCoordinates(positionLatLngs);
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      const { routeCoordinates, distanceTravelled } = this.state;
      const newLatLngs = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      const positionLatLngs = pick(position.coords, ["latitude", "longitude"]);
      this.setState({
        routeCoordinates: routeCoordinates.concat(positionLatLngs),
        distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
        prevLatLng: newLatLngs
      });

      console.log(
        "positionLatLngs: " +
          positionLatLngs +
          ", positionLatLngs.latitude: " +
          positionLatLngs.latitude +
          ", positionLatLngs.longitude: " +
          positionLatLngs.longitude +
          ", ride_ID : " +
          this.props.navigation.state.params.ride_ID
      );
      this.updateCoordinates(positionLatLngs);
    });
  }

  updateCoordinates(positionLatLngs) {
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateCoordinatesMatched.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ride_ID: this.state.ride_ID,
          currentLatitude: positionLatLngs.latitude,
          currentLongitude: positionLatLngs.longitude,
          pickedUpRider: this.state.pickedUpRider
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Updated Coordinates") {
          console.log("Updated Coordinates");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCoordinatesPickedUpRider(positionLatLngs) {
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateCoordinatesMatched.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ride_ID: this.state.ride_ID,
          currentLatitude: positionLatLngs.latitude,
          currentLongitude: positionLatLngs.longitude,
          pickedUpRider: true
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Updated Coordinates") {
          console.log("Updated Coordinates");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCoordinatesCompletedRide() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/updateCompleted.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ride_ID: this.state.ride_ID,
        completedRide: true
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Updated to Completed.") {
          console.log("Updated to Completed.");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  pickedUpRider() {
    this.setState({
      pickedUpRider: true,
      driver_coordinates: {
        latitude: 39.980326,
        longitude: -75.15704
      }
    });
    console.log("pickedUpRider: " + this.state.pickedUpRider);
    this.updateCoordinatesPickedUpRider(this.state.rider_coordinates);
  }

  completeRide() {
    console.log("completed ride");
    this.updateCoordinatesCompletedRide();
    Alert.alert(
      "Ride Completed",
      "Enjoy your day at campus!",
      [
        {
          text: "Ok",
          onPress: () =>
            this.props.navigation.navigate("Dashboard", {
              userID: this.props.navigation.state.params.userID,
              TextEmail: this.props.navigation.state.params.TextEmail
            })
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const coordinates = [
      {
        latitude: parseFloat(this.props.navigation.state.params.rider_loc_lat),
        longitude: parseFloat(this.props.navigation.state.params.rider_loc_long)
      },
      {
        latitude: parseFloat(
          this.props.navigation.state.params.driver_latitude
        ),
        longitude: parseFloat(
          this.props.navigation.state.params.driver_longitude
        )
      }
    ];

    return (
      <View style={styles1.container}>
        <MapView
          region={{
            latitude: parseFloat(this.state.rider_coordinates.latitude),
            longitude: parseFloat(this.state.rider_coordinates.longitude),
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
            <Text style={styles1.topBarHeader}>Rider Name</Text>
            <Text style={styles1.topBarContent}>
              {this.props.navigation.state.params.TextRiderFirstName +
                " " +
                this.props.navigation.state.params.TextRiderLastName}
            </Text>
          </View>
          <View style={styles1.topBarGroup}>
            <Text style={styles1.topBarHeader}>Phone Number</Text>
            <Text style={styles1.topBarContent}>
              {this.props.navigation.state.params.TextRiderPhoneNumber}
            </Text>
          </View>
          {this.state.pickedUpRider ? (
            <View style={styles1.topBarGroup}>
              <Button
                style={{
                  backgroundColor: "green",
                  borderColor: "green",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() => this.completeRide()}
              >
                Complete Ride
              </Button>
            </View>
          ) : (
            <View style={styles1.topBarGroup}>
              <Button
                style={{
                  backgroundColor: "#ff6666",
                  borderColor: "#ff6666",
                  borderRadius: 22,
                  borderWidth: 2
                }}
                textStyle={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "Quicksand",
                  fontWeight: "400"
                }}
                onPress={() => this.pickedUpRider()}
              >
                Picked Up Rider
              </Button>
            </View>
          )}
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
                {(parseFloat(this.state.distanceTravelled) * 0.621371).toFixed(
                  2
                )}{" "}
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
                {(parseFloat(this.state.distanceTravelled) * 0.621371).toFixed(
                  2
                )}{" "}
                mi
              </Text>
            </View>
            <View style={styles1.bottomBarGroup}>
              <Text style={styles1.bottomBarHeader}>Rider Address</Text>
              <Text style={styles1.bottomBarContent}>
                {this.state.rider_address}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
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
    height: height
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
    color: "#ff6666",
    textAlign: "center"
  }
});
