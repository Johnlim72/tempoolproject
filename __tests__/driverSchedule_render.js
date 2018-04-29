import "react-native";
import React from "react";
import DriverScheduleScreen from "../Views/DriverScheduleScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("driver schedule renders correctly", () => {
  const tree = renderer.create(<DriverScheduleScreen />);
});

const driverScheduleObj = require('../Views/DriverScheduleScreen.js');
//fetchs submit_driver_info.php
describe('insert driver to server' , function() {
    test('Should return true inserting driver to server', function() {
        expect(InsertDriverToServer()).toBe(true);
    });
});
