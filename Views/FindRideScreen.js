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
const background = require("./login3_bg.jpg");
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = "AIzaSyCFwaPOiId1pFRm93-nbRBzF71UybpU9i8";

const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class FindRideScreen extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      address: this.props.navigation.state.params.TextAddress,
      longitude: this.props.navigation.state.params.TextLongitude,
      latitude: this.props.navigation.state.params.TextLatitude,
      userID: this.props.navigation.state.params.userID,
      driver_coordinates: {
        latitude: "",
        longitude: ""
      },
      rider_coordinates: {
        latitude: this.props.navigation.state.params.TextLatitude,
        longitude: this.props.navigation.state.params.TextLongitude
      },
      list1: [],
      loader: true,
      driverID: null,
      rideID: null,
      status: "Potential",
      acceptedRide: false,
      driverName: "",
      driverEmail: "",
      driverPhoneNumber: "",
      driver_address: "",
      driver_longitude: "",
      driver_latitude: "",
      driverScheduleID: "",
      idQueue: "",
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      foundDriver: false,
      completedRide: false,
      currentLatitude: "",
      currentLongitude: "",
      coordinatesChecked: false
    };
  }

  componentDidMount() {
    this.putIntoQueue();
  }

  putIntoQueue() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/putIntoQueue.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          console.log("Inserted rider into queue.");
          this.setState({
            idQueue: responseJson.idQueue
          });
          console.log("idQueue: ", this.state.idQueue);
          this.waitForQueue();
        } else {
          Alert.alert("error" + responseJson.error);
        }
      })
      .catch(error => {
        Alert.alert(error.toString());
      });
  }

  waitForQueue() {
    this.timer = setInterval(() => {
      fetch(
        "http://cis-linux2.temple.edu/~tuf41055/php/checkIfNextInQueue.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userID: this.state.userID
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error == 0) {
            console.log("serving...");
            //do algorithm
            this.findDriver();
            clearInterval(this.timer);
          } else {
            console.log("Still waiting...");
          }
        })
        .catch(error => {
          Alert.alert("Error: " + error.toString());
        });
    }, 5000);
  }

  findDriver() {
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/get_drivers_within_schedule.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: this.state.address,
          longitude: this.state.longitude,
          latitude: this.state.latitude,
          userID: this.state.userID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("drivers: ", responseJson);
        if (responseJson.num_rows > 0) {
          this.setState({
            list1: responseJson
          });
          this.findShortDriver();
        } else {
          Alert.alert("No drivers leaving soon");
          fetch(
            "http://cis-linux2.temple.edu/~tuf41055/php/updateQueueToServed.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                idRider: this.state.userID,
                idQueue: this.state.idQueue
              })
            }
          )
            .then(response => response.json())
            .then(responseJson => {
              //Then open Profile activity and send user email to profile activity.
              if (
                responseJson == "Queue successfully updated Status to served."
              ) {
                console.log(responseJson);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
        //Alert.alert(responseJson.toString());
      })
      .catch(error => {
        Alert.alert(error.toString());
      });
  }

  findShortDriver() {
    //console.log("list1: ", this.state.list1);
    var count = this.state.list1.rows.length;

    var distance;
    var min;
    var minUser;

    if (count > 0) {
      for (var i = 0; i < count; i++) {
        distance = geolib.getDistance(
          {
            latitude: this.state.list1.rows[i].latitude,
            longitude: this.state.list1.rows[i].longitude
          },
          { latitude: this.state.latitude, longitude: this.state.longitude }
        );
        console.log(
          "userID: " +
            this.state.list1.rows[i].userID +
            ", distance: " +
            distance
        );
        if (i == 0) {
          min = distance;
          minUser = i;
        } else if (distance < min) {
          min = distance;
          minUser = i;
        }
      }
      console.log(
        "shortest distance is " +
          min +
          ", which is user: " +
          this.state.list1.rows[minUser].userID
      );
      this.setState({
        driverID: this.state.list1.rows[minUser].userID,
        driver_address: this.state.list1.rows[minUser].addressText,
        driver_latitude: this.state.list1.rows[minUser].latitude,
        driver_longitude: this.state.list1.rows[minUser].longitude,
        driverScheduleID: this.state.list1.rows[minUser].idDriver,
        driver_coordinates: {
          latitude: this.state.list1.rows[minUser].latitude,
          longitude: this.state.list1.rows[minUser].longitude
        },
        foundDriver: true
      });
      console.log("driverID: " + this.state.driverID);
      this.insertRideToServer();
    }
  }

  insertRideToServer() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/submit_ride_info.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rider_address: this.state.address,
        rider_loc_lat: this.state.latitude,
        rider_loc_long: this.state.longitude,
        riderID: this.state.userID,
        driverID: this.state.driverID,
        driver_address: this.state.driver_address,
        driver_latitude: this.state.driver_latitude,
        driver_longitude: this.state.driver_longitude,
        driverScheduleID: this.state.driverScheduleID
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Should have inserted ride, updated Driver Schedule to "Not Usable", and update the Queue for rider to "Served".
        if (responseJson.error == 0) {
          this.setState({
            rideID: responseJson.rideID
          });

          this.timerCheckAccepted = setInterval(() => {
            fetch(
              "http://cis-linux2.temple.edu/~tuf70921/php/check_if_accepted.php",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  rideID: this.state.rideID
                })
              }
            )
              .then(response => response.json())
              .then(responseJson => {
                if (responseJson.error == 0) {
                  this.setState({
                    status: responseJson.status
                  });
                } else {
                  Alert.alert("Error");
                  status = "Error";
                }

                if (responseJson.status === "Accepted") {
                  console.log("status: " + responseJson.status);
                  this.setState({
                    loader: false,
                    acceptedRide: true,
                    driverName: responseJson.driverName,
                    driverEmail: responseJson.driverEmail,
                    driverPhoneNumber: responseJson.driverPhoneNumber
                  });
                  this.checkForCoordinates();
                  // this.checkIfAccepted = setInterval(() => {
                  //   if (this.state.acceptedRide == true) {
                  //     this.checkForCoordinates();
                  //   }
                  // }, 2000);

                  clearInterval(this.timerCheckAccepted);
                } else if (responseJson.status === "Declined") {
                  console.log("status: " + responseJson.status);
                  this.setState({
                    loader: true,
                    foundDriver: false,
                    acceptedRide: false
                  });
                  clearInterval(this.timerCheckAccepted);
                  Alert.alert(
                    "Driver declined",
                    "Looking for new driver",
                    [
                      {
                        text: "Ok",
                        onPress: () => this.putIntoQueue()
                      }
                    ],
                    { cancelable: false }
                  );
                }
              })
              .catch(error => {
                Alert.alert("Error: " + error.toString());
              });
          }, 10000);
        } else {
          Alert.alert("Error. " + responseJson.errorMessage);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // calcDistance() {
  //   return (
  //     haversine(
  //       {
  //         latitude: parseFloat(this.state.latitude),
  //         longitude: parseFloat(this.state.longitude)
  //       },
  //       {
  //         latitude: parseFloat(this.state.driver_latitude),
  //         longitude: parseFloat(this.state.driver_longitude)
  //       }
  //     ) || 0
  //   );
  // }

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timerCheckAccepted);
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/updateQueueToServed.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idRider: this.state.userID,
          idQueue: this.state.idQueue
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Queue successfully updated Status to served.") {
          console.log(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
      });
    navigator.geolocation.clearWatch(this.watchID);
  }

  checkForCoordinates() {
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/getCoordinates.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ride_ID: this.state.rideID
      })
    })
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
      fetch("http://cis-linux2.temple.edu/~tuf41055/php/getCoordinates.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ride_ID: this.state.rideID
        })
      })
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
            coordinatesChecked: true
          });

          console.log(this.state.routeCoordinates);
        })
        .catch(error => {
          console.error(error);
        });
    }, 10000);
  }

  renderDriver() {
    const coordinates = [
      {
        latitude: parseFloat(this.state.latitude),
        longitude: parseFloat(this.state.longitude)
      },
      {
        latitude: parseFloat(this.state.driver_latitude),
        longitude: parseFloat(this.state.driver_longitude)
      }
    ];

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
              <Text style={styles1.topBarContent}>{this.state.driverName}</Text>
            </View>
            <View style={styles1.topBarGroup}>
              <Text style={styles1.topBarHeader}>Phone Number</Text>
              <Text style={styles1.topBarContent}>
                {this.state.driverPhoneNumber}
              </Text>
            </View>
            <View style={styles1.topBarGroup}>
              <Text style={styles1.topBarHeader}>E-mail</Text>
              <Text style={styles1.topBarContent}>
                {this.state.driverEmail}
              </Text>
            </View>
          </View>
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
              <Text style={styles1.bottomBarContent}>{this.state.address}</Text>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "darkred",
          justifyContent: "center"
        }}
      >
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
        >
          {this.state.loader ? (
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
                  fontFamily: "Quicksand",
                  fontSize: 30,
                  paddingTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50
                }}
              >
                Looking for Driver...
              </Text>
              <ActivityIndicator size="large" color="white" />
              {this.state.foundDriver ? (
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Quicksand",
                    fontSize: 30,
                    paddingTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 50
                  }}
                >
                  Found Driver
                </Text>
              ) : null}
              {this.state.foundDriver ? (
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Quicksand",
                    fontSize: 30,
                    paddingTop: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  Waiting for Driver..
                </Text>
              ) : null}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,

                  margin: 10
                }}
              >
                {this.renderDriver()}
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    );
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
