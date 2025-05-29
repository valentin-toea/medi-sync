import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Colors, SegmentedControl, Text } from "react-native-ui-lib";
import { CustomCard } from "@/components/CustomCard";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@/components/BottomSheet";

const ResidencyScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStage, setSelectedStage] = useState<
    { name: string } | undefined
  >();
  const [activeTab, setActiveTab] = useState(0);

  const renderCurrentStage = () => (
    <View>
      <Text style={styles.sectionTitle}>Current Stage</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedStage({ name: "Pediatrics Rotation" });
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
            setSelectedStage({ name: `Stage ${i}` });
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
              <Text style={styles.locationText}>University Hospital</Text>
            </View>
            <Text style={styles.supervisor}>Dr. Andrei Popescu</Text>
          </CustomCard>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFutureStages = () => (
    <View>
      <Text style={styles.sectionTitle}>Coming soon...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Residency</Text>

      <SegmentedControl
        segments={[{ label: "Current Stages" }, { label: "Future Stages" }]}
        onChangeIndex={setActiveTab}
        initialIndex={0}
        containerStyle={styles.segmented}
        activeColor={Colors.green20}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 0 ? renderCurrentStage() : renderFutureStages()}
      </ScrollView>

      <BottomSheet visible={showDetails} onClose={() => setShowDetails(false)}>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>
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
    marginTop: 20,
  },
  segmented: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
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
