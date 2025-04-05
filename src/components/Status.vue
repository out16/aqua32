<template>
    <div class="status-container">
      <div 
        class="status-box" 
        :class="{ 'active': modoTPA === 1 }"
      >
        Modo TPA
      </div>
      <div 
        class="status-box" 
        :class="{ 'active': failsafe === 1 }"
      >
        FailSafe
      </div>
    </div>
  </template>
  
  <script>
  import { database, ref, onValue } from '../firebase';
  
  export default {
    name: 'StatusIndicators',
    data() {
      return {
        modoTPA: 0,
        failsafe: 0,
        firebaseUnsubscribe: null
      };
    },
    mounted() {
      this.setupFirebaseListener();
    },
    beforeUnmount() {
      if (this.firebaseUnsubscribe) {
        this.firebaseUnsubscribe();
      }
    },
    methods: {
      setupFirebaseListener() {
        const dadosRef = ref(database, 'dadosMomentaneos');
        
        this.firebaseUnsubscribe = onValue(dadosRef, (snapshot) => {
          const data = snapshot.val();
          
          if (data) {
            this.modoTPA = data.modoTPA !== undefined ? parseInt(data.modoTPA) : 0;
            this.failsafe = data.failsafe !== undefined ? parseInt(data.failsafe) : 0;
          }
        }, (error) => {
          console.error('Erro ao buscar dados do Firebase:', error);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .status-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif; /* Tipo de fonte padrão */
  }
  
  .status-box {
    padding: 15px;
    text-align: center;
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 5px;
    font-weight: bold;
    transition: all 0.3s ease;
    font-size: 20px; /* Tamanho padrão do texto */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Fonte alternativa */
  }
  
  .status-box.active {
    background-color: #ff6b6b;
    color: white;
    border-color: #ff5252;
  }
  
  /* Opções de personalização adicionais */
  .status-box {
    /* Para fonte maior */
    /* font-size: 18px; */
    
    /* Para fonte menor */
    /* font-size: 14px; */
    
    /* Para fonte monoespaçada */
    /* font-family: 'Courier New', monospace; */
    
    /* Para fonte mais arredondada */
    /* font-family: 'Comic Sans MS', cursive; */
    
    /* Para fonte mais elegante */
    /* font-family: 'Georgia', serif; */
  }
  </style>