import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar
} from "react-native";

import MapView, { Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import pick from "lodash/pick";
import haversine from "haversine";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 39.982;
const LONGITUDE = -75.1531;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";
const coordinates = [
  {
    latitude: 39.98198800000001,
    longitude: -75.153053
  },
  {
    latitude: 39.980651,
    longitude: -75.157827
  }
];

export default class TrackScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {}
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {},
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

      console.log(this.state.routeCoordinates);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  render() {
    return (
      <View style={styles1.container}>
        <MapView
        
          style={styles1.map}
          mapType="satellite"
          showsUserLocation={true}
          followUserLocation={true}
          overlays={[
            {
              coordinates: this.state.routeCoordinates,
              strokeColor: "darkred",
              lineWidth: 10
            }
          ]}
        >
          <Polyline
            coordinates={this.state.routeCoordinates}
            strokeColor="darkred" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
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

        <View style={styles1.bottomBar}>
          <View style={styles1.bottomBarGroup}>
            <Text style={styles1.bottomBarHeader}>DISTANCE</Text>
            <Text style={styles1.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
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
    padding: 20,
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
    fontSize: 18,
    marginTop: 10,
    color: "#19B5FE",
    textAlign: "center"
  }
});
