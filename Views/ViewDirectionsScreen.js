import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar
} from "react-native";

import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import haversine from "haversine";
import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";

export default class ViewDirectionsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: "",
      rider_address: this.props.navigation.state.params.rider_address,
      driver_address: this.props.navigation.state.params.driver_address
    };

    console.log(
      "rider_address: " +
        this.state.rider_address +
        ", " +
        this.state.driver_address
    );
  }

  calcDistance() {
    return (
      haversine(
        {
          latitude: parseFloat(
            this.props.navigation.state.params.rider_loc_lat
          ),
          longitude: parseFloat(
            this.props.navigation.state.params.rider_loc_long
          )
        },
        {
          latitude: parseFloat(
            this.props.navigation.state.params.driver_latitude
          ),
          longitude: parseFloat(
            this.props.navigation.state.params.driver_longitude
          )
        }
      ) || 0
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
            latitude: parseFloat(
              this.props.navigation.state.params.rider_loc_lat
            ),
            longitude: parseFloat(
              this.props.navigation.state.params.rider_loc_long
            ),
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0322 * ASPECT_RATIO
          }}
          style={styles1.map}
          mapType="hybrid"
          showsUserLocation={true}
          followUserLocation={true}
        >
          <MapView.Marker coordinate={coordinates[0]} pinColor="darkred" />
          <MapView.Marker coordinate={coordinates[1]} pinColor="blue" />
          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="yellow"
          />
        </MapView>
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
              {(this.calcDistance() * 0.621371).toFixed(2)} mi
            </Text>
          </View>
          <View style={styles1.bottomBarGroup}>
            <Text style={styles1.bottomBarHeader}>Rider Address</Text>
            <Text style={styles1.bottomBarContent}>
              {this.state.rider_address}
            </Text>
          </View>
        </View>
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
  }
});
