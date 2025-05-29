import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Colors, SegmentedControl, Text, Button } from "react-native-ui-lib";
import { CustomCard } from "@/components/CustomCard";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@/components/BottomSheet";

const ResidencyScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStage, setSelectedStage] = useState<
    | {
        name: string;
        dates?: string;
        location?: string;
        supervisor?: string;
        isFuture?: boolean;
      }
    | undefined
  >();
  const [activeTab, setActiveTab] = useState(0);
  const [formInput, setFormInput] = useState("");

  const handleFormSubmit = () => {
    Alert.alert("Stage registration completed!");
    setShowDetails(false);
    setFormInput("");
  };

  const renderCurrentStage = () => (
    <View>
      <Text style={styles.sectionTitle}>Current Stage</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedStage({
            name: "Pediatrics Rotation",
            dates: "01.01.2025 - 05.05.2025",
            location: "Bucharest Children's Hospital",
            supervisor: "Dr. Adriana Ionescu",
            isFuture: false,
          });
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
            setSelectedStage({
              name: `Stage ${i}`,
              dates: `06.0${i + 6}.2025 - 30.0${i + 6}.2025`,
              location: "University Hospital",
              supervisor: "Dr. Andrei Popescu",
              isFuture: false,
            });
            setShowDetails(true);
          }}
        >
          <CustomCard style={{ marginBottom: 12 }}>
            <Text style={styles.cardTitle}>Stage {i}</Text>
            <Text style={styles.cardDate}>
              06.0{i + 6}.2025 - 30.0{i + 6}.2025
            </Text>
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

  const renderFutureStages = () => {
    const futureStages = [
      {
        name: "Cardiology Rotation",
        dates: "01.07.2025 - 31.08.2025",
        location: "Cardiology Institute Bucharest",
        supervisor: "Dr. Mihaela Tudor",
      },
      {
        name: "Emergency Medicine",
        dates: "01.09.2025 - 30.09.2025",
        location: "Bucharest Emergency Hospital",
        supervisor: "Dr. George Mureșan",
      },
      {
        name: "Surgery Rotation",
        dates: "01.10.2025 - 30.11.2025",
        location: "University Hospital",
        supervisor: "Dr. Sorin Ionescu",
      },
    ];

    return (
      <View>
        <Text style={styles.sectionTitle}>Future Stages</Text>
        {futureStages.map((stage, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedStage({ ...stage, isFuture: true });
              setShowDetails(true);
            }}
          >
            <CustomCard style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>{stage.name}</Text>
              <Text style={styles.cardDate}>{stage.dates}</Text>
              <View style={styles.locationRow}>
                <MaterialIcons
                  name="location-on"
                  size={18}
                  color="#687076"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.locationText}>{stage.location}</Text>
              </View>
              <Text style={styles.supervisor}>{stage.supervisor}</Text>
            </CustomCard>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
        <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 8 }}>
          {selectedStage?.name}
        </Text>
        {selectedStage?.dates && (
          <Text style={{ marginBottom: 4, color: "#687076" }}>
            Dates: {selectedStage.dates}
          </Text>
        )}
        {selectedStage?.location && (
          <Text style={{ marginBottom: 4, color: "#687076" }}>
            Location: {selectedStage.location}
          </Text>
        )}
        {selectedStage?.supervisor && (
          <Text style={{ marginBottom: 12, color: "#687076" }}>
            Supervisor: {selectedStage.supervisor}
          </Text>
        )}

        {selectedStage?.isFuture && (
          <>
            <TextInput
              placeholder="Add optional notes..."
              style={styles.input}
              value={formInput}
              onChangeText={setFormInput}
            />
            <Button
              label="Confirm Stage"
              backgroundColor={Colors.green20}
              onPress={handleFormSubmit}
            />
          </>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
});
