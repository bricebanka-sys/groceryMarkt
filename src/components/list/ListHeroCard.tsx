import { useGroceryStore } from "@/store/grocery-store";
import React from "react";
import { Text, View } from "react-native";

const ListHeroCard = () => {
  const { items } = useGroceryStore();

  const completedCount = items.filter((i) => i.purchased).length;
  const pendingCount = items.length - completedCount;

  // Calcul du pourcentage d'avancement
  const completionRate = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  return (
    <View className="mt-16 rounded-3xl bg-primary p-5">
      <Text className="text-sm font-semibold uppercase tracking-[1px] text-primary-foreground/70">
        Today
      </Text>

      <Text className="text-2xl font-extrabold text-primary-foreground mt-1">
        Your Grocery Board
      </Text>
      <Text className="mt-1 text-sm text-primary-foreground/80">
        {pendingCount} pending · {completedCount} completed
      </Text>

      {/* Barre de progression dynamique */}
      <View className="mt-4 overflow-hidden rounded-full bg-white/50">
        <View
          className="h-2 rounded-full bg-secondary"
          style={{ width: `${completionRate}%` }}
        />
      </View>
    </View>
  );
};

export default ListHeroCard;
