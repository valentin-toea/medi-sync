import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import {
  Colors,
  TabController,
  TabControllerItemProps,
  Text,
} from "react-native-ui-lib";
import { CustomCard } from "@/components/CustomCard";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@/components/BottomSheet";

const ResidencyScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStage, setSelectedState] = useState<
    { name: string } | undefined
  >();

  const tabs: TabControllerItemProps[] = [
    { label: "Current Stages" },
    { label: "Future Stages" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Residency</Text>

      <TabController items={tabs} initialIndex={0} asCarousel={false}>
        <TabController.TabBar
          enableShadow
          containerStyle={styles.tabBar}
          selectedLabelColor={Colors.green20}
          indicatorStyle={{ backgroundColor: Colors.green20 }}
        />

        <View style={styles.tabContent}>
          <TabController.TabPage index={0}>
            <ScrollView contentContainerStyle={styles.scroll}>
              <Text style={styles.sectionTitle}>Current Stage</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedState({ name: "Pediatrics Rotation" });
                  setShowDetails(true);
                }}
              >
                <CustomCard>
                  <Text style={styles.cardTitle}>Pediatrics Rotation</Text>
                  <Text style={styles.cardDate}>01.01.2025 - 05.05.2025</Text>
                  <View style={styles.locationRow}>
                    <MaterialIcons
                      name="location-on"
                      size={18}
                      color="#687076"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.locationText}>
                      {"Bucharest Children's Hospital"}
                    </Text>
                  </View>
                  <Text style={styles.supervisor}>Dr. Adriana Ionescu</Text>
                </CustomCard>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Next Planned Stages</Text>

              {[1, 2, 3].map((i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedState({ name: `Stage ${i}` });
                    setShowDetails(true);
                  }}
                >
                  <CustomCard style={{ marginBottom: 12 }}>
                    <Text style={styles.cardTitle}>Stage {i}</Text>
                    <Text style={styles.cardDate}>06.05.2025 - 30.06.2025</Text>
                    <View style={styles.locationRow}>
                      <MaterialIcons
                        name="location-on"
                        size={18}
                        color="#687076"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.locationText}>
                        University Hospital
                      </Text>
                    </View>
                    <Text style={styles.supervisor}>Dr. Andrei Popescu</Text>
                  </CustomCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TabController.TabPage>
          <TabController.TabPage index={1}>
            <View style={styles.center}>
              <Text>Other Tab Content</Text>
            </View>
          </TabController.TabPage>
        </View>
      </TabController>
      <BottomSheet visible={showDetails} onClose={() => setShowDetails(false)}>
        <Text style={{ fontWeight: 500, fontSize: 16 }}>
          Details about {selectedStage?.name}
        </Text>
      </BottomSheet>
    </View>
  );
};

export default ResidencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#11181C",
    paddingHorizontal: 20,
  },
  tabBar: {
    marginBottom: 12,
    height: 50,
    color: "blue",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    color: "#11181C",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 14,
    color: "#687076",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#687076",
  },
  supervisor: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    color: "#11181C",
  },
  tabContent: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
