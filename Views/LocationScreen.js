import React from "react";
import { View, Button, Alert, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import styles from "./style";

export default class MapScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loader: false
  };

  constructor(props) {
    super(props);

    this.state = {
      userID: this.props.navigation.state.params.userID,
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextAddress: "",
      TextLatitude: "",
      TextLongitude: "",
      Status: this.props.navigation.state.params.Status,
      findRideNow: this.props.navigation.state.params.findRideNow,
      FindOrSchedule: this.props.navigation.state.params.FindOrSchedule
    };
  }

  SaveLocation = () => {
    if (this.state.findRideNow) {
      this.props.navigation.navigate("FindRide", {
        TextAddress: this.state.TextAddress,
        TextLatitude: this.state.TextLatitude,
        TextLongitude: this.state.TextLongitude,
        userID: this.props.navigation.state.params.userID,
        TextEmail: this.props.navigation.state.params.TextEmail,
        Status: this.props.navigation.state.params.Status,
        FindOrSchedule: this.props.navigation.state.params.FindOrSchedule,
        userID: this.props.navigation.state.params.userID
      });
    } else {
      this.props.navigation.navigate("Schedule", {
        TextAddress: this.state.TextAddress,
        TextLatitude: this.state.TextLatitude,
        TextLongitude: this.state.TextLongitude,
        TextEmail: this.props.navigation.state.params.TextEmail,
        Status: this.props.navigation.state.params.Status,
        FindOrSchedule: this.props.navigation.state.params.FindOrSchedule,
        userID: this.props.navigation.state.params.userID
      });
    }
  };

  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed="true" // true/false/undefined
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          // console.log(details);

          this.setState({
            TextLatitude: details.geometry.location.lat.toString()
          });
          this.setState({
            TextLongitude: details.geometry.location.lng.toString()
          });
          this.setState({
            TextAddress: details.formatted_address.toString()
          });
        }}
        getDefaultValue={() => ""}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: "AIzaSyBc_Lzr0bU6n30DEFm9JfhQQG86-hGLvuI",
          language: "en", // language of the results
          types: "address" // default: 'geocode'
        }}
        styles={{
          textInputContainer: {
            width: "100%"
          },
          description: {
            fontWeight: "bold",
            color: "black"
          },
          predefinedPlacesDescription: {
            color: "#1faadb"
          }
        }}
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places l
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          rankby: "distance"
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        filterReverseGeocodingByTypes={["street_address"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={200}
        renderRightButton={() => (
          <Button title="Save" color="darkred" onPress={this.SaveLocation} />
        )}
      /> // debounce the requests in ms. Set to 0 to remove debounce. By
    );
  }
}
