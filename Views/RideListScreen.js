import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  ListView,
  Dimensions,
  ActivityIndicator,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";

const { width, height } = Dimensions.get("window");
const background = require("./login3_bg.jpg");

export default class RideListScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextRiderName: "",
      TextDate: "",
      TextLocation: "",
      isLoading: true,
      dataSource: ""
    };
  }

  OpenDetailsActivity(driver_email) {
    this.props.navigation.navigate("RideDetails", {
      ListViewClickItemHolder: driver_email
    });
  }

  componentDidMount() {
    return fetch("http://cis-linux2.temple.edu/~tuf41055/php/listOfRides.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driver_email: this.props.navigation.state.params.TextEmail
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson == null) {
          Alert.alert(
            "No Rides For You Yet",
            "Please wait for Riders to request a ride to you.",
            [
              {
                text: "Ok",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder
                  })
              },
              {
                text: "Cancel",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    TextEmail: this.props.navigation.state.params.TextEmail,
                    Status: this.state.SwitchOnValueHolder
                  })
              }
            ],
            { cancelable: false }
          );
        } else {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.setState(
            {
              isLoading: false,
              dataSource: ds.cloneWithRows(responseJson)
            },
            function() {
              // In this block you can do something with new state.
            }
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#000"
        }}
      />
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.MainContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderSeparator={this.ListViewItemSeparator}
          renderRow={rowData => (
            <Text
              style={styles.rowViewContainer}
              onPress={this.OpenDetailsActivity.bind(
                this,
                rowData.driver_email
              )}
            >
              {" "}
              {rowData.rider_name + "'s ride"}{" "}
            </Text>
          )}
        />
      </View>
    );
  }
}
