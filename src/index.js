import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { app } from "../config"; // app'i içe aktarıyoruz

const UploadMediaFile = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    setUploading(true);

    try {
      const uri = image;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const fileName = image.substring(image.lastIndexOf("/") + 1);
      const storage = getStorage(app); // storage'i app ile başlatıyoruz
      const storageRef = ref(storage, `images/${fileName}`);

      await uploadBytes(storageRef, blob);
      setUploading(false);
      Alert.alert("Başarılı", "Resim başarıyla yüklendi");
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => {
            image
              ? uploadMedia()
              : Alert.alert("Uyarı", "Lütfen bir resim seçiniz");
          }}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  selectButton: {
    borderRadius: 5,
    backgroundColor: "blue",
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  uploadButton: {
    borderRadius: 5,
    backgroundColor: "red",
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
});

export default UploadMediaFile;
