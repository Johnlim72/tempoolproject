import "react-native";
import React from "react";
import DashboardScreen from "../Views/DashboardScreen";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("dashboard renders correctly", () => {
  const tree = renderer.create(<DashboardScreen />);
});

const dashboardObj = require('../Views/DashboardScreen.js');
//fetchs getUser.php
describe('get user to get information to pass to other screens', function() {
    test('Should return true after getting user', function() {
        expect(getUserAndNavToList()).toBe(true);
    });
});
