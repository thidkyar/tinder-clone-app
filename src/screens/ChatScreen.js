import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import { View, Text } from "react-native";

const ChatScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions = {
            headerShown: true,
        };
    }, []);
    
    return (
        <View>
            <Text>This is the chat screen</Text>
        </View>
    );
};

export default ChatScreen;
