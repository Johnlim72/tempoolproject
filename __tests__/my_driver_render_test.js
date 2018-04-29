import "react-native";
import React from "react";
import MyDriverScreen from "../Views/MyDriverScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("map screen renders correctly", () => {
  const tree = renderer.create(<MyDriverScreen />);
});

const MapScreenObj = require('../Views/MyDriverScreen.js');
//fetchs getMatchedRide.php
describe('testing to get matched ride for user', function() {
    test('Should return true after getting ride for user', function() {
        expect(getRide()).toBe(true);
    });
});
