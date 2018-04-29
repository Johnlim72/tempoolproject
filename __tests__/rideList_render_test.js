import "react-native";
import React from "react";
import RideListScreen from "../Views/RideListScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("rideList screen now renders correctly", () => {
  const tree = renderer.create(<RideListScreen />);
});

const rideListObj = require('../Views/RideListScreen.js');
//fetchs listOfRides.php
describe('getting the list of rides for a user ', function() {
    test('Should return true after getting rides for user', function() {
        expect(updateType("Potential")).toBe(true);
    });
});
