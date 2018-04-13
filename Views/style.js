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
        backgroundColor: "white"
      },
      android: {
        backgroundColor: "darkred"
      }
    }),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 20
  },
  buttonContainer2: {
    margin: 20,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        backgroundColor: "white"
      },
      android: {
        backgroundColor: "#003399"
      }
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
    height: 40
  },
  inputWrapAddress: {
    flexDirection: "row",

    height: 80
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
  inputAddress: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    height: 80
  },
  button: {
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        backgroundColor: "white"
      },
      android: {
        backgroundColor: "darkred"
      }
    }),
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 10,
    marginHorizontal: 5
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
  },
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    margin: 10
  },
  rowViewContainer: {
    fontSize: 20,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "Quicksand-Regular"
  },
  textViewContainer: {
    padding: 5,
    fontSize: 20,
    color: "black",
    fontFamily: "Quicksand-Regular"
  },
  textViewContainer2: {
    padding: 5,
    fontSize: 20,
    color: "darkred",
    fontFamily: "Quicksand-Regular"
  }
});
