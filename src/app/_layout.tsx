import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Ajoutez EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dans votre fichier .env",
  );
}
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
