import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

const PlannerHeroImage = () => {
  return (
    <View className="overflow-hidden rounded-[30px] border border-border bg-card">
      <Image
        source={require("../../../assets/images/hero1.png")}
        style={{ width: "100%", height: 224 }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0.4)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 72 }}
      />

      <LinearGradient
        pointerEvents="none"
        colors={["transparent", "rgba(0,0,0,0.4)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
        }}
      />
    </View>
  );
};

export default PlannerHeroImage;
