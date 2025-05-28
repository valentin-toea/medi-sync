import BottomSheet from "@/components/BottomSheet";
import { CustomCard } from "@/components/CustomCard";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Colors, SegmentedControl, Text } from "react-native-ui-lib";

const doctors = [
  { name: "Dr. Mihai Popescu", specialty: "Pediatrics" },
  { name: "Dr. Maria Ionescu", specialty: "Dermatology" },
  { name: "Dr. Elena Georgescu", specialty: "Pediatrics" },
  { name: "Dr. Alexandru Dumitru", specialty: "Orthopedics" },
  { name: "Dr. Andreea Stoica", specialty: "Gynecology" },
  { name: "Dr. Mihai Radu", specialty: "Neurology" },
  { name: "Dr. Ioana Marinescu", specialty: "Endocrinology" },
];

const availableReplacements = ["Panaete Crina", "Dimitrie Sidonia"];

export default function AdminScreen() {
  const [tab, setTab] = useState(0);
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(-1);

  useEffect(() => {
    setShowShiftDetails(false);
  }, [tab]);

  const renderDoctorList = () => (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      {doctors.map((doc, idx) => (
        <TouchableOpacity
          key={idx}
          style={{ marginBottom: 12 }}
          onPress={() => {
            setSelectedDoctor(idx);
            setShowDoctorDetails(true);
          }}
        >
          <CustomCard>
            <View>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.specialty}>{doc.specialty}</Text>
            </View>
          </CustomCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderShiftOverview = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    // This could be replaced with an API call filtered by selectedDate
    const departmentsForDate = [
      "Pediatrics",
      "Dermatology",
      "Orthopedics",
      "General Surgery",
      "Gynecology",
      "Oncology",
    ];

    return (
      <>
        <View style={styles.weekCalendar}>
          {weekDays.map((date, idx) => {
            const dateStr = date.toISOString().split("T")[0];
            const isSelected = selectedDate === dateStr;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedDate(dateStr)}
                style={[styles.dayCell, isSelected && styles.selectedDay]}
              >
                <Text
                  style={isSelected ? styles.selectedDayText : styles.dayText}
                >
                  {date
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .toUpperCase()}
                </Text>
                <Text
                  style={isSelected ? styles.selectedDayText : styles.dayText}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView>
          {departmentsForDate.map((dept, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                dept === "Pediatrics" ? setShowShiftDetails(true) : {}
              }
              style={styles.card}
            >
              <View>
                <Text
                  style={[
                    styles.doctorName,
                    dept === "Pediatrics" && { color: Colors.red30 },
                  ]}
                >
                  {" "}
                  {dept.toUpperCase()}{" "}
                </Text>
                {dept === "Pediatrics" && (
                  <Text style={{ color: Colors.red30 }}>
                    INSUFFICIENT STAFF
                  </Text>
                )}
              </View>
              <Text style={styles.detailsButton}>DETAILS</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  const renderShiftDetails = () => (
    <View>
      <Text style={styles.shiftHeader}>
        PEDIATRICS {selectedDate.split("-").reverse().join(".")}
      </Text>
      <Text style={styles.missingNotice}>08:00 - 20:00</Text>
      <Text style={styles.redText}>MISSING: 1 NURSE</Text>
      <Button
        label="CHECK STAFF AVAILABILITY"
        backgroundColor={Colors.red30}
        borderRadius={8}
        style={{ marginVertical: 12 }}
        onPress={() => setShowModal(true)}
      />

      <Text style={styles.sectionHeader}>Current Staff:</Text>
      <Text>Dr. Anghel Mihai</Text>
      <Text>Dr. Mircea Andreea (Resident)</Text>
      <Text>Nurse 1: Mihai Silvia</Text>
      <Text>Nurse 2: -</Text>
      <Text>Orderly: Hristea Corina</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionHeader}>20:00 - 08:00</Text>
      <Text>Dr. Costescu Laura</Text>
      <Text>Dr. Andon Andrei (Resident)</Text>
      <Text>Nurse 1: Muraru Traian</Text>
      <Text>Nurse 2: Jianu Andra</Text>
      <Text>Orderly: Corneliu Horia</Text>

      <Button
        label="Back"
        backgroundColor={Colors.grey40}
        borderRadius={8}
        style={{ marginTop: 20 }}
        onPress={() => setShowShiftDetails(false)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.title}>Administrative</Text>

        <SegmentedControl
          segments={[{ label: "Doctors" }, { label: "Shifts" }]}
          initialIndex={tab}
          onChangeIndex={(index) => setTab(index)}
          containerStyle={styles.segmented}
          activeColor={Colors.green20}
        />
      </View>

      <View style={{ flex: 1 }}>
        {tab === 0 && renderDoctorList()}
        {tab === 2 && !showShiftDetails && renderShiftOverview()}
        {tab === 2 && showShiftDetails && renderShiftDetails()}
      </View>

      <BottomSheet
        visible={showDoctorDetails}
        onClose={() => setShowDoctorDetails(false)}
      >
        <Text>{doctors[selectedDoctor]?.name}</Text>
      </BottomSheet>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => setShowModal(false)}
            >
              <X size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Replace On-Call Staff</Text>
            <Text style={styles.modalSubtitle}>Available Nurses</Text>

            {availableReplacements.map((nurse, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedReplacement(nurse)}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor:
                      selectedReplacement === nurse
                        ? Colors.green30
                        : "transparent",
                  }}
                />
                <Text>{nurse}</Text>
              </TouchableOpacity>
            ))}

            <Button
              label="Save"
              backgroundColor={Colors.green20}
              onPress={() => setShowModal(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  segmented: { marginBottom: 16 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  doctorName: { fontWeight: "600", fontSize: 16 },
  specialty: { fontSize: 14, color: Colors.grey30 },
  detailsButton: { fontWeight: "700", color: Colors.black },
  dayCell: { alignItems: "center", padding: 6, flex: 1 },
  selectedDay: {
    backgroundColor: Colors.green20,
    borderRadius: 12,
  },
  dayText: { fontSize: 12, color: Colors.grey40, textAlign: "center" },
  selectedDayText: { color: "white", fontWeight: "bold", textAlign: "center" },
  weekCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  shiftHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.red30,
    marginVertical: 12,
  },
  missingNotice: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  redText: { color: Colors.red30, fontWeight: "600", marginBottom: 12 },
  sectionHeader: { fontWeight: "600", marginTop: 16, marginBottom: 6 },
  divider: { height: 1, backgroundColor: Colors.grey60, marginVertical: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.grey40,
    marginBottom: 12,
    textAlign: "center",
  },
});
