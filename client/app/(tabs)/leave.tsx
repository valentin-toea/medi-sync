import BottomSheet from "@/components/BottomSheet";
import { CustomCard } from "@/components/CustomCard";
import { Plus, Upload } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from "react";
import { ActionSheetIOS, Platform, ScrollView, StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Colors, SegmentedControl, Text } from "react-native-ui-lib";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type LeaveRequest = {
  id: any;
  status: React.ReactNode;
  start: string; // "YYYY-MM-DD"
  end: string;
};

const leaveTypes = [
  { label: "Rest", value: "concediu_odihna" },
  { label: "Medical", value: "concediu_medical" },
  { label: "Unpaid", value: "concediu_fara_plata" },
  { label: "Other", value: "altul" },
];

export default function LeaveScreen() {
  const userDetails = useAuthStore((state) => state.userDetails);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [attachment, setAttachment] = useState<any>(null);
  const [leaveTypeIndex, setLeaveTypeIndex] = useState(1); // default to Medical

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickingStart, setPickingStart] = useState(true);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userDetails?.id) return;
      try {
        const res = await api.get(`/api/concedii/${userDetails.id}`);
        // The backend returns an array of { id, data_inceput, data_sfarsit, tip, status }
        setPendingRequests(
          res.data.map((req: any) => ({
            start: req.data_inceput,
            end: req.data_sfarsit,
            type: req.tip,
            status: req.status,
            id: req.id,
          }))
        );
      } catch (err) {
        Alert.alert("Error", "Could not fetch leave requests.");
      }
    };
    fetchRequests();
  }, [userDetails?.id]);

  const handleAddRequest = async () => {
    if (startDate && endDate) {
      const formData = new FormData();
      formData.append("userId", String(userDetails?.id || 0));
      formData.append("startDate", formatDate(startDate));
      formData.append("endDate", formatDate(endDate));
      formData.append("type", leaveTypes[leaveTypeIndex].value);

      if (attachment) {
        formData.append("atasament", {
          uri: attachment.uri,
          name: attachment.name || "attachment.jpg",
          type: attachment.mimeType || "image/jpeg",
        } as any);
      }

      try {
        const result = await api.post("api/concedii", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Alert.alert("Success", "Leave request submitted!");
        setPendingRequests([
          ...pendingRequests,
          {
            start: formatDate(startDate), end: formatDate(endDate),
            id: result.data.id,
            status: "in_asteptare",
          },
        ]);
        setStartDate(null);
        setEndDate(null);
        setAttachment(null);
        setModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to submit leave request.");
      }
    }
  };

   const handleAddAttachment = async () => {
    const openCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setAttachment(result.assets[0]);
        Alert.alert('Photo selected', result.assets[0].uri);
      }
    };
  
    const openDocument = async () => {
      const doc = await DocumentPicker.getDocumentAsync({});
      if (!doc.canceled && doc.assets && doc.assets[0]) {
        setAttachment(doc.assets[0]);
        Alert.alert('Document selected', doc.assets[0].uri);
      }
    };
  
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Pick Document'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await openCamera();
          } else if (buttonIndex === 2) {
            await openDocument();
          }
        }
      );
    } else {
      Alert.alert(
        'Add Attachment',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: openCamera },
          { text: 'Pick Document', onPress: openDocument },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleDownloadAttachment = async (leaveRequestId: number) => {
    try {
      const url = `${api.defaults.baseURL}/api/concedii/download/${leaveRequestId}`;
      const fileUri = FileSystem.cacheDirectory + `attachment-${leaveRequestId}`;
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {
          headers: {
            Authorization: String(api.defaults.headers.common["Authorization"] ?? ""),
          },
        }
      );
      const downloadResult = await downloadResumable.downloadAsync();
      if (downloadResult && downloadResult.uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("Downloaded", "File downloaded to: " + downloadResult.uri);
        }
      } else {
        Alert.alert("Error", "Download failed.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not download or open the attachment.");
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
      <CustomCard>
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          markedDates={markedDates}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#4A5568",
            dayTextColor: "#1A202C",
            todayTextColor: Colors.primary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: "#fff",
            arrowColor: Colors.primary,
            monthTextColor: "#1A202C",
          }}
        />
      </CustomCard>

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
          <TouchableOpacity
            key={req.id ?? index}
            style={styles.statusCard}
            onPress={() => handleDownloadAttachment(req.id)}
            disabled={!req.id} // Only enable if id exists
          >
            <Text style={styles.statusText}>
              Leave request {req.start} - {req.end}
            </Text>
            <Text style={styles.statusPending}>STATUS: {req.status}</Text>
            <View style={styles.divider} />
          </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <BottomSheet
        title={"Leave Request"}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalSubtitle}>Select period</Text>
          <SegmentedControl
            segments={leaveTypes.map((t) => ({ label: t.label }))}
            onChangeIndex={setLeaveTypeIndex}
            initialIndex={leaveTypeIndex}
            containerStyle={{ marginBottom: 16 }}
          />

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
              if (pickingStart) {
                setStartDate(date);
                return;
              }
              setEndDate(date);
            }}
            onCancel={() => setDatePickerVisible(false)}
          />

          <Button
            label="Add"
            backgroundColor={Colors.black}
            borderRadius={12}
            iconSource={() => <Plus size={18} color="white" />}
            style={{ marginTop: 16 }}
            onPress={handleAddAttachment}
          />

          <Upload
            style={{ marginVertical: 20, alignSelf: "center" }}
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
      </BottomSheet>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    marginTop: 20,
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
  modalContent: {
    backgroundColor: Colors.white,
  },
  modalClose: {
    alignSelf: "flex-end",
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
