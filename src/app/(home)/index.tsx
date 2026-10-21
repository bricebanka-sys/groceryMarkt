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
        {/* On englobe TOUT le contenu dans le conteneur "content" pour garantir l'alignement */}
        <View style={styles.content}>
          {/* L'image de profil (si existante) */}
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : null}

          {/* Le texte de bienvenue */}
          <Text style={styles.title}>
            Welcome {user?.firstName ?? "user"} !
          </Text>

          {/* L'email */}
          <Text style={styles.email}>
            Hello{" "}
            {user?.emailAddresses?.[0]?.emailAddress ??
              "Email address not available"}
          </Text>

          {/* LE BOUTON DE DECONNEXION */}
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.buttonPressed,
              isSigningOut && styles.buttonDisabled,
            ]}
            onPress={() => signOut()}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.signOutText}>Sign out</Text>
            )}
          </Pressable>
        </View>

        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <UserButton />
        </View>
        {/* <UserProfileView style={{ flex: 1 }} /> */}
      </Show>

      {/* --- SECTION SIGNED-OUT --- */}
      {/* <Show when="signed-out">
        <View style={styles.content}>
          <Text style={styles.title}>Welcome</Text>

          <Text style={styles.subtitle}>
            Please sign in or create an account to continue.
          </Text>

          <Link href="/(auth)/sign-in" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </Show> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 60, // Ajout d'un espace en haut pour ne pas coller à la barre de statut
    backgroundColor: "#ffffff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  content: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    alignSelf: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 48,
  },
  title: {
    marginBottom: 8,
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 24,
    color: "#6b7280",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  email: {
    marginBottom: 24, // Cet espacement est important pour écarter le bouton du texte
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#dc2626",
    // MODIFICATION 2: On ajoute une marge en haut pour s'assurer qu'il ne soit pas collé au texte
    marginTop: 10,
  },
  signOutText: {
    color: "#0080ff",
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
