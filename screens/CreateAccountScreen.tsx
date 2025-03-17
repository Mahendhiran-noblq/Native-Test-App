import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Linking,
    Modal
} from "react-native";
import PaginationDot from "react-native-dots-pagination";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-native-phone-number-input";
import RNPickerSelect from "react-native-picker-select";
import Checkbox from 'expo-checkbox';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import ToggleSwitch from "../components/ToggleSwitch";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");
const logo = require("../assets/Logo.png");

export default function CreateAccountScreen({ navigation }: any) {
    const { control, handleSubmit, formState: { errors, isDirty }, getValues, watch } = useForm();
    const [activeIndex, setActiveIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [closeToast, setCloseToast] = useState(false);
    const [isGpsEnabled, setIsGpsEnabled] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const changeSlide = (index: number) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setActiveIndex(index);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleFirstSlide = async () => {
        try {
            const email = watch('email');
            const password = watch('password');
            const fullName = watch('fullName');
            const phoneNumber = watch('phoneNumber');
            const dob = watch('dob_date') + "-" + watch("dob_month") + "-" + watch("dob_year");

            // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;

            // await sendEmailVerification(user);
            // console.log("Verification email sent!");

            // await setDoc(doc(db, "users", user.uid), {
            //     fullName,
            //     phoneNumber,
            //     dob,
            //     email: user.email,
            //     uid: user.uid,
            //     createdAt: new Date(),
            // });
            changeSlide(1);
            setCloseToast(true);
            // alert("Please check your email to verify your account.");
        } catch (error: any) {
            console.error(error.message);
            Alert.alert(error.message);
        }
    }

    useEffect(() => {
        if (closeToast) {
            setTimeout(() => {
                setCloseToast(false);
            }, 3000);
        }
    }, [closeToast])

    useEffect(() => {
        const enableGPS = async () => {
            let locationServicesEnabled = await Location.hasServicesEnabledAsync();
            // console.log(locationServicesEnabled, 'llllllllllllll')
            if (isGpsEnabled) {
                if (!locationServicesEnabled) {
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    // console.log(status, 'status')
                }
            } else {
                if (!locationServicesEnabled) {
                    Alert.alert(
                        "Turn Off GPS",
                        "GPS cannot be disabled programmatically. Please turn it off in settings.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings(),
                            },
                        ]
                    );
                }
            }
        }
        enableGPS();
    }, [isGpsEnabled]);

    const handleSecondSlide = () => {
        changeSlide(2);
    }

    const handleLastSlide = () => {
        if (isGpsEnabled) {
            setShowModal(false);
            navigation.navigate("Home");
        } else {
            setShowModal(true);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
                    {
                        activeIndex === 0 ?
                            <>
                                <Image source={logo} />
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.title}>Let’s Create Your</Text>
                                    <Text style={styles.title}>WhereAbouts</Text>
                                    <Text style={styles.title}>Account</Text>
                                </View>
                                <View style={styles.InputContainer}>
                                    <Controller
                                        control={control}
                                        name="email"
                                        rules={{ required: "Email is required" }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={styles.Input}
                                                placeholder="Email"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    {/* {errors.email && <Text style={styles.error}>{errors.email.message}</Text>} */}
                                    <Controller
                                        control={control}
                                        name="fullName"
                                        rules={{ required: "Full Name is required" }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={styles.Input}
                                                placeholder="Full Name"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="phoneNumber"
                                        rules={{ required: "Phone Number is required" }}
                                        render={({ field: { onChange, value } }) => (
                                            <PhoneInput
                                                // ref={phoneInput}
                                                // defaultValue={value || ""}
                                                defaultCode="US"
                                                // layout="first"
                                                onChangeFormattedText={onChange}
                                                // withShadow
                                                // autoFocus
                                                containerStyle={styles.phoneContainer}
                                                textContainerStyle={{ paddingVertical: 0 }}
                                            />
                                        )}
                                    />
                                    <View style={styles.PasswordInputContainer}>
                                        <Controller
                                            control={control}
                                            name="password"
                                            rules={{ required: "Password is required" }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <>
                                                    <TextInput
                                                        style={{ flex: 1 }}
                                                        placeholder="Password"
                                                        secureTextEntry={!showPassword}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                    />
                                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                        <Ionicons
                                                            name={showPassword ? "eye-off" : "eye"}
                                                            size={24}
                                                            color="gray"
                                                            style={styles.icon}
                                                        />
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                        />
                                        {/* {errors.password && <Text style={styles.error}>{errors.password.message}</Text>} */}
                                    </View>
                                    <Text style={{ marginBottom: 10 }}>Your Birthday</Text>
                                    <View style={styles.datePickerContainer}>
                                        <Controller
                                            control={control}
                                            name="dob_month"
                                            rules={{ required: "Month is required" }}
                                            render={({ field: { onChange, value } }) => (
                                                <View style={[styles.pickerContainer, { width: '31%' }]}>
                                                    <RNPickerSelect
                                                        onValueChange={onChange}
                                                        items={[
                                                            { label: "1", value: "1" },
                                                            { label: "2", value: "2" },
                                                            { label: "3", value: "3" },
                                                            { label: "4", value: "4" },
                                                            { label: "5", value: "5" },
                                                            { label: "6", value: "6" },
                                                            { label: "7", value: "7" },
                                                            { label: "8", value: "8" },
                                                            { label: "9", value: "9" },
                                                            { label: "10", value: "10" },
                                                            { label: "11", value: "11" },
                                                            { label: "12", value: "12" },
                                                        ]}
                                                        value={value}
                                                        placeholder={{ label: "Month", value: null }}
                                                    />
                                                </View>
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="dob_date"
                                            rules={{ required: "Date is required" }}
                                            render={({ field: { onChange, value } }) => (
                                                <View style={[styles.pickerContainer, { width: '31%' }]}>
                                                    <RNPickerSelect
                                                        onValueChange={onChange}
                                                        items={[
                                                            { label: "1", value: "1" },
                                                            { label: "2", value: "2" },
                                                            { label: "3", value: "3" },
                                                            { label: "4", value: "4" },
                                                            { label: "5", value: "5" },
                                                            { label: "6", value: "6" },
                                                            { label: "7", value: "7" },
                                                            { label: "8", value: "8" },
                                                            { label: "9", value: "9" },
                                                            { label: "10", value: "10" },
                                                            { label: "11", value: "11" },
                                                            { label: "12", value: "12" },
                                                        ]}
                                                        value={value}
                                                        placeholder={{ label: "Date", value: null }}
                                                    />
                                                </View>
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="dob_year"
                                            rules={{ required: "Year is required" }}
                                            render={({ field: { onChange, value } }) => (
                                                <View style={[styles.pickerContainer, { width: '38%' }]}>
                                                    <RNPickerSelect
                                                        onValueChange={onChange}
                                                        items={[
                                                            { label: "2025", value: "2025" },
                                                            { label: "2024", value: "2024" },
                                                            { label: "2023", value: "2023" },
                                                            { label: "2022", value: "2022" },
                                                            { label: "2021", value: "2021" },
                                                            { label: "2020", value: "2020" }
                                                        ]}
                                                        value={value}
                                                        placeholder={{ label: "Year", value: null }}
                                                    />
                                                </View>
                                            )}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={isChecked}
                                            onValueChange={setChecked}
                                        />
                                        <Text style={{ width: '90%' }}>
                                            I agree to WhereAbouts <Text style={{ color: '#00BAD6' }}>Terms of Conditions</Text> and <Text style={{ color: '#00BAD6' }}>Privacy Policy</Text>
                                        </Text>
                                    </View>
                                </View>
                            </>
                            : activeIndex === 1 ?
                                <>
                                    <Image source={logo} style={{ marginBottom: 5 }} />
                                    <View style={{ marginBottom: 30 }}>
                                        <Text style={[styles.title, { marginBottom: 20 }]}>Verification Code</Text>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                paddingHorizontal: 30,
                                                fontSize: 15,
                                                lineHeight: 22,
                                                marginBottom: 25
                                            }}
                                        >
                                            WhereAbouts will text you a{"\n"} verification code
                                            which you will add in the field below.
                                        </Text>
                                    </View>
                                    <View style={styles.InputContainer}>
                                        <Controller
                                            control={control}
                                            name="verificationCode"
                                            rules={{ required: "Verification Code is required" }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    style={styles.Input}
                                                    placeholder="Verification Code"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                        <View style={styles.buttonContainer2}>
                                            <Text>Didn’t receive your code? </Text>
                                            <Button
                                                title="Resend"
                                                isButton={false}
                                                onPress={() => navigation.navigate("SignIn")}
                                            />
                                        </View>
                                    </View>
                                </>
                                :
                                <>
                                    <Image source={logo} style={{ marginBottom: 5 }} />
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.title, { marginBottom: 10 }]}>Location Services</Text>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                paddingHorizontal: 30,
                                                fontSize: 15,
                                                lineHeight: 22,
                                                // marginBottom: 10
                                            }}
                                        >
                                            Let’s set up your GPS and location service for WhereAbouts.
                                        </Text>
                                    </View>
                                    <View style={styles.InputContainer}>
                                        <View style={styles.CardContainer}>
                                            <View style={{ width: '55%' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>GPS</Text>
                                                <Text>For you to get the best experience, GPS should be turned on.</Text>
                                            </View>
                                            <View style={{ width: '45%', alignItems: 'flex-end' }}>
                                                <ToggleSwitch isEnabled={isGpsEnabled} setIsEnabled={setIsGpsEnabled} />
                                            </View>
                                        </View>

                                        <View style={[styles.CardContainer]}>
                                            <View style={{ width: '55%' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Distance</Text>
                                                <Text>How would you like WhereAbouts to display and measure distance?</Text>
                                            </View>
                                            <View style={{ width: '45%', alignItems: 'flex-end' }}>
                                                <Controller
                                                    control={control}
                                                    name="distance"
                                                    rules={{ required: "Distance is required" }}
                                                    render={({ field: { onChange, value } }) => (
                                                        <View style={[styles.pickerContainer, { width: '100%' }]}>
                                                            <Text style={watch('distance')?.length ? styles.activeLabel : styles.label}>
                                                                Distance
                                                            </Text>
                                                            <RNPickerSelect
                                                                onValueChange={onChange}
                                                                items={[
                                                                    { label: "Miles", value: "MIles" },
                                                                    { label: "KM", value: "KM" },
                                                                    { label: "Meter", value: "Meter" }
                                                                ]}
                                                                value={value}
                                                                placeholder={{ label: "Distance", value: null }}
                                                            />
                                                        </View>
                                                    )}
                                                />
                                            </View>
                                        </View>
                                        <View style={{
                                            backgroundColor: '#f1f1f1',
                                            // opacity: 0.7,
                                            padding: 15,
                                            borderRadius: 8,
                                        }}>
                                            <View style={[styles.CardContainer, { padding: 0, marginBottom: 0 }]}>
                                                <View style={{ width: '35%' }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Your Location</Text>
                                                </View>
                                                <View style={{ width: '65%', alignItems: 'flex-end' }}>
                                                    <ToggleSwitch isEnabled={isGpsEnabled} offText="Public" onText="Private" setIsEnabled={setIsGpsEnabled} />
                                                </View>
                                            </View>
                                            <Text>This will display on your profile and used to find WhereAbouts in your area. Setting it to private will only be viewable by you.</Text>
                                            <Controller
                                                control={control}
                                                name="country"
                                                rules={{ required: "Country is required" }}
                                                render={({ field: { onChange, value } }) => (
                                                    <View style={[styles.pickerContainer, { width: '100%', marginVertical: 10 }]}>
                                                        <Text style={watch('country')?.length ? styles.activeLabel : styles.label}>
                                                            Country
                                                        </Text>
                                                        <RNPickerSelect
                                                            onValueChange={onChange}
                                                            items={[
                                                                { label: "Miles", value: "MIles" },
                                                                { label: "KM", value: "KM" },
                                                                { label: "Meter", value: "Meter" }
                                                            ]}
                                                            value={value}
                                                            placeholder={{ label: "Country", value: null }}
                                                        />
                                                    </View>
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="state"
                                                rules={{ required: "State/Province is required" }}
                                                render={({ field: { onChange, value } }) => (
                                                    <View style={[styles.pickerContainer, { width: '100%' }]}>
                                                        <Text style={watch('state')?.length ? styles.activeLabel : styles.label}>
                                                            State/Province
                                                        </Text>
                                                        <RNPickerSelect
                                                            onValueChange={onChange}
                                                            items={[
                                                                { label: "Miles", value: "MIles" },
                                                                { label: "KM", value: "KM" },
                                                                { label: "Meter", value: "Meter" }
                                                            ]}
                                                            value={value}
                                                            placeholder={{ label: "State/Province", value: null }}
                                                        />
                                                    </View>
                                                )}
                                            />
                                        </View>
                                    </View>
                                </>
                    }
                </Animated.View>

                <View style={{ height: 50, position: 'relative' }}>
                    <PaginationDot
                        activeColor="#00AEEF"
                        length={3}
                        activeDotWidth={10}
                        active={activeIndex}
                        width={width}
                        paddingHorizontal={10}
                        paddingVertical={10}
                        passiveDotWidth={10}
                        marginHorizontal={5}
                    />
                </View>
                {
                    (activeIndex === 1 && closeToast) &&
                    <Text style={{ width: '100%', backgroundColor: '#BCCD30', textAlign: 'center', padding: 15, marginVertical: 10 }}>
                        Verification Code Sent
                    </Text>
                }

                {
                    activeIndex === 0 ?
                        <>
                            <View style={styles.buttonContainer}>
                                <Button title="Next" isDisabled={!isDirty} onPress={handleFirstSlide} />
                            </View>
                            <View style={styles.buttonContainer2}>
                                <Text>Already have an account? </Text>
                                <Button
                                    title="Sign In"
                                    isButton={false}
                                    onPress={() => navigation.navigate("SignIn")}
                                />
                            </View>
                        </>
                        : activeIndex === 1 ?
                            <View style={styles.buttonContainer3}>
                                <Button title="Back" isButton={false} isDisabled={!isDirty} onPress={() => changeSlide(activeIndex - 1)} />
                                <Button title="Next" isDisabled={!isDirty} onPress={handleSecondSlide} />
                            </View>
                            :
                            <>
                                <View style={styles.buttonContainer3}>
                                    <Button title="Back" isButton={false} isDisabled={!isDirty} onPress={() => changeSlide(activeIndex - 1)} />
                                    <Button title="Complete" customStyle={styles.CompleteBtn} isDisabled={!isDirty} onPress={handleLastSlide} />
                                </View>
                                <Text style={{ width: '90%', marginBottom: 10, fontSize: 12 }}>
                                    These settings can be changed at any time in your profile settings.
                                </Text>
                            </>
                }

            </ScrollView>
            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Proceed without GPS?</Text>
                        <Text style={styles.modalText}>Some features will not be available when using WhereAbouts. These settings can be changed at any time in your profile settings. </Text>
                        <View style={[styles.buttonContainer3, {width: '100%', justifyContent: 'flex-end', gap: 20}]}>
                            <Button title="Cancel" isButton={false} isDisabled={!isDirty} onPress={() => setShowModal(false)} />
                            <Button title="Complete" customStyle={styles.CompleteBtn} isDisabled={!isDirty} onPress={() => {setShowModal(false); navigation.navigate("Home")}} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingHorizontal: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "400",
        color: "#333",
        textAlign: "center",
    },
    slideContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    InputContainer: {
        marginVertical: 10,
        padding: 20,
        width: width * 1,
    },
    Input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 25
    },
    phoneContainer: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 25,
    },
    PasswordInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 25
    },
    icon: {
        marginLeft: 10,
    },
    error: {
        color: "red",
        marginBottom: 10
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        width: '100%',
        marginBottom: 25
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        // overflow: "hidden",
    },
    checkbox: {
        margin: 8,
    },
    buttonContainer: {
        width: "90%",
        alignItems: "flex-end",
        marginTop: 10,
    },
    buttonContainer2: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: "90%",
        alignItems: "center",
        marginTop: 10
    },
    buttonContainer3: {
        width: "90%",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    CompleteBtn: {
        paddingHorizontal: 18
    },
    CardContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        // opacity: 0.7,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
    },
    label: {
        display: 'none'
    },
    activeLabel: {
        position: "absolute",
        top: -10,
        left: 5,
        fontSize: 12,
        backgroundColor: "#eee",
        paddingHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        // height: '100%',
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
});