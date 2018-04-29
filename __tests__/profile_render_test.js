import "react-native";
import React from "react";
import ProfileScreen from "../Views/ProfileScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("profile screen renders correctly", () => {
  const tree = renderer.create(<ProfileScreen />);
});

const ProfileScreenObj = require('../Views/ProfileScreen.js');
//fetchs prepopulate.php
describe('prepopulating users info', function() {
    test('Should return true after prepopulating users info', function() {
        expect(prepopulate()).toBe(true);
    });
});
