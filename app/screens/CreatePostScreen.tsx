import React, { useState, useEffect } from "react";
import { View, Image, ScrollView } from "react-native";
import { Card, TextInput, Button, Switch, Text, ActivityIndicator } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../context/AuthBase";
import { fetchWeatherByCity } from "../../services/weatherService";
import api from "../../api/api";

export default function CreatePostScreen({ navigation }: any) {
  const [contenido, setContenido] = useState("");

  const [files, setFiles] = useState<DocumentPicker.DocumentPickerSuccessResult[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] =
    useState<{ type: "success" | "error" | null; text: string | null }>({
      type: null,
      text: null,
    });

  const [attachWeather, setAttachWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const { user } = useAuth();

  // TYPE GUARD
  function isSuccessResult(
    res: DocumentPicker.DocumentPickerResult
  ): res is DocumentPicker.DocumentPickerSuccessResult {
    return res.type === "success";
  }

  // PICK ARCHIVO
  const handleFilePick = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: false,
    });

    if (isSuccessResult(res)) {
      const updated = [...files, res].slice(0, 4);
      setFiles(updated);
      setPreviews(updated.map((f) => f.uri));
    }
  };

  // FETCH WEATHER
  useEffect(() => {
    if (!attachWeather || !user?.city) return;

    let mounted = true;

    (async () => {
      try {
        const w = await fetchWeatherByCity(user.city, (user as any).country_iso);
        if (mounted) setWeatherData(w);
      } catch (err) {
        console.warn("No se pudo obtener clima", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [attachWeather, user?.city, user?.country_iso]);

  // SUBMIT
  const handleSubmit = async () => {
    if (!user) {
      return setMessage({ type: "error", text: "Debes iniciar sesión" });
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", contenido);

      if (attachWeather && weatherData) {
        formData.append("weather", JSON.stringify(weatherData));
      }

      for (const f of files) {
        formData.append("files", {
          uri: f.uri,
          name: f.name,
          type: f.mimeType ?? "application/octet-stream",
        } as any);
      }

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // limpiar
      setContenido("");
      setFiles([]);
      setPreviews([]);

      setMessage({ type: "success", text: "Post creado correctamente" });

      // volver al feed
      navigation.navigate("Feed");

    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Error al crear el post",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ borderRadius: 12 }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            Crear nuevo post
          </Text>

          <TextInput
            label="Contenido / Descripción"
            value={contenido}
            onChangeText={setContenido}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 12 }}
          />

          <Button mode="outlined" onPress={handleFilePick} style={{ marginBottom: 12 }}>
            Adjuntar archivos (máx 4)
          </Button>

          <ScrollView horizontal style={{ marginBottom: 12 }}>
            {previews.map((p, idx) => (
              <View key={idx} style={{ marginRight: 12 }}>
                <Image
                  source={{ uri: p }}
                  style={{ width: 90, height: 90, borderRadius: 8 }}
                />
                <Button
                  compact
                  onPress={() => {
                    const nf = files.filter((_, i) => i !== idx);
                    setFiles(nf);
                    setPreviews(nf.map((f) => f.uri));
                  }}
                >
                  Quitar
                </Button>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text>Adjuntar clima actual</Text>
            <Switch value={attachWeather} onValueChange={setAttachWeather} />
          </View>

          {attachWeather && weatherData && (
            <Text style={{ marginBottom: 12 }}>
              {Math.round(weatherData.current.temp)}° •{" "}
              {weatherData.current.weather?.[0]?.description}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={{ marginBottom: 12 }}
          >
            {loading ? <ActivityIndicator /> : "Publicar"}
          </Button>

          <Button
            mode="text"
            onPress={() => {
              setContenido("");
              setFiles([]);
              setPreviews([]);
            }}
          >
            Limpiar
          </Button>

          {message.text && (
            <Text
              style={{
                color: message.type === "error" ? "red" : "green",
                marginTop: 10,
              }}
            >
              {message.text}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
