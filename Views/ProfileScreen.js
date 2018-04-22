import React from "react";
import {
  AppRegistry,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextInput,
  AsyncStorage
} from "react-native";
import { StackNavigator } from "react-navigation"; // Version can be specified in package.json
import styles from "./style";
import { Switch } from "react-native-switch";
import Button from "apsl-react-native-button";

const { width, height } = Dimensions.get("window");
const background = require("./dark.jpg");

const USERID = "userID";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      TextInputFirstName: "",
      TextInputLastName: "",
      TextEmail: this.props.navigation.state.params.TextEmail,
      TextPassword: "",
      TextInputPhoneNumber: "",
      TextPasswordConfirm: "",
      theUser: "",
      status: "",
      SwitchOnValueHolder: true,
      disabled: false,
      userID: ""
    };
  }
  componentDidMount() {
    //this.props.navigation.state.params.Email

    const { TextInputFirstName } = "";
    const { TextInputLastName } = "";
    const { TextEmail } = this.props.navigation.state.params.TextEmail;
    const { TextPassword } = "";
    const { TextInputPhoneNumber } = "";

    //Alert.alert("Email: " + this.props.navigation.state.params.Email);

    fetch("http://cis-linux2.temple.edu/~tuf41055/php/prepopulate.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: TextInputFirstName,
        lastName: TextInputLastName,
        email: this.props.navigation.state.params.TextEmail,
        password: TextPassword,
        phoneNumber: TextInputPhoneNumber
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          TextInputFirstName: responseJson.firstName,
          TextInputLastName: responseJson.lastName,
          TextEmail: responseJson.email,
          TextPassword: "",
          TextPasswordConfirm: "",
          TextInputPhoneNumber: responseJson.phoneNumber,
          status: responseJson.status,
          userID: responseJson.idUser
        });

        if (responseJson.status == "Rider") {
          this.setState({
            SwitchOnValueHolder: true
          });
        } else {
          this.setState({
            SwitchOnValueHolder: false
          });
        }

        console.log(responseJson);
      })

      .catch(error => {
        console.error(error);
      });
  }

  ShowAlert = value => {
    //somehow need to merge with my function
    this.setState({
      SwitchOnValueHolder: value
    });

    if (value == true) {
      //the switch is on
      status = "Rider";
      console.log("status: " + status);
      this.setState({ disabled: false });
      this.updateStatus(status);
    } else {
      status = "Driver";
      console.log("status: " + status);
      this.setState({ disabled: true }); //the switch is off
      this.updateStatus(status);
    }
  };
  //rider is true driver is false
  updateStatus(status) {
    this.setState({ status: status });
    console.log("status: " + status);
    fetch("http://cis-linux2.temple.edu/~tuf41055/php/status_update.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        TextEmail: this.state.TextEmail,
        status: status
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          StatusText: responseJson.status
        });

        console.log("status: " + this.state.status);
      })

      .catch(error => {
        console.error(error);
      });
  }

  UpdateDataToServer = () => {
    const { TextInputFirstName } = this.state;
    const { TextInputLastName } = this.state;
    const { TextEmail } = this.state;
    const { TextPassword } = this.state;
    const { TextPasswordConfirm } = this.state;
    const { TextInputPhoneNumber } = this.state;

    if (
      TextInputFirstName != "" &&
      TextInputLastName != "" &&
      TextEmail != "" &&
      TextPassword != "" &&
      TextInputPhoneNumber != "" &&
      TextPasswordConfirm != ""
    ) {
      if (TextPassword === TextPasswordConfirm) {
        var emailDomain = TextEmail.substr(
          TextEmail.length - 10,
          TextEmail.length
        );

        if (emailDomain === "temple.edu") {
          fetch(
            "http://cis-linux2.temple.edu/~tuf41055/php/update_user_info.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                firstName: TextInputFirstName,
                lastName: TextInputLastName,
                email: TextEmail,
                password: TextPassword,
                phoneNumber: TextInputPhoneNumber
              })
            }
          )
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson === "User successfully updated.") {
                //Then open Profile activity and send user email to profile activity.

                Alert.alert(
                  "Success!",
                  "User updated",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("Dashboard", {
                          TextEmail: this.state.TextEmail,
                          userID: this.state.userID
                        })
                    }
                  ],
                  { cancelable: false }
                );
                console.log(responseJson);
              } else {
                Alert.alert(responseJson);
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          Alert.alert("Please use a temple.edu email");
        }
      } else {
        Alert.alert("Passwords don't match");
      }
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "darkred",
          justifyContent: "center",
          alignItems: "center",
          width,
          height
        }}
      >
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
          blurRadius={3}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 10
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Quicksand",
                fontSize: 35,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                textShadowColor: "#000000"
              }}
            >
              Profile
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                margin: 20,
                marginBottom: 30
              }}
            >
              <ScrollView>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  First Name
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor="#b3b3b3"
                    placeholder="First Name"
                    defaultValue={this.state.TextInputFirstName}
                    onChangeText={TextInputFirstName =>
                      this.setState({ TextInputFirstName })
                    }
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                  />
                </View>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  Last Name
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor="#b3b3b3"
                    placeholder="Last Name"
                    defaultValue={this.state.TextInputLastName}
                    onChangeText={TextInputLastName =>
                      this.setState({ TextInputLastName })
                    }
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                  />
                </View>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  TU E-mail
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="TU E-mail"
                    placeholderTextColor="#b3b3b3"
                    defaultValue={this.state.TextEmail}
                    editable={false}
                    onChangeText={TextEmail => this.setState({ TextEmail })}
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                  />
                </View>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  Password
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor="#b3b3b3"
                    placeholder="Password"
                    defaultValue={this.state.TextPassword}
                    onChangeText={TextPassword =>
                      this.setState({ TextPassword })
                    }
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                    secureTextEntry
                  />
                </View>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  Confirm Password
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor="#b3b3b3"
                    placeholder="Confirm Password"
                    defaultValue={this.state.TextPasswordConfirm}
                    onChangeText={TextPasswordConfirm =>
                      this.setState({ TextPasswordConfirm })
                    }
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                    secureTextEntry
                  />
                </View>
                <Text
                  style={{
                    color: "darkred",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    textDecorationLine: "underline",
                    fontFamily: "Quicksand"
                  }}
                >
                  Phone Number
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor="#b3b3b3"
                    placeholder="Phone Number"
                    defaultValue={this.state.TextInputPhoneNumber}
                    onChangeText={TextInputPhoneNumber =>
                      this.setState({ TextInputPhoneNumber })
                    }
                    style={[
                      styles.input,
                      { color: "black", fontFamily: "Quicksand" }
                    ]}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                      marginTop: 20
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 50,
                        paddingTop: 0,
                        borderRadius: 5,
                        backgroundColor: "white"
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row"
                        }}
                      >
                        <Text
                          style={{
                            marginRight: 10,
                            fontFamily: "Quicksand",
                            fontWeight: "400",
                            color: "black"
                          }}
                        >
                          Driver
                        </Text>
                        <Switch
                          onValueChange={value => this.ShowAlert(value)}
                          activeText={""}
                          inActiveText={""}
                          disabled={false}
                          circleSize={30}
                          barHeight={30}
                          circleBorderWidth={3}
                          backgroundActive={"darkred"}
                          backgroundInactive={"#003399"}
                          circleActiveColor={"#cc0000"}
                          circleInActiveColor={"#1a75ff"}
                          style={{
                            transform: [{ scaleX: 10 }, { scaleY: 0.8 }]
                          }}
                          value={this.state.SwitchOnValueHolder}
                        />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontFamily: "Quicksand",
                            fontWeight: "400",
                            color: "black"
                          }}
                        >
                          Rider
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

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
                  onPress={this.UpdateDataToServer}
                >
                  Save
                </Button>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
