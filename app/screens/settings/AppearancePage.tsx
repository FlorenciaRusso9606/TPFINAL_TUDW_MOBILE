import { View } from "react-native";
import { Text } from "react-native-paper";
import ToggleButton from "../../components/ToggleButton";

export default function AppearancePage() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Apariencia</Text>
      <Text variant="bodyMedium" style={{ marginTop: 8 }}>
        Seleccioná el modo que prefieras:
      </Text>

      <View style={{ marginTop: 20 }}>
        <ToggleButton />
      </View>
    </View>
  );
}
