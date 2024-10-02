// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcGp8Hbwyj08bKym-d_UIAPh6UWLLd578",
  authDomain: "pantomime-e1bc4.firebaseapp.com",
  projectId: "pantomime-e1bc4",
  storageBucket: "pantomime-e1bc4.appspot.com",
  messagingSenderId: "772360251311",
  appId: "1:772360251311:web:54d37dd594dbfd6064b15a",
  measurementId: "G-6FWSPGWYLS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
