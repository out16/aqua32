

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database'; // Importa as funções corretas

// Configurações do Firebase (substitua com as suas)
const firebaseConfig = {

  apiKey: "AIzaSyASGMP99IUuaPQNZ2vxTtpYBG2mFfh6xsw",

    authDomain: "aqua32-9617b.firebaseapp.com",
  
    databaseURL: "https://aqua32-9617b-default-rtdb.firebaseio.com",
  
    projectId: "aqua32-9617b",
  
    storageBucket: "aqua32-9617b.firebasestorage.app",
  
    messagingSenderId: "354385620649",
  
    appId: "1:354385620649:web:fbf6c7cdd4d07c875843b8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Realtime Database
const database = getDatabase(app);

// Exporta as funções necessárias
export { database, ref, onValue };