<template>
  <div class="status-wrapper">
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
    
    <!-- Círculo indicador de mudança -->
    <div 
      class="change-indicator"
      :class="{ 'changed': valorDiferente, 'unchanged': !valorDiferente }"
      :title="'Último TesteErro: ' + ultimoTesteErro"
    ></div>
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
      ultimoTesteErro: null,
      valorAtualTesteErro: null,
      valorDiferente: false,
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
          
          // Verifica mudança no TesteErro
          if (data.TesteErro !== undefined) {
            this.valorAtualTesteErro = data.TesteErro;
            
            if (this.ultimoTesteErro === null) {
              // Primeira leitura
              this.ultimoTesteErro = this.valorAtualTesteErro;
              this.valorDiferente = false;
            } else {
              // Verifica se o valor mudou
              this.valorDiferente = (this.valorAtualTesteErro !== this.ultimoTesteErro);
              this.ultimoTesteErro = this.valorAtualTesteErro;
            }
          }
        }
      }, (error) => {
        console.error('Erro ao buscar dados do Firebase:', error);
      });
    }
  }
};
</script>

<style scoped>
.status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 15px; /* Espaço entre os status e o círculo */
}

.status-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 200px;
  
}

.status-box {
  padding: 15px;
  text-align: center;
  background-color: #878ED5;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: inset 4px 4px 8px #6e73a8, inset -4px -4px 8px #a0a9fc;
}

.status-box.active {
  background-color: #ff6b6b;
  color: white;
  border-color: #ff5252;
}

/* Estilos para o círculo indicador */
.change-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.change-indicator.changed {
  background-color: #4285f4; /* Azul quando o valor mudou */
  box-shadow: 0 0 5px rgba(66, 133, 244, 0.7);
}

.change-indicator.unchanged {
  background-color: #ff4444; /* Vermelho quando o valor permaneceu */
  box-shadow: 0 0 5px rgba(255, 68, 68, 0.7);
}
</style>