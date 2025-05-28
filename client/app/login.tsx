import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Colors, Text, TextField } from "react-native-ui-lib";
import { useAuthStore } from "../store/auth.store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Login failed", "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>

        <View style={styles.inputContainer}>
          <Mail size={20} style={styles.icon} />
          <TextField
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} style={styles.icon} />
          <TextField
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.input}
          />
        </View>

        <Button
          label="Log In"
          onPress={handleLogin}
          backgroundColor={Colors.green20}
          borderRadius={12}
          disabled={loading}
          style={styles.loginButton}
        />

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.grey40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.grey60,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 8,
    color: Colors.grey40,
  },
  input: {
    flex: 1,
  },
  loginButton: {
    marginTop: 12,
    paddingVertical: 12,
  },
  forgotText: {
    textAlign: "center",
    marginTop: 16,
    color: Colors.primary,
  },
});
