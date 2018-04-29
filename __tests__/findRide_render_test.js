import "react-native";
import React from "react";
import FindRideScreen from "../Views/FindRideScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("findRideNow renders correctly", () => {
  const tree = renderer.create(<FindRideScreen />);
});

const findRideNowObj = require('../Views/FindRideScreen.js');
//fetchs putIntoQueue.php
describe('insert rider into queue test', function() {
    test('Should return true inserting ride into queue', function() {
        expect(putIntoQueue()).toBe(true);
    });
});

//fetchs checkIfNextInQueue.php
describe('waiting for to be next in queue test', function() {
    test('Should return true inserting ride into queue', function() {
        expect(waitForQueue()).toBe(true);
    });
});
