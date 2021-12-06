import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import {
    View,
    Text,
    Button,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";

const LoginScreen = () => {
    const { signInWithGoogle } = useAuth();
    const navigation = useNavigation();

    return (
        <View style={tw("flex-1")}>
            <ImageBackground
                source={{ uri: "https://tinder.com/static/tinder.png" }}
                style={tw("flex-1")}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={[
                        tw("absolute bottom-40 w-52 bg-white p-4 rounded-full"),
                        { marginHorizontal: "25%" },
                    ]}
                    onPress={() => alert('Under development')}
                >
                    <Text style={tw("text-center")}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        tw(
                            "absolute bottom-20 w-52 border-solid border-2 border-white p-4 rounded-full"
                        ),
                        { marginHorizontal: "25%" },
                    ]}
                    onPress={signInWithGoogle}
                >
                    <Text style={tw("text-center font-semibold text-white")}>
                        SIGN IN WITH GOOGLE
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;
