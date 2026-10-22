import { Show, useClerk, useUser } from "@clerk/expo";
import { UserButton } from "@clerk/expo-native-components";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isSigningOut] = useState(false);

  return (
    <View style={styles.container}>
      {/* --- SECTION SIGNED-IN --- */}
      <Show when="signed-in">
        {/* Le petit (c) aligné à gauche */}
        <View style={styles.userButtonWrapper}>
          <UserButton />
        </View>

        {/* Contenu principal, centré horizontalement */}
        <View style={styles.content}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : null}

          <Text style={styles.title}>
            Welcome {user?.firstName ?? "user"} !
          </Text>

          <Text style={styles.email}>
            Hello{" "}
            {user?.emailAddresses?.[0]?.emailAddress ??
              "Email address not available"}
          </Text>

          {/* BOUTON DE DECONNEXION */}
          <Pressable
            onPress={() => signOut()}
            disabled={isSigningOut}
            style={styles.signOutPressable}
            android_ripple={{ color: "rgba(255,255,255,0.3)" }}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.signOutButton,
                  pressed && styles.buttonPressed,
                  isSigningOut && styles.buttonDisabled,
                ]}
              >
                {isSigningOut ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.signOutText}>Sign out</Text>
                )}
              </View>
            )}
          </Pressable>
        </View>
      </Show>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 24,
    paddingTop: 50, // remonté (60 -> 20)
    backgroundColor: "#ffffff",
  },
  userButtonWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 0, // rapproche le bloc central du haut
  },
  content: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    alignSelf: "center",
    marginTop: -10, // remonte légèrement l'ensemble, toujours centré
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 40,
  },
  title: {
    marginBottom: 8,
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  email: {
    marginBottom: 24,
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
  },
  signOutPressable: {
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden", // contient le ripple Android
  },
  signOutButton: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#0080ff",
    // plus d'elevation : c'était la cause du rendu transparent sur Android
  },
  signOutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
