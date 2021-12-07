import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "@firebase/firestore";
import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
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
    FlatList,
} from "react-native";
import tw from "tailwind-rn";
import Header from "../components/Header";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import useAuth from "../hooks/useAuth";
import { db } from "../utils/firebase";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const { matchDetails } = params;
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, "matches", matchDetails.id, "messages"),
                    orderBy("timestamp", "desc")
                ),
                (snapshot) =>
                    setMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    )
            ),
        [matchDetails, db]
    );
    const sendMessage = () => {
        addDoc(collection(db, "matches", matchDetails.id, "messages"), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput("");
    };
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
                    <FlatList
                        data={messages}
                        inverted ={-1}
                        style={tw("pl-4")}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item: message }) =>
                            message.userId === user.uid ? (
                                <SenderMessage
                                    key={message.id}
                                    message={message}
                                />
                            ) : (
                                <ReceiverMessage
                                    key={message.id}
                                    message={message}
                                />
                            )
                        }
                    />
                </TouchableWithoutFeedback>

                <View
                    style={tw(
                        "flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-1"
                    )}
                >
                    <TextInput
                        style={tw("flex-1 h-10 text-base")}
                        placeholder="Send Message..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button title="Send" color="#FF5864" onPress={sendMessage}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default MessageScreen;
