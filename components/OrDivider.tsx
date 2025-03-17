import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrDivider() {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>OR</Text>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        width: '100%'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    text: {
        marginHorizontal: 10,
        color: "#999",
        fontSize: 16,
        fontWeight: "bold",
    },
});
