import { useAuth, useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

// Finalise une session d'authentification en attente au retour via l'URL de redirection
WebBrowser.maybeCompleteAuthSession();

type SocialStrategy = "oauth_google" | "oauth_github" | "oauth_apple";

export const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<SocialStrategy | null>(
    null,
  );
  // Garde synchrone : empêche deux flux simultanés (l'état React est asynchrone)
  const inFlightRef = useRef(false);
  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();
  const isSignedInRef = useRef(false);

  // Garde la valeur à jour pour la lire après l'await
  useEffect(() => {
    isSignedInRef.current = !!isSignedIn;
  }, [isSignedIn]);

  const handleSocialAuth = async (strategy: SocialStrategy) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setLoadingStrategy(strategy);

    try {
      // Génération de l'URL de redirection pointant vers le scheme de l'app
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "grocerymarkt",
        path: "sso-callback",
      });

      if (__DEV__) console.log("[useSocialAuth] redirectUrl:", redirectUrl);

      const { createdSessionId, setActive, signIn, signUp, authSessionResult } =
        await startSSOFlow({
          strategy,
          redirectUrl,
        });

      // L'identifiant de session peut aussi se trouver sur les ressources signIn / signUp
      const sessionId =
        createdSessionId ??
        signUp?.createdSessionId ??
        signIn?.createdSessionId ??
        null;

      if (sessionId && setActive) {
        await setActive({ session: sessionId });
        return;
      }

      // 1. Navigateur fermé : succès réel seulement si une session existe
      if (
        authSessionResult?.type === "dismiss" ||
        authSessionResult?.type === "cancel"
      ) {
        // Petit délai pour laisser Clerk finaliser la session
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (isSignedInRef.current) {
          if (__DEV__) console.log("[useSocialAuth] Signed in despite dismiss");
          return; // connexion réussie, rien à signaler
        }

        if (__DEV__) {
          console.log(
            "[useSocialAuth] Flow closed by user:",
            authSessionResult.type,
          );
        }
        return; // vraie annulation
      }

      // 2. Un autre flux d'authentification est déjà ouvert
      if (authSessionResult?.type === "locked") {
        Alert.alert(
          "Sign-in already in progress",
          "Please finish or close the open sign-in window, then try again.",
        );
        return;
      }

      // Cas inattendus : on journalise la cause exacte (visible dans le terminal Metro)
      console.warn(
        "[useSocialAuth] No session created",
        JSON.stringify(
          {
            strategy,
            redirectUrl,
            authSessionType: authSessionResult?.type ?? null,
            signInStatus: signIn?.status ?? null,
            firstFactorStatus: signIn?.firstFactorVerification?.status ?? null,
            signUpStatus: signUp?.status ?? null,
            missingFields: signUp?.missingFields ?? null,
          },
          null,
          2,
        ),
      );

      // 3. Clerk attend des informations supplémentaires
      if (signUp?.status === "missing_requirements") {
        Alert.alert(
          "More information required",
          "Your account needs additional information before you can sign in.",
        );
        return;
      }

      // 4. Clerk exige une vérification supplémentaire
      if (signIn?.status && signIn.status !== "complete") {
        Alert.alert(
          "Additional verification required",
          "An extra verification step is required for this account.",
        );
        return;
      }

      // 5. Cas non identifié
      Alert.alert(
        "Sign-in incomplete",
        "Sign-in did not complete. Please try again.",
      );
    } catch (err: any) {
      console.error("Erreur lors de l’authentification sociale :", err);
      Alert.alert(
        "Error",
        err?.errors?.[0]?.message || "Failed to sign in. Please try again.",
      );
    } finally {
      inFlightRef.current = false;
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
