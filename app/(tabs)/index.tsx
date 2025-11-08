import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>Permiso de camara requerido</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current) {
      const fotoTomada = await cameraRef.current.takePicture();
      setFoto(fotoTomada);
      console.log("Foto tomada:", fotoTomada);

      await MediaLibrary.createAssetAsync(fotoTomada.uri);
      console.log("Foto guardada en galeria UwU");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="back"
      />

      <Button title="Tomar Foto" onPress={tomarFoto} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 25 : 0,
  },
  camera: {
    width: 300,
    height: 350,
    marginBottom: 20,
  },
});
