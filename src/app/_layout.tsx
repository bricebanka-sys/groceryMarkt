import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Ajoutez EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dans votre fichier .env",
  );
}
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <KeyboardProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </KeyboardProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </ClerkProvider>
  );
}
