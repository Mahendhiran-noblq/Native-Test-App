import { StyleSheet, View, Text } from "react-native"

export default function SignUpScreen ({navigation}: any) {
return(
    <View style={styles.container}>
        <Text>SignUp</Text>
    </View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})