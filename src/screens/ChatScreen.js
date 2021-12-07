import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatList from "../components/ChatList";
import Header from "../components/Header";

const ChatScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <Header title="Chat"/>
            <ChatList />
        </SafeAreaView>
    );
};

export default ChatScreen;
