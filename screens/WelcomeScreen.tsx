import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    FlatList
} from "react-native";
import PaginationDot from "react-native-dots-pagination";
import Button from "../components/Button";

const { width, height } = Dimensions.get("window");
const logo = require("../assets/Logo.png");

const slides = [
    {
        image: require("../assets/images/welcome-img-1.png"),
        title: "WhereAbouts",
        description: "From out-of-the-way places or hidden locations, explore and tell people where you were.",
    },
    {
        image: require("../assets/images/welcome-img-2.png"),
        title: "WhereAbouts",
        description: "Share your favorite locations with friends and followers, or keep your secret locations private.",
    },
    {
        image: require("../assets/images/welcome-img-3.png"),
        title: "WhereAbouts",
        description: "Follow your friends' latest adventures and see what discoveries they have to share.",
    },
];

export default function WelcomeScreen({ navigation }: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            changeSlide((activeIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

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

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
                        <Image source={item.image} style={styles.image} />
                        <Image source={logo} style={{ marginBottom: 5 }} />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </Animated.View>
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            <View style={{ height: 50 }}>
                <PaginationDot
                    activeColor="#00AEEF"
                    length={slides.length}
                    activeDotWidth={10}
                    active={activeIndex}
                    width={width}
                    paddingHorizontal={10}
                    paddingVertical={10}
                    passiveDotWidth={10}
                    marginHorizontal={5}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Sign In"
                    customStyle={styles.signInButton}
                    onPress={() => navigation.navigate("SignIn")}
                />
                <Button
                    title="Create an Account"
                    customTextStyle={styles.createAccount}
                    isButton={false}
                    onPress={() => navigation.navigate("CreateAccount")}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    slideContainer: {
        alignItems: "center",
        justifyContent: "center",
        width,
        height: height * 0.6,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginVertical: 10,
    },
    description: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        paddingHorizontal: 30,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 50
    },
    signInButton: {
        marginBottom: 20,
        width: "70%",
    },
    createAccount: {
        marginTop: 10,
        color: "#000000",
    },
});

