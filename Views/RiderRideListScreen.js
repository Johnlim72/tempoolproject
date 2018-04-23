import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
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
import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");
const background = require("./dark.jpg");

export default class RiderRideListScreen extends React.Component {
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
      typeOfRides: "Potential",
      colorPotential: "green",
      colorAccepted: "darkred",
      colorPast: "darkred"
    };

    console.log(
      "constructor: " +
        this.state.TextUserID +
        " " +
        this.state.TextEmail +
        " " +
        this.state.typeOfRides
    );
  }

  OpenDetailsActivity(idUsers) {
    this.props.navigation.navigate("RiderRideDetails", {
      ListViewClickItemHolder: idUsers.rowDriverID,
      ListViewClickItemHolder2: idUsers.rowRiderID,
      ListViewClickItemHolder3: idUsers.rowRideID,
      typeOfRides: this.state.typeOfRides
    });
  }

  componentDidMount() {
    return fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/listOfRiderRides.php",
      {
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
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);

        if (responseJson == "No strings found.") {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows([])
          });
          Alert.alert(
            "No Rides For You Yet",
            "Please wait for Riders to request a ride to you.",
            [
              {
                text: "Ok"
              },
              {
                text: "Cancel"
              }
            ],
            { cancelable: false }
          );
        } else {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson)
          });
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

  _renderRow(rowData) {
    return (
      <View style={[styles.Container, { marginVertical: 2 }]}>
        <Text style={styles.rowViewContainer}>
          {"Name: " +
            rowData.firstName +
            " " +
            rowData.lastName +
            " \nPick-up Time: " +
            rowData.rider_datetime}
        </Text>

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
          onPress={this.OpenDetailsActivity.bind(this, {
            rowDriverID: rowData.driverID,
            rowRiderID: rowData.riderID,
            rowRideID: rowData.ride_ID
          })}
        >
          Click to View Ride
        </Button>
      </View>
    );
  }

  updateType(typeOfRides) {
    this.setState({ typeOfRides: typeOfRides });
    if (typeOfRides == "Potential") {
      //set state of potential color to green and others to red
      this.setState({
        colorPotential: "green",
        colorAccepted: "darkred",
        colorPast: "darkred"
      });
    } else if (typeOfRides == "Accepted") {
      //set state of accepted color to green and others to red
      this.setState({
        colorPotential: "darkred",
        colorAccepted: "green",
        colorPast: "darkred"
      });
    } else if (typeOfRides == "Past") {
      //set state of past color to green and others to red
      this.setState({
        colorPotential: "darkred",
        colorAccepted: "darkred",
        colorPast: "green"
      });
    }

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
        if (responseJson == "No strings found.") {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows([])
          });
          Alert.alert(
            "No Rides For You Yet",
            "Please wait for Riders to request a ride to you.",
            [
              {
                text: "Ok"
              },
              {
                text: "Cancel"
              }
            ],
            { cancelable: false }
          );
        } else {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson)
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // <Picker
  //   selectedValue={this.state.typeOfRides}
  //   onValueChange={value => this.updateType(value)}
  // >
  //   <Picker.Item label="Potential" value="Potential" />
  //   <Picker.Item label="Accepted" value="Accepted" />
  //   <Picker.Item label="Past" value="Past" />
  // </Picker>

  renderHeader = () => {
    var header = (
      <View style={styles1.header_footer_style}>
        <View style={{ width: "30%", marginHorizontal: 5 }}>
          <Button
            style={{
              backgroundColor: this.state.colorPotential,
              borderColor: this.state.colorPotential,
              borderRadius: 22,
              borderWidth: 2
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={() => this.updateType("Potential")}
          >
            Potential
          </Button>
        </View>

        <View style={{ width: "30%", marginHorizontal: 5 }}>
          <Button
            style={{
              backgroundColor: this.state.colorAccepted,
              borderColor: this.state.colorAccepted,
              borderRadius: 22,
              borderWidth: 2
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={() => this.updateType("Accepted")}
          >
            Accepted
          </Button>
        </View>
        <View style={{ width: "30%", marginHorizontal: 5 }}>
          <Button
            style={{
              backgroundColor: this.state.colorPast,
              borderColor: this.state.colorPast,
              borderRadius: 22,
              borderWidth: 2
            }}
            textStyle={{
              fontSize: 18,
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: "400"
            }}
            onPress={() => this.updateType("Past")}
          >
            Past
          </Button>
        </View>
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
          enableEmptySections={true}
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
    flexDirection: "row",
    margin: 5
  },

  textStyle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    padding: 7
  }
});
