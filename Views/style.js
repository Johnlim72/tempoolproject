import React, { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  bigblue: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30
  },
  red: {
    color: "red"
  },
  background: {
    width,
    height
  },
  bigred: {
    color: "red",
    fontSize: 30
  },
  buttonContainer: {
    margin: 20,
    backgroundColor: "white",
    ...Platform.select({
        ios: {
          backgroundColor: 'darkred',
        },
        android: {
          backgroundColor: 'darkred',
        },
      }),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 20
  },


  textInput: {
    //
    height: 30, //
    margin: 5, //
    borderWidth: 1,
    backgroundColor: "lightgray", //
    borderColor: "#000" //
  },
  textInputFalse: {
    //
    height: 30, //
    margin: 5, //
    borderWidth: 1,
    backgroundColor: "lightgray", //
    borderColor: "#000", //
    color: "gray"
  },
  container: {
    flex: 1
  },
  markWrap: {
    flex: 1,
    paddingVertical: 60
  },
  mark: {
    width: null,
    height: null,
    flex: 1
  },
  background: {
    width,
    height
  },
  wrapper: {
    paddingVertical: 30
  },
  inputWrap: {
    flexDirection: "row",
    marginBottom: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    height: 20,
    width: 20
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: "white",
    ...Platform.select({
        ios: {
          backgroundColor: 'darkred',
        },
        android: {
          backgroundColor: 'darkred',
        },
      }),
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18
  },
  forgotPasswordText: {
    color: "#D8D8D8",
    backgroundColor: "transparent",
    textAlign: "right",
    fontSize: 18,
    paddingRight: 15
  },
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  accountText: {
    color: "#D8D8D8",
    fontSize: 18
  },
  signupLinkText: {
    color: "#FFF",
    marginLeft: 5
  },
  signUpButton: {
    backgroundColor: "white",
    borderRadius: 5,
    marginLeft: 5
  }
});
