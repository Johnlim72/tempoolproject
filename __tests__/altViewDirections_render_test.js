import "react-native";
import React from "react";
import AltViewDirectionsScreen from "../Views/AltViewDirectionsScreen.js";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("AltViewDirections screen renders correctly", () => {
  const tree = renderer.create(<AltViewDirectionsScreen />);
});

const updateCoordinatesCompRideObj = require('../Views/AltViewDirectionsScreen.js');
//fetchs updateCompletedMatched.php
describe('update coordinates to complete the ride', function() {
    test('Should return true after updating coordinates to complete the ride', function() {
        expect(updateCoordinatesCompletedRide()).toBe(true);
    });
});
