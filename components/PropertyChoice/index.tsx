// components/PropertyChoice/index.tsx

import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const bhkData = [
  { id: 1, title: "1 RK / 1 BHK", count: "820+",   icon: "bed-outline"    },
  { id: 2, title: "2 BHK",         count: "5,200+",  icon: "home-outline"   },
  { id: 3, title: "3 BHK",         count: "4,100+",  icon: "home-outline"   },
  { id: 4, title: "4 BHK+",        count: "1,800+",  icon: "business-outline"},
];

const postedByData = [
  { id: 1, title: "By Dealer",  count: "300+",  iconType: "fa", icon: "user-tie" },
  { id: 2, title: "By Owner",   count: "160+",  iconType: "fa", icon: "user"     },
];

function SectionBlock({ title, subtitle, data, isFA = false }: any) {
  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-base font-bold text-slate-900">{title}</Text>
          {subtitle && <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>}
        </View>
        <TouchableOpacity
          onPress={() => router.push("/listings" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#d89b38]">See All</Text>
          <Ionicons name="chevron-forward" size={13} color="#d89b38" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
        {data.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            className="mr-3 w-32 bg-white rounded-2xl p-4 items-center border border-slate-100"
            style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
          >
            <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center mb-2">
              {isFA
                ? <FontAwesome5 name={item.icon} size={22} color="#2563eb" />
                : <Ionicons name={item.icon} size={24} color="#2563eb" />
              }
            </View>
            <Text className="text-xs font-bold text-slate-900 text-center">{item.title}</Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">{item.count} Properties</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function PropertyChoice() {
  return (
    <View className="bg-white px-4 pt-5 pb-4">
      <SectionBlock
        title="BHK Choice in Mind?"
        subtitle="Browse by bedroom configuration"
        data={bhkData}
        isFA={false}
      />
      <SectionBlock
        title="Posted By"
        subtitle="Find properties by listing type"
        data={postedByData}
        isFA={true}
      />
    </View>
  );
}
