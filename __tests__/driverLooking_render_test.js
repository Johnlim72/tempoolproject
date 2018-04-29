import "react-native";
import React from "react";
import DriverLookingScreen from "../Views/DriverLookingScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("driver looking screen renders correctly", () => {
  const tree = renderer.create(<DriverLookingScreen />);
});

const driverLookingObj = require('../Views/DriverLookingScreen.js');
//fetchs submit_driver_info.php
describe('update schedule for looking', function() {
    test('Should return true after updating schedule for looking ', function() {
        expect(updatingScheduleForLooking()).toBe(true);
    });
});
