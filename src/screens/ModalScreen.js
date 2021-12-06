import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { db } from "../utils/firebase";

const ModalScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const formIncomplete = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        })
            .then(() => navigation.navigate("Home"))
            .catch((error) => alert(error.message));
    };

    return (
        <View style={tw("flex-1 items-center pt-5")}>
            <Image
                style={tw("h-10 w-full")}
                resizeMode="contain"
                source={{
                    uri: "https://logodownload.org/wp-content/uploads/2020/09/tinder-logo.png",
                }}
            />

            <Text style={tw("text-xl text-gray-500 p-5 font-bold")}>
                Welcome {user.displayName}
            </Text>

            <Text style={tw("text-center text-red-400 font-bold p-4")}>
                STEP 1: THE PROFILE PICTURE
            </Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                style={tw("text-center text-xl pb-2")}
                placeholder="enter profile pic url"
            />

            <Text style={tw("text-center text-red-400 font-bold p-4")}>
                STEP 2: THE JOB
            </Text>
            <TextInput
                value={job}
                onChangeText={setJob}
                style={tw("text-center text-xl pb-2")}
                placeholder="enter your occupation"
            />

            <Text style={tw("text-center text-red-400 font-bold p-4")}>
                STEP 3: AGE
            </Text>
            <TextInput
                value={age}
                onChangeText={setAge}
                style={tw("text-center text-xl pb-2")}
                placeholder="enter your age"
                maxLength={2}
                keyboardType="numeric"
            />

            <TouchableOpacity
                disabled={formIncomplete}
                style={[
                    tw("absolute bottom-0 w-3/4 p-2 rounded-xl bottom-10"),
                    formIncomplete ? tw("bg-gray-400") : tw("bg-red-400"),
                ]}
                onPress={updateUserProfile}
            >
                <Text style={[tw("text-center text-white text-lg")]}>
                    UPDATE PROFILE
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModalScreen;
