import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
    title: string
    onPress: () => void
    isButton?: boolean
    customStyle?: any
    customTextStyle?: any
    isDisabled?: boolean
}

const Button = ({ title, onPress, isButton = true, customStyle, customTextStyle, isDisabled }: ButtonProps) => {
    return (
        <TouchableOpacity style={!isDisabled ? [isButton && styles.button, customStyle && customStyle] : [styles.disableBtn, customStyle && customStyle]} onPress={onPress}>
            <Text style={[isButton ? styles.text : styles.link, customTextStyle && customTextStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#00AEEF",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 10,
    },
    link: {
        // color: "#00AEEF",
        fontSize: 16,
        alignItems: "center",
        fontWeight: 'bold'
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    disableBtn: {
        alignItems: "center",
        backgroundColor: "#ccc",
        color: '#000000',
        pointerEvents: 'none',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 10,
    }
});

export default Button;
