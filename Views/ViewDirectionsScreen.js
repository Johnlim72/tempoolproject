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

import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";

export default class ViewDirectionsScreen extends React.Component {
  constructor(props) {
    super(props);
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
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0422 * ASPECT_RATIO
          }}
          style={styles1.map}
          mapType="satellite"
          showsUserLocation={true}
          followUserLocation={true}
        >
          <MapView.Marker coordinate={coordinates[0]} />
          <MapView.Marker coordinate={coordinates[1]} />
          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        </MapView>
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
  }
});
