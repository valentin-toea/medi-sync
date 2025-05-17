import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card, Colors } from "react-native-ui-lib";

export function CustomCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card style={StyleSheet.flatten([styles.card, style])}>{children}</Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 2,
  },
});
