import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Button, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { db } from "../utils/firebase";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logOut } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);

    useLayoutEffect(
        () =>
            onSnapshot(doc(db, "users", user.uid), (snapshot) => {
                if (!snapshot.exists()) {
                    navigation.navigate("Modal");
                }
            }),
        []
    );

    useEffect(() => {
        let unsub;
        const fetchCards = async () => {
            unsub = onSnapshot(collection(db, "users"), (snapshot) => {
                setProfiles(
                    snapshot.docs
                        .filter((doc) => doc.id !== user.uid)
                        .map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                );
            });
        };

        fetchCards();
        return unsub;
    }, []);
    const DUMMY_DATA = [
        {
            firstName: "Vanessa",
            lastName: "Hudgens",
            occupation: ["Actor", "Singer"],
            photoURL:
                "https://upload.wikimedia.org/wikipedia/commons/f/f5/Vanessa_Hudgens_-_2019_by_Glenn_Francis.jpg",
            age: 27,
            id: 123,
        },
        {
            firstName: "Taylor",
            lastName: "Swift",
            occupation: ["Singer", "Dancer", "Musician"],
            photoURL:
                "https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
            age: 29,
            id: 123,
        },
    ];
    return (
        <SafeAreaView style={tw("flex-1")}>
            <View style={tw("flex-row justify-between items-center px-5")}>
                <TouchableOpacity onPress={logOut}>
                    <Image
                        style={tw("h-10 w-10 rounded-full")}
                        source={{ uri: user.photoURL }}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image
                        style={tw("h-12 w-10")}
                        source={require("../images/logo.png")}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
                    <Ionicons
                        name="chatbubbles-sharp"
                        size={35}
                        color="#FF5864"
                    />
                </TouchableOpacity>
            </View>
            <View style={tw("flex-1 -mt-6")}>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    verticalSwipe={false}
                    animateCardOpacity
                    onSwipedLeft={() => console.log("FAIL")}
                    onSwipedRight={() => console.log("PASS")}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "green",
                                },
                            },
                        },
                    }}
                    renderCard={(card) =>
                        card ? (
                            <View
                                key={card.id}
                                style={tw("bg-red-500 h-3/4 rounded-xl")}
                            >
                                <Image
                                    style={tw("h-full w-full rounded-xl")}
                                    source={{ uri: card.photoURL }}
                                />
                                <View style={tw("absolute bottom-10 mx-5")}>
                                    <Text
                                        style={tw(
                                            "text-white text-xl font-bold"
                                        )}
                                    >
                                        {card.displayName}, {card.age}
                                    </Text>
                                    <View style={tw("flex-row")}>
                                        <View
                                            style={tw(
                                                "bg-black bg-opacity-50 border-solid border-2 border-white rounded-full px-4 m-0.5 items-center"
                                            )}
                                        >
                                            <Text
                                                style={tw("text-white text-sm")}
                                            >
                                                {card.job}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={tw(
                                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                                )}
                            >
                                <Text style={tw("font-bold pb-5")}>
                                    No more profiles
                                </Text>

                                <Image
                                    style={tw("h-20 w-full")}
                                    height={100}
                                    width={100}
                                    source={{
                                        uri: "https://www.cambridge.org/elt/blog/wp-content/uploads/2019/07/Sad-Face-Emoji.png",
                                    }}
                                />
                            </View>
                        )
                    }
                />
            </View>

            <View style={tw("flex-row justify-evenly")}>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tw(
                        "items-center justify-center rounded-full w-16 h-16 bg-red-200"
                    )}
                >
                    <Entypo name="cross" size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    style={tw(
                        "items-center justify-center rounded-full w-16 h-16 bg-blue-200 mb-4"
                    )}
                >
                    <Entypo name="star" size={30} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    style={tw(
                        "items-center justify-center rounded-full w-16 h-16 bg-green-200 mb-4"
                    )}
                >
                    <Entypo name="heart" size={30} color="green" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
