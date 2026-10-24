import { useClerk, useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

const UserProfileCard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName || email?.split("@")[0];

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
      Alert.alert("Error", "Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
    // En cas de succès, l'écran est démonté par la redirection : pas besoin de réinitialiser
  };

  return (
    <View className="rounded-3xl border border-border bg-card p-4 mt-10">
      <View className="flex-row items-center gap-3">
        <View className="size-12 rounded-full overflow-hidden">
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs uppercase tracking-[1px] text-muted-foreground">
            Signed in as
          </Text>
          <Text className="mt-1 text-lg font-bold text-foreground">
            {displayName}
          </Text>
          <Text className="text-sm text-muted-foreground">{email}</Text>
        </View>
        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut}
          className={`h-9 w-9 items-center justify-center rounded-xl bg-destructive ${
            isSigningOut ? "opacity-60" : ""
          }`}
        >
          <FontAwesome6 name="right-from-bracket" size={13} color="#d45f58" />
        </Pressable>
      </View>
    </View>
  );
};

export default UserProfileCard;
