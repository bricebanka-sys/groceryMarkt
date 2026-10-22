import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

// Finalise une session d'authentification en attente au retour via l'URL de redirection
WebBrowser.maybeCompleteAuthSession();

type SocialStrategy = "oauth_google" | "oauth_github" | "oauth_apple";

export const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<SocialStrategy | null>(
    null,
  );
  const { startSSOFlow } = useSSO();

  // Android : précharge les Custom Tabs pour un navigateur d'authentification plus rapide et fiable
  useEffect(() => {
    if (Platform.OS !== "android") return;

    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleSocialAuth = async (strategy: SocialStrategy) => {
    if (loadingStrategy) return;

    setLoadingStrategy(strategy);

    try {
      // Génération de l'URL de redirection pointant vers le scheme de l'app
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "grocerymarkt",
      });

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

      // Aucune session : on journalise la cause exacte (visible dans le terminal Metro)
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

      // 1. L'utilisateur a fermé ou annulé le navigateur : ce n'est pas une erreur
      if (authSessionResult && authSessionResult.type !== "success") return;

      // 2. Clerk attend des informations supplémentaires
      if (signUp?.status === "missing_requirements") {
        Alert.alert(
          "More information required",
          "Your account needs additional information before you can sign in.",
        );
        return;
      }

      // 3. Clerk exige une vérification supplémentaire
      if (signIn?.status && signIn.status !== "complete") {
        Alert.alert(
          "Additional verification required",
          "An extra verification step is required for this account.",
        );
        return;
      }

      // 4. Cas non identifié
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
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
