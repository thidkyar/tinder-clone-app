import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";
import tw from "tailwind-rn";

const ChatRow = ({ matchDetails }) => {
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user]);

    return (
        <TouchableOpacity
            style={[
                tw("flex-row items-center py-3 bg-white px-5 my-1 rounded-lg"),
                styles.cardShadow,
            ]}
            onPress={() =>
                navigation.navigate("Message", {
                    matchDetails,
                })
            }
        >
            <Image
                style={tw("rounded-full h-16 w-16 mr-4")}
                source={{ uri: matchedUserInfo?.photoURL }}
            />
            <View>
                <Text style={tw("text-lg font-semibold")}>
                    {matchedUserInfo?.displayName}
                </Text>
                <Text>{"Say Hi!"}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
