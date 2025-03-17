import { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import OrDivider from "../components/OrDivider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const logo = require("../assets/Logo.png");
const { width, height } = Dimensions.get("window");


export default function SignInScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setErrorMsg("");
                    setEmail("");
                    setPassword("");
                    setShowPassword(false);
                    navigation.navigate("Home");
                })
                .catch((err) => {
                    setErrorMsg(err.message);
                });
        } catch (error) {
            Alert.alert("Error On Sign In");
        }
    }

    return (
        <View style={styles.Container}>
            <Image source={logo} style={{ marginTop: 20, marginBottom: 5 }} />
            <Text style={styles.Heading}>Welcome back to</Text>
            <Text style={[styles.Heading, { marginBottom: 20 }]}>WhereAbouts</Text>

            <View style={styles.InputContainer}>
                <TextInput
                    style={styles.Input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <View style={styles.PasswordInputContainer}>
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign In"
                        customStyle={styles.signInButton}
                        onPress={handleSignIn}
                        isDisabled={email.length > 0 && password.length > 0 ? false : true}
                    />
                    <OrDivider />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Entypo name="facebook" size={24} color="#0b0b91" />
                        <Button
                            title="Sign In with Facebook"
                            customTextStyle={styles.googleSignIn}
                            isButton={false}
                            onPress={() => navigation.navigate("SignUp")}
                        />
                    </View>
                </View>

                <View style={[styles.buttonContainer, {position: 'relative', top: 50}]}>
                    <Button
                        title="Forgot Password?"
                        customTextStyle={styles.forgotPassword}
                        isButton={false}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    />
                    <Button
                        title="Create an Account"
                        customTextStyle={styles.createAccount}
                        isButton={false}
                        onPress={() => navigation.navigate("CreateAccount")}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        height: '100%'
    },
    Heading: {
        fontSize: 25,
        fontWeight: 600
    },
    InputContainer: {
        marginVertical: 30,
        padding: 20,
        width: width * 0.8,
    },
    Input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 40
    },
    PasswordInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    icon: {
        marginLeft: 10,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 40,
    },
    signInButton: {
        marginBottom: 20,
        width: "80%",
    },
    googleSignIn: {
        color: "#0b0b91"
    },
    forgotPassword: {
        color: "#000000",
        fontWeight: 'medium',
        marginBottom: 10
    },
    createAccount: {
        marginTop: 20,
        color: "#000000",
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        justifyContent: 'center',
        marginTop: 10
    }
})