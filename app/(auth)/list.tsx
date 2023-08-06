import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FileObject } from "@supabase/storage-js";
import { useAuth } from "@/provider/auth-provider";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/config/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const List = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from("files").list(user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64",
      });
      const filePath = `${user!.id}/${new Date().getTime()}.${
        img.type === "image" ? "png" : "mp4"
      }`;
      const contentType = img.type === "image" ? "image/png" : "video/mp4";
      await supabase.storage
        .from("files")
        .upload(filePath, decode(base64), { contentType });
      await loadImages();

      Alert.alert("File Upload Successful");
    }
  };

  return (
    <View style={styles.container}>
      {/* FAB to add images */}
      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#151515",
  },
  fab: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: "#2b825b",
    borderRadius: 100,
  },
});

export default List;
