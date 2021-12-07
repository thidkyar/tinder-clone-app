import { useRoute } from "@react-navigation/core";
import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import tw from "tailwind-rn";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const { matchDetails } = params;
    const [input, setInput] = useState("");

    const sendMessage = () => {};
    return (
        <SafeAreaView style={tw("flex-1")}>
            <Header
                title={
                    getMatchedUserInfo(matchDetails?.users, user.uid)
                        .displayName
                }
                callEnabled
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw("flex-1")}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Text>Text</Text>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <View
                style={tw(
                    "flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2"
                )}
            >
                <TextInput
                    style={tw("h-10 text-lg")}
                    placeholder="Send Message..."
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    value={input}
                />
                <Button title="Send" color="#FF5864" />
            </View>
        </SafeAreaView>
    );
};

export default MessageScreen;
