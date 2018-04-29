import "react-native";
import React from "react";
import RideDetailsScreen from "../Views/RideDetailsScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("rideDetails screen now renders correctly", () => {
  const tree = renderer.create(<RideDetailsScreen />);
});

const rideDetailsObj = require('../Views/RideDetailsScreen.js');
//fetchs updateScheduleForLooking.php
describe('updating the ride information ', function() {
    test('Should return true after updating updating ride information', function() {
        expect(updateRide()).toBe(true);
    });
});
