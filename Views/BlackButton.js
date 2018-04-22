import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default class BlackButton extends React.Component {
  title: string;
  render() {
    const { title } = this.props;
    return (
      <View>
        <Text
          style={{
            backgroundColor: "white",
            borderRadius: 1,
            marginLeft: 1,
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          <Text>{this.state.title}</Text>
        </Text>
      </View>
    );
  }
}
