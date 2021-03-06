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

export default class StartLookingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      TextUserID: this.props.navigation.state.params.TextUserID,
      TextRiderName: "",
      TextDate: "",
      TextLocation: "",
      isLoading: true,
      dataSource: ""
    };
  }

  componentDidMount() {
    return fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/getDriverSchedule.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUser: this.props.navigation.state.params.TextUserID
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
            "You haven't input any schedules yet.",
            "Would you like to input a schedule?",
            [
              {
                text: "Yes",
                onPress: () =>
                  this.props.navigation.navigate("Location", {
                    userID: this.state.TextUserID,
                    TextEmail: this.state.TextEmail
                  })
              },
              {
                text: "No",
                onPress: () =>
                  this.props.navigation.navigate("Dashboard", {
                    userID: this.state.TextUserID,
                    TextEmail: this.state.TextEmail
                  })
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
          Alert.alert(
            "Pick one of your schedules",
            "Choose which one would you like to use for riders to be able to request",
            [
              {
                text: "Ok"
              }
            ],
            { cancelable: false }
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

  _renderRow(rowData) {
    return (
      <View style={[styles.Container, { marginVertical: 2 }]}>
        <Text style={styles.rowViewContainer}>
          {"Address: " +
            rowData.addressText +
            " \nLeaving Time: " +
            rowData.departureDateTime}
        </Text>
        <View
          style={{
            width: "100%",
            height: 45,
            flexDirection: "row",
            marginBottom: 5
          }}
        >
          <View style={{ width: "98%", marginHorizontal: 5 }}>
            <Button
              style={{
                backgroundColor: "navy",
                borderColor: "navy",
                borderRadius: 22,
                borderWidth: 2
              }}
              textStyle={{
                fontSize: 18,
                color: "white",
                fontFamily: "Quicksand",
                fontWeight: "400"
              }}
              onPress={() =>
                Alert.alert(
                  "Are you sure?",
                  "You will start getting requests as soon as you choose a schedule",
                  [
                    {
                      text: "Yes",
                      onPress: () =>
                        this.props.navigation.navigate("DriverLooking", {
                          userID: this.state.TextUserID,
                          rowData: rowData
                        })
                    },
                    {
                      text: "No"
                    }
                  ],
                  { cancelable: false }
                )
              }
            >
              Choose this schedule
            </Button>
          </View>
        </View>
      </View>
    );
  }

  renderHeader = () => {
    var header = (
      <View style={styles1.header_footer_style}>
        <Text
          style={{
            fontFamily: "Quicksand",
            fontSize: 24,
            fontWeight: "400",
            color: "navy",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          Start Looking For Riders
        </Text>
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
    margin: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  textStyle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    padding: 7
  }
});
