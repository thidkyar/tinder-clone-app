import React from "react";
import StackNavigator from "./src/utils/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/hooks/useAuth";
import {LogBox} from 'react-native';
import { StatusBar } from "expo-status-bar";
LogBox.ignoreAllLogs(true)

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <StackNavigator />
                <StatusBar style="auto" />
            </AuthProvider>
        </NavigationContainer>
    );
}
