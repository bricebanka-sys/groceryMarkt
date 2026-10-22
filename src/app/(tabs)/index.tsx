import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import PendingItemCard from "@/components/list/PendingItemCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { FlatList, Text, View } from "react-native";

export default function ListScreen() {
  const { items } = useGroceryStore();
  const pendingItems = items.filter((item) => !item.purchased);

  return (
    <FlatList
      className="flex-1 bg-background"
      data={pendingItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PendingItemCard item={item} />}
      contentContainerStyle={{
        padding: 20,
        gap: 14,
        width: "100%",
        maxWidth: 640, // limite la largeur sur tablette / web
        alignSelf: "center", // reste centré sur grands écrans
      }}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={{ gap: 14 }}>
          <TabScreenBackground />
          <ListHeroCard />

          {/* En-tête de section : aucune troncature */}
          <View className="flex-row items-start px-1">
            <Text
              className="flex-1 text-sm font-semibold uppercase tracking-[1px] text-muted-foreground"
              style={{ flexShrink: 1, paddingRight: 8 }}
            >
              Shopping items
            </Text>

            <Text
              className="text-sm text-muted-foreground"
              style={{ minWidth: 90, textAlign: "right", flexShrink: 0 }}
            >
              {pendingItems.length} active
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={<CompletedItems />}
    />
  );
}
