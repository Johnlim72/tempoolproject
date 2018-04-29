import React from "react";
import { View, Button, Alert, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import styles from "./style";

export default class UpdateLocationScreen extends React.Component {
  state = {
    loader: false
  };

  constructor(props) {
    super(props);

    this.state = {
      TextAddress: "",
      TextLatitude: "",
      TextLongitude: "",
      rowData: this.props.navigation.state.params.rowData
    };
  }

  SaveLocation = () => {
    this.props.navigation.navigate("UpdateSchedule", {
      rowData: this.state.rowData
    });
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

          const rowData = this.state.rowData;
          rowData.addressText = this.state.TextAddress;
          rowData.latitude = this.state.TextLatitude;
          rowData.longitude = this.state.TextLongitude;
          this.forceUpdate();
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
          <View style={{ borderRadius: 5, margin: 10, marginTop: 2 }}>
            <Button title="Save" color="darkred" onPress={this.SaveLocation} />
          </View>
        )}
      /> // debounce the requests in ms. Set to 0 to remove debounce. By
    );
  }
}
