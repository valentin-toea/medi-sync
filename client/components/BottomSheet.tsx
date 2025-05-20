import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Text } from "react-native-ui-lib";

interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  title?: string;
}

export interface BottomSheetHandle {
  show: () => void;
  hide: () => void;
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  (
    {
      visible,
      onClose,
      children,
      containerStyle,
      contentContainerStyle,
      scrollEnabled = true,
      title,
    },
    ref
  ) => {
    const sheetRef = useRef<ActionSheetRef>(null);

    useImperativeHandle(ref, () => ({
      show: () => sheetRef.current?.show(),
      hide: () => sheetRef.current?.hide(),
    }));

    // React to `visible` prop
    useEffect(() => {
      if (visible) {
        sheetRef.current?.show();
      } else {
        sheetRef.current?.hide();
      }
    }, [visible]);

    return (
      <ActionSheet
        ref={sheetRef}
        gestureEnabled
        containerStyle={StyleSheet.flatten([
          styles.sheetContainer,
          containerStyle,
        ])}
        onClose={onClose}
      >
        <View style={styles.heightContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {scrollEnabled ? (
            <ScrollView
              contentContainerStyle={[
                styles.scrollViewContent,
                contentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.scrollViewContent, contentContainerStyle]}>
              {children}
            </View>
          )}
        </View>
      </ActionSheet>
    );
  }
);

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;

const MAX_HEIGHT = Dimensions.get("window").height * 0.9;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff",
  },
  heightContainer: { maxHeight: MAX_HEIGHT },
  scrollViewContent: {
    padding: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
