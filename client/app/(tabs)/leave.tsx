import { Plus, Upload, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Colors, Text } from "react-native-ui-lib";

type LeaveRequest = {
  start: string; // "YYYY-MM-DD"
  end: string;
};

export default function LeaveScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickingStart, setPickingStart] = useState(true);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  const handleAddRequest = () => {
    if (startDate && endDate) {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);

      setPendingRequests([
        ...pendingRequests,
        { start: startStr, end: endStr },
      ]);
      setStartDate(null);
      setEndDate(null);
      setModalVisible(false);
    }
  };

  const markedDates = pendingRequests.reduce((acc, request) => {
    const start = new Date(request.start);
    const end = new Date(request.end);
    const current = new Date(start);

    while (current <= end) {
      const key = current.toISOString().split("T")[0];
      acc[key] = {
        selected: true,
        marked: true,
        selectedColor: Colors.yellow30 ?? "#FFD700",
      };
      current.setDate(current.getDate() + 1);
    }

    return acc;
  }, {} as Record<string, any>);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leave</Text>
        <Button
          label="Plan Leave"
          borderRadius={8}
          backgroundColor={Colors.green20}
          iconSource={() => <Plus size={18} color="white" />}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Calendar */}
      <View style={styles.calendarWrapper}>
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          style={styles.calendar}
          markedDates={markedDates}
          theme={{
            backgroundColor: "white",
            calendarBackground: "white",
            textSectionTitleColor: "#000",
            selectedDayTextColor: "#fff",
            selectedDayBackgroundColor: Colors.green20,
          }}
        />
      </View>

      {/* Requests */}
      <ScrollView style={styles.statusContainer}>
        {pendingRequests.length === 0 ? (
          <Text
            style={{ textAlign: "center", marginTop: 16, color: Colors.grey40 }}
          >
            No pending requests
          </Text>
        ) : (
          pendingRequests.map((req, index) => (
            <View key={index} style={styles.statusCard}>
              <Text style={styles.statusText}>
                Leave request {req.start} - {req.end}
              </Text>
              <Text style={styles.statusPending}>STATUS: Pending</Text>
              <View style={styles.divider} />
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalClose}
            >
              <X size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Leave Request</Text>
            <Text style={styles.modalSubtitle}>Select period</Text>

            {/* Start Date Picker Trigger */}
            <Button
              label={
                startDate
                  ? `Start Date: ${formatDate(startDate)}`
                  : "Select Start Date"
              }
              backgroundColor={Colors.grey80}
              color={Colors.text}
              borderRadius={12}
              style={styles.dateButton}
              onPress={() => {
                setPickingStart(true);
                setDatePickerVisible(true);
              }}
            />

            {/* End Date Picker Trigger */}
            <Button
              label={
                endDate ? `End Date: ${formatDate(endDate)}` : "Select End Date"
              }
              backgroundColor={Colors.grey80}
              borderRadius={12}
              style={styles.dateButton}
              color={Colors.text}
              onPress={() => {
                setPickingStart(false);
                setDatePickerVisible(true);
              }}
            />

            {/* Date Picker Modal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setDatePickerVisible(false);
                pickingStart ? setStartDate(date) : setEndDate(date);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />

            <Button
              label="Add"
              backgroundColor={Colors.black}
              borderRadius={12}
              iconSource={() => <Plus size={18} color="white" />}
              style={{ marginTop: 16 }}
              onPress={handleAddRequest}
            />

            <Upload
              style={{ marginVertical: 20 }}
              size={28}
              color={Colors.grey30}
            />

            <Button
              label="Save"
              backgroundColor={Colors.green20}
              borderRadius={12}
              onPress={handleAddRequest}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
  },
  calendarWrapper: {
    backgroundColor: Colors.grey80,
    borderRadius: 12,
    padding: 12,
  },
  calendar: {
    borderRadius: 10,
    paddingBottom: 12,
  },
  statusContainer: {
    marginTop: 24,
  },
  statusCard: {
    backgroundColor: Colors.grey80,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statusText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 4,
    color: Colors.text,
  },
  statusPending: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.yellow30 ?? "#FFD700",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey50,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalClose: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.grey30,
  },
  dateButton: {
    width: "100%",
    marginBottom: 12,
  },
});
