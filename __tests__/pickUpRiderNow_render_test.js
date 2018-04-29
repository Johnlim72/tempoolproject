import "react-native";
import React from "react";
import PickUpRiderNow from "../Views/PickUpRiderNow";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("Pick up rider now renders correctly", () => {
  const tree = renderer.create(<PickUpRiderNow />);
});

const pickUpRiderNowObj = require('../Views/PickUpRiderNow.js');
//fetchs updateScheduleForLooking.php
describe('update schedule for driver for looking for a rider ', function() {
    test('Should return true after updating schedule', function() {
        expect(updateScheduleForLooking()).toBe(true);
    });
});
