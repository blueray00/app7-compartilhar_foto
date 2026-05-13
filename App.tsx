import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  //Armazena o caminho onde a foto está temporariamente salva após a captura
  const [photo, setPhoto] = useState<string | null>(null);
  //Permite que se obtenha uma referência a câmera (CameraView)
  const cameraRef = useRef<CameraView>(null);

  if (!permission) { return <View />; }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Preciso da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Permitir" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  //Permite tirar uma foto e armanzenar a referência em uma variável de estado
  async function takePhoto() {
    if (cameraRef.current && isCameraReady) {
      await cameraRef.current.takePictureAsync().then(photo => {
        setPhoto(photo.uri);
      });
    }
  }
  async function savePhoto() {
    if (photo && photo.length > 0) {
      await MediaLibrary.saveToLibraryAsync(photo).then (res => {
        alert('Foto salva na galeria!')
      }).catch (err => {
        alert(`Erro ao salvar a foto: ${err}`)
      });
    } else {
      alert('Tire uma foto antes de salvar!')
    }
  }
  async function sharePhoto() {
    if (photo && photo.length > 0) {
      await Sharing.shareAsync(photo).then (res => {
        alert('Foto compartilhada com sucesso!')
      }).catch (err => {
        alert(`Erro ao compartilhar a foto: ${err}`)
      });
    } else {
      alert('Tire uma foto antes de compartilhar!')
    }
  }

    //A partir do objeto camera ref deve ser chamado o método takePictureAsync: 
    //cameraRef.current.takePictureAsync...

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} 
                  facing={facing} 
                  ref={cameraRef} 
                  onCameraReady={onCameraReady}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse-outline" size={32} color="white" />
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={!isCameraReady}>
          <Ionicons name="camera-outline" size={32} color="white" />
          <Text style={styles.text}>Tirar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={savePhoto}>
          <Ionicons name="save-outline" size={32} color="white" />
          <Text style={styles.text}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sharePhoto}>
          <Ionicons name="share-outline" size={32} color="white" />
          <Text style={styles.text}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
