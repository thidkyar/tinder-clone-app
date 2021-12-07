import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Button, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    connectFirestoreEmulator,

} from "@firebase/firestore";
import { db } from "../utils/firebase";
import generateId from "../utils/generateIds";

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
            const dislikedSwipes = await getDocs(
                collection(db, "users", user.uid, "dislikedSwipes")
            ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

            const likedSwipes = await getDocs(
                collection(db, "users", user.uid, "likedSwipes")
            ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

            const dislikedSwipesUserIds =
                dislikedSwipes.length > 0 ? dislikedSwipes : ["test"];
            const likedSwipesUserIds =
                likedSwipes.length > 0 ? likedSwipes : ["test"];

            unsub = onSnapshot(
                query(
                    collection(db, "users"),
                    where("id", "not-in", [
                        ...dislikedSwipesUserIds,
                        ...likedSwipesUserIds,
                    ])
                ),
                (snapshot) => {
                    setProfiles(
                        snapshot.docs
                            .filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }))
                    );
                }
            );
        };

        fetchCards();
        return unsub;
    }, []);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log(`you swiped fail on`, userSwiped.displayName);

        setDoc(
            doc(db, "users", user.uid, "dislikedSwipes", userSwiped.id),
            userSwiped
        );
    };

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`you swiped pass on`, userSwiped.displayName);

        const loggedInProfile = await(await getDoc(doc(db, "users", user.uid))).data()
        console.log(loggedInProfile)
        //check if user swiped on you...
        getDoc(doc(db, "users", userSwiped.id, "likedSwipes", user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    //user has matched with you before you matched with them..
                    console.log(`You matched with`, userSwiped.displayName);

                    setDoc(
                        doc(
                            db,
                            "users",
                            user.uid,
                            "likedSwipes",
                            userSwiped.id
                        ),
                        userSwiped
                    );

                    //create a MATCH
                    setDoc(
                        doc(db, "matches", generateId(user.uid, userSwiped.id)),
                        {
                            users: {
                                [user.uid]: loggedInProfile,
                                [userSwiped.id]: userSwiped,
                            },
                            usersMatched: [user.uid, userSwiped.id],
                            timestamp: serverTimestamp(),
                        }
                    );

                    navigation.navigate("Match", {
                        loggedInProfile,
                        userSwiped,
                    });
                } else {
                    //user has swiped as first interaction between the two and didn't get swiped on...
                    console.log(`You swiped on`, userSwiped.displayName);
                    setDoc(
                        doc(
                            db,
                            "users",
                            user.uid,
                            "likedSwipes",
                            userSwiped.id
                        ),
                        userSwiped
                    );
                }
            }
        );
    };
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
                    onSwipedLeft={(cardIndex) => {
                        console.log("FAIL");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("PASS");
                        swipeRight(cardIndex);
                    }}
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
