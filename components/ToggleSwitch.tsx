import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const ToggleSwitch = ({isEnabled, setIsEnabled, offText, onText}: any) => {

  const toggleSwitch = () => setIsEnabled((previousState: boolean) => !previousState);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, !isEnabled && styles.activeLabel]}>{offText || "Off"}</Text>
      <Switch
        trackColor={{ false: "#ccc", true: "#80e8f7" }}
        thumbColor={isEnabled ? "#00BAD6" : "#e0e0e0"}
        ios_backgroundColor="#ccc"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={[styles.label, isEnabled && styles.activeLabel]}>{onText || "On"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginHorizontal: 5,
  },
  activeLabel: {
    color: "#000",
  },
});

export default ToggleSwitch;
