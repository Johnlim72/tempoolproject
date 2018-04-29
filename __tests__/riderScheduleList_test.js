import "react-native";
import React from "react";
import Example from "../Views/Example";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<Example />);
});
