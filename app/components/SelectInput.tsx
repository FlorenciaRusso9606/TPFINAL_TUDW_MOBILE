import { useState, useEffect } from "react";
import { Menu, TextInput } from "react-native-paper";
import { View } from "react-native";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

export default function SelectInput({ label, value, onChange, options, disabled }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [options]);

  return (
    <View style={{ marginBottom: 16, zIndex: 10 }}>
      <Menu
        key={options.length}           // 🔥 fuerza re-render
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            label={label}
            value={options.find((o) => o.value === value)?.label || ""}
            onFocus={() => setVisible(true)}
            right={<TextInput.Icon icon="menu-down" />}
            editable={!disabled}
          />
        }
      >
        {options.map((opt) => (
          <Menu.Item
            key={opt.value}
            onPress={() => {
              onChange(opt.value);
              setVisible(false);
            }}
            title={opt.label}
          />
        ))}
      </Menu>
    </View>
  );
}
