import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Text,
  Picker,
  ImageBackground,
  ListView,
  Dimensions,
  ActivityIndicator,
  Platform,
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
      TextUserID: this.props.navigation.state.params.TextUserID,
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextRiderName: "",
      TextDate: "",
      TextLocation: "",
      isLoading: true,
      dataSource: "",
      typeOfRides: "Potential"
    };

    console.log(
      "constructor: " + this.state.TextUserID + " " + this.state.TextEmail
    );
  }

  OpenDetailsActivity(idUsers) {
    this.props.navigation.navigate("RideDetails", {
      ListViewClickItemHolder: idUsers.rowDriverID,
      ListViewCLickItemHolder2: idUsers.rowRiderID,
      typeOfRides: this.state.typeOfRides
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
        //idUser: this.state.TextUserID
        idUser: this.props.navigation.state.params.TextUserID,
        typeOfRides: this.state.typeOfRides
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);

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

  _renderRow(rowData) {
    return (
      <View style={[styles.Container, { marginVertical: 10 }]}>
        <Text style={styles.rowViewContainer}>
          {rowData.riderID + " \n" + rowData.rider_datetime}
        </Text>
        <Button
          title="Click to View Ride"
          color="darkred"
          onPress={this.OpenDetailsActivity.bind(this, {
            rowDriverID: rowData.driverID,
            rowRiderID: rowData.riderID
          })}
        />
      </View>
    );
  }

  updateType(typeOfRides) {
    this.setState({ typeOfRides: typeOfRides });

    return fetch("http://cis-linux2.temple.edu/~tuf41055/php/listOfRides.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //idUser: this.state.TextUserID
        idUser: this.props.navigation.state.params.TextUserID,
        typeOfRides: typeOfRides
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson == "No Results Found.") {
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

  renderHeader = () => {
    var header = (
      <View style={styles1.header_footer_style}>
        <Picker
          selectedValue={this.state.typeOfRides}
          onValueChange={value => this.updateType(value)}
        >
          <Picker.Item label="Potential" value="Potential" />
          <Picker.Item label="Accepted" value="Accepted" />
          <Picker.Item label="Past" value="Past" />
        </Picker>
      </View>
    );

    return header;
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
          renderHeader={this.renderHeader}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}

const styles1 = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: Platform.OS == "ios" ? 20 : 0
  },

  rowViewContainer: {
    padding: 10,
    fontSize: 18,
    height: 44
  },

  header_footer_style: {
    width: "100%",
    height: 45,
    backgroundColor: "white"
  },

  textStyle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    padding: 7
  }
});
