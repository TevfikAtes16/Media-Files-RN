import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmsW4Lxa0FG3Wx_Jqi4nOT_t8w9ag7RdU",
  authDomain: "mediaupload-e6f69.firebaseapp.com",
  projectId: "mediaupload-e6f69",
  storageBucket: "mediaupload-e6f69.appspot.com",
  messagingSenderId: "272133665349",
  appId: "1:272133665349:web:11c22934344c9814d9a92c",
  measurementId: "G-E4CVVK65JG",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };