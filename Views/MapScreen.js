import React from "react";
import { View, Button, Alert, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import styles from "./style";

export default class MapScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextAddress: "",
      TextLatitude: "",
      TextLongitude: ""
    };
  }

  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed="true" // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description || row.vicinity} // custom description render
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
          // console.log(
          //   "states: " +
          //     this.state.TextLatitude +
          //     " " +
          //     this.state.TextLongitude +
          //     " " +
          //     this.state.TextAddress
          // );
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
            color: "blue"
          },
          predefinedPlacesDescription: {
            color: "#1faadb"
          }
        }}
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          rankby: "distance"
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        filterReverseGeocodingByTypes={["street_address"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={200}
        renderRightButton={() => <Button title="Save" color="darkred" />}
      /> // debounce the requests in ms. Set to 0 to remove debounce. By
    );
  }
}
