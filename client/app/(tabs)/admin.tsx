import BottomSheet from "@/components/BottomSheet";
import { CustomCard } from "@/components/CustomCard";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Colors, SegmentedControl, Text } from "react-native-ui-lib";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import api from "@/services/api";

const availableReplacements = ["Panaete Crina", "Dimitrie Sidonia"];

const departmentsForDate = [
  "PEDIATRICS",
  "DERMATOLOGY",
  "ORTHOPEDICS",
  "GENERAL SURGERY",
  "CARDIOLOGY",
  "ONCOLOGY",
];

export default function AdminScreen() {
  const [tab, setTab] = useState(0);
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(null);
  const [doctorLeaveRequests, setDoctorLeaveRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
      return today.toISOString().split("T")[0];
  });  
  const [nurseRequestSentFor, setNurseRequestSentFor] = useState<{dept: string, date: string} | null>(null);
    // In your renderShiftOverview or useEffect, for each department:
  const [specialtyStatus, setSpecialtyStatus] = useState<{[key: string]: any}>({});
  const [shiftDetails, setShiftDetails] = useState<any>(null);
  
  const handleDepartmentPress = async (dept: string) => {
    const specialtyData = specialtyStatus[dept];
    console.log("Handling department press for:", specialtyData);
  
    if (!specialtyData) return;
  
    if (!specialtyData.detalii.personal_suficient) {
      setShiftDetails({ type: "insufficient", dept, date: selectedDate });
      setShowShiftDetails(true);
    } else {
      // Fetch full details by onCallId
      console.log("Fetching shift details for:", specialtyData.id);
      const onCallId = specialtyData.id;
      const res = await api.get(`/api/garda/details/${onCallId}`);
      console.log("Shift details response:", res.data);
      setShiftDetails({ type: "sufficient", data: res.data });
      setShowShiftDetails(true);
    }
  };
  
    useEffect(() => {
      if (tab !== 1) return; // Only fetch when Shifts tab is active
      async function fetchSpecialtyStatus() {
        const status: {[key: string]: any} = {};
        for (const dept of departmentsForDate) {
          try {
            const res = await api.get(`/api/garda/${selectedDate}/${dept}`);
            if (res.data && res.data.detalii && typeof res.data.detalii.personal_suficient === "boolean") {
              status[dept] = res.data;
            } else {
              // If response is empty or malformed, treat as insufficient
              status[dept] = { detalii: { personal_suficient: false } };
            }
          } catch (err) {
            // On error, treat as insufficient
            status[dept] = { detalii: { personal_suficient: false } };
          }
        }
        setSpecialtyStatus(status);
      }
      fetchSpecialtyStatus();
    }, [selectedDate, tab]);

  // Doctor state
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
 
   // Fetch all doctors on mount
   useEffect(() => {
     const fetchDoctors = async () => {
       try {
         const res = await api.get("/api/utilizatori");
         setDoctors(res.data);
       } catch (err) {
        // handle error
       }
     };
     fetchDoctors();
   }, []);
 
    // Fetch leave requests when a doctor is selected
    const handleDoctorPress = async (doctor: any) => {
      setSelectedDoctor(doctor);
      setShowDoctorDetails(true);
      setIsLoadingRequests(true);
      try {
        const res = await api.get(`/api/concedii/${doctor.id}`);
        setDoctorLeaveRequests(res.data);
      } catch (err) {
        setDoctorLeaveRequests([]);
        Alert.alert("Error", "Could not fetch leave requests.");
      }
      setIsLoadingRequests(false);
    };

    // Download attachment
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

    // Change status
    const handleChangeStatus = async (leaveRequestId: number, newStatus: string) => {
      try {
        await api.put(`/api/concedii/admin/${leaveRequestId}`, { status: newStatus });
        setDoctorLeaveRequests((prev) =>
          prev.map((req) =>
            req.id === leaveRequestId ? { ...req, status: newStatus } : req
          )
        );
        Alert.alert("Success", "Status updated.");
      } catch (err) {
        Alert.alert("Error", "Could not update status.");
      }
    };

    const renderDoctorList = () => (
      <ScrollView style={styles.scrollContainer}>
        {doctors.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={{ marginBottom: 12 }}
            onPress={() => handleDoctorPress(doc)}
          >
            <CustomCard>
              <View>
                <Text style={styles.doctorName}>{doc.firstName ?? doc.prenume} {doc.lastName ?? doc.nume}</Text>
                <Text style={styles.specialty}>{doc.specialty ?? doc.specialitate}</Text>
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
                <Text style={isSelected ? styles.selectedDayText : styles.dayText}>
                  {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                </Text>
                <Text style={isSelected ? styles.selectedDayText : styles.dayText}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView style={styles.scrollContainer}>
                    {departmentsForDate.map((dept, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleDepartmentPress(dept)}
              style={{ marginBottom: 12 }}
            >
              <CustomCard>
                <View>
                  <Text style={[styles.doctorName, /* ... */]}>
                    {dept.toUpperCase()}
                  </Text>
                  {specialtyStatus[dept] && !specialtyStatus[dept].detalii.personal_suficient && (
                    <Text style={{ color: Colors.red30 }}>INSUFFICIENT STAFF</Text>
                  )}
                </View>
                <Text style={styles.detailsButton}>DETAILS</Text>
              </CustomCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

    const renderShiftDetails = () => {
    if (!shiftDetails) return null;
    if (shiftDetails.type === "insufficient") {
      // Show your hardcoded insufficient staff UI
      return (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.shiftHeader}>{shiftDetails.dept.toUpperCase()} {shiftDetails.date.split("-").reverse().join(".")}</Text>
          <Text style={styles.redText}>INSUFFICIENT STAFF</Text>
          

      <Text style={styles.missingNotice}>00:00 - 23:59</Text>
      <Text style={styles.redText}>MISSING: 1 NURSE</Text>
            {nurseRequestSentFor &&
       shiftDetails.dept === nurseRequestSentFor.dept &&
       shiftDetails.date === nurseRequestSentFor.date && (
        <Text style={{ color: Colors.green30, fontWeight: "bold", marginBottom: 12 }}>
          Request for nurse sent.
        </Text>
      )}
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

          <Button label="Back" style={{ marginTop: 20 }} onPress={() => setShowShiftDetails(false)} />
        </ScrollView>
      );
    } else if (shiftDetails.type === "sufficient") {
      // Show details from backend
      const { data } = shiftDetails;
      return (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.shiftHeader}>{data.specialty} {data.date.split("-").reverse().join(".")}</Text>
          <Text style={styles.sectionHeader}>Staff:</Text>
          {data.assignments.map((a: any) => (
            <Text key={a.assignmentId}>{a.role}: {a.name}</Text>
          ))}
          <Button label="Back" style={{ marginTop: 20 }} onPress={() => setShowShiftDetails(false)} />
        </ScrollView>
      );
    }
  };

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
        {tab === 1 && !showShiftDetails && renderShiftOverview()}
        {tab === 1 && showShiftDetails && renderShiftDetails()}
      </View>

      <BottomSheet
        visible={showDoctorDetails}
        onClose={() => setShowDoctorDetails(false)}
      >
        {selectedDoctor ? (
          <View style={{ padding: 16 }}>
            <Text style={styles.doctorName}>
              {selectedDoctor.firstName} {selectedDoctor.lastName}
            </Text>
            <Text>Email: {selectedDoctor.email}</Text>
            <Text>Phone: {selectedDoctor.phone ?? "-"}</Text>
            <Text>Specialty: {selectedDoctor.specialty}</Text>
            <Text>Role: {selectedDoctor.role}</Text>
            <Text>Parafa: {selectedDoctor.parafa ?? "-"}</Text>
            <Text>CNP: {selectedDoctor.cnp}</Text>
            <Text>Created at: {new Date(selectedDoctor.createdAt).toLocaleString()}</Text>
            <Text>Updated at: {new Date(selectedDoctor.updatedAt).toLocaleString()}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 16 }}>Leave Requests:</Text>
    {isLoadingRequests ? (
      <Text>Loading...</Text>
    ) : doctorLeaveRequests.length === 0 ? (
      <Text>No leave requests.</Text>
    ) : (
      doctorLeaveRequests.map((req) => (
        <View key={req.id} style={{ marginVertical: 8, padding: 8, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
          <Text>Period: {req.data_inceput} - {req.data_sfarsit}</Text>
          <Text>Type: {req.tip}</Text>
          <Text>Status: {req.status}</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <Button
              label="Download"
              size={Button.sizes.xSmall}
              backgroundColor={Colors.grey40}
              onPress={() => handleDownloadAttachment(req.id)}
              style={{ marginRight: 8 }}
            />
            <Button
              label="Approve"
              size={Button.sizes.xSmall}
              backgroundColor={Colors.green20}
              onPress={() => handleChangeStatus(req.id, "aprobat")}
              style={{ marginRight: 8 }}
              disabled={req.status === "aprobat"}
            />
            <Button
              label="Reject"
              size={Button.sizes.xSmall}
              backgroundColor={Colors.red30}
              onPress={() => handleChangeStatus(req.id, "respins")}
              disabled={req.status === "respins"}
            />
          </View>
        </View>
      ))
    )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
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
                style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor: selectedReplacement === nurse ? Colors.green30 : "transparent",
                  }}
                />
                <Text>{nurse}</Text>
              </TouchableOpacity>
            ))}

            <Button
              label="Save"
              backgroundColor={Colors.green20}
              onPress={() => {
                setShowModal(false);
                setNurseRequestSentFor({ dept: shiftDetails.dept, date: shiftDetails.date });
              }}
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
  scrollContainer: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12, marginTop: 20 },
  segmented: { marginBottom: 16 },
  doctorName: { fontWeight: "600", fontSize: 16 },
  specialty: { fontSize: 14, color: Colors.grey30 },
  detailsButton: { fontWeight: "700", color: Colors.black },
  dayCell: { alignItems: "center", padding: 6, flex: 1 },
  selectedDay: { backgroundColor: Colors.green20, borderRadius: 12 },
  dayText: { fontSize: 12, color: Colors.grey40, textAlign: "center" },
  selectedDayText: { color: "white", fontWeight: "bold", textAlign: "center" },
  weekCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  shiftHeader: { fontSize: 18, fontWeight: "700", color: Colors.red30, marginVertical: 12 },
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
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4, textAlign: "center" },
  modalSubtitle: { fontSize: 14, color: Colors.grey40, marginBottom: 12, textAlign: "center" },
});
