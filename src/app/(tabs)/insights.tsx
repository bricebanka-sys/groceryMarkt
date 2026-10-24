import ClearCompletedButton from "@/components/insights/ClearCompletedButton";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsPrioritySection from "@/components/insights/InsightsPrioritySection";
import InsightsStatsSection from "@/components/insights/InsightsStatsSection";
import SentryFeedbackButton from "@/components/insights/SentryFeedbackButton";
import UserProfileCard from "@/components/insights/UserProfileCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import React from "react";
import { ScrollView } from "react-native";

const InsightsScreen = () => {
  return (
    <>
      <ScrollView
        className="flex-1 bg-background py-4"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, gap: 14 }}
      >
        <TabScreenBackground />

        {/* Carte du profil utilisateur et bouton de déconnexion */}
        <UserProfileCard />
        <InsightsStatsSection />
        <InsightsCategorySection />
        <InsightsPrioritySection />
        <ClearCompletedButton />
      </ScrollView>

      <SentryFeedbackButton />
    </>
  );
};

export default InsightsScreen;
