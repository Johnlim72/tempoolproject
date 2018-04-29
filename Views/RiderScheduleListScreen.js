import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
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

export default class RiderScheduleListScreen extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false,
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
      dataSource: ""
    };
  }

  componentDidMount() {
    return fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/getRiderSchedule.php",
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
          <View style={{ width: "47%", marginHorizontal: 5 }}>
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
              onPress={() => this.updateSchedule(rowData)}
            >
              Edit
            </Button>
          </View>
          <View style={{ width: "47%", marginHorizontal: 5 }}>
            <Button
              style={{
                backgroundColor: "darkred",
                borderColor: "darkred",
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
                  "Warning",
                  "Are you sure you want to delete this schedule?",
                  [
                    {
                      text: "OK",
                      onPress: () => this.deleteSchedule(rowData)
                    },
                    { text: "Cancel" }
                  ],
                  { cancelable: true }
                )
              }
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    );
  }

  updateSchedule(rowData) {
    this.props.navigation.navigate("UpdateRiderSchedule", {
      rowData: rowData
    });
  }

  deleteSchedule(rowData) {
    fetch(
      "http://cis-linux2.temple.edu/~tuf41055/php/deleteRiderSchedule.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rowData.id
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //Then open Profile activity and send user email to profile activity.
        if (responseJson == "Schedule successfully deleted.") {
          Alert.alert(
            "Success!",
            "Schedule deleted.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("RiderScheduleList", {
                    TextUserID: this.state.TextUserID,
                    TextEmail: this.props.navigation.state.params.TextEmail
                  })
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

  renderHeader = () => {
    var header = (
      <View
        style={{
          flex: 0.1,
          margin: 10,
          marginTop: 20,
          marginBottom: 0
        }}
      >
        <Button
          style={{
            borderColor: "black",
            borderRadius: 22,
            borderWidth: 2,
            width: "10%"
          }}
          textStyle={{
            fontSize: 18,
            color: "white",
            fontFamily: "Quicksand",
            fontWeight: "400"
          }}
          onPress={() =>
            this.props.navigation.navigate("Dashboard", {
              TextEmail: this.props.navigation.state.params.TextEmail,
              Status: this.state.SwitchOnValueHolder,
              userID: this.state.TextUserID,
              findRideNow: false
            })
          }
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("./home.png")}
          />
        </Button>
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
