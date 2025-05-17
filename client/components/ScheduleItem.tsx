import { StyleSheet } from "react-native";
import { Badge, Card, Colors, Text, View } from "react-native-ui-lib";

export default function ScheduleItem({
  name,
  startTime,
  endTime,
}: {
  name: string;
  startTime: string;
  endTime: string;
}) {
  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.nameText}>{name}</Text>
        <Text>{`${startTime} - ${endTime}`}</Text>
      </View>
      <Badge
        label="Now"
        backgroundColor={Colors.green20}
        size={30}
        labelStyle={styles.badgeText}
        containerStyle={styles.badge}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 12,
    elevation: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 12,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 600,
  },
  badge: {
    maxWidth: 100,
  },
  badgeText: {
    fontSize: 16,
    lineHeight: 0,
    width: "100%",
    maxWidth: 100,
    textAlign: "center",
  },
});
