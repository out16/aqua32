<template>
  <div class="coluna-texto">
    <!-- Primeira linha - Temperatura Ideal -->
    <div class="linha-temperatura">
      <h3>Temperatura Ideal</h3>
      <div class="valor-temperatura">{{ temperaturaIdeal.toFixed(2) }} °C</div>
    </div>

    <!-- Segunda linha - Temperatura Ajuste -->
    <div class="linha-temperatura">
      <h3>Temperatura Ajuste</h3>
      <div class="valor-temperatura">{{ temperaturaAjuste.toFixed(2) }} °C</div>
    </div>

    <!-- Terceira linha - Botões de incremento -->
    <div class="linha-botoes">
      <button 
        @click="diminuirTemperatura" 
        class="botao-ajuste"
        :class="{ 'botao-desabilitado': temperaturaAjuste <= 24 }"
        :disabled="temperaturaAjuste <= 24"
      >-</button>
      <button 
        @click="aumentarTemperatura" 
        class="botao-ajuste"
        :class="{ 'botao-desabilitado': temperaturaAjuste >= 29 }"
        :disabled="temperaturaAjuste >= 29"
      >+</button>
    </div>

    <!-- Quarta linha - Botão de ajuste -->
    <div class="linha-ajuste">
      <button 
        @click="enviarAjuste" 
        class="botao-enviar"
        :disabled="enviandoDados"
      >
        {{ enviandoDados ? 'Enviando...' : 'Ajustar' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref as dbRef, set, onValue } from 'firebase/database';
import { database } from '@/firebase';

export default {
  name: 'AjusteTemperatura',
  data() {
    return {
      temperaturaIdeal: 26.50,
      temperaturaAjuste: 26.50,
      firebaseUnsubscribe: null,
      enviandoDados: false,
      ignorarProximaAtualizacao: false,
      ultimoEnvio: null
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
      const dadosRef = dbRef(database, 'dadosMomentaneos');
      
      this.firebaseUnsubscribe = onValue(dadosRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data && data.temperatura_ideal !== undefined) {
          const novaTemperaturaIdeal = parseFloat(data.temperatura_ideal);
          
          // Ignora atualizações por 3 segundos após enviar um ajuste
          const agora = new Date().getTime();
          if (this.ultimoEnvio && (agora - this.ultimoEnvio) < 3000) {
            return;
          }

          if (!isNaN(novaTemperaturaIdeal)) {
            this.temperaturaIdeal = novaTemperaturaIdeal;
            
            // Atualiza temperatura de ajuste apenas se não foi modificada pelo usuário
            if (Math.abs(this.temperaturaAjuste - this.temperaturaIdeal) < 0.01) {
              this.temperaturaAjuste = novaTemperaturaIdeal;
            }
          }
        }
      });
    },
    aumentarTemperatura() {
      if (this.temperaturaAjuste < 29) {
        this.temperaturaAjuste = Math.min(this.temperaturaAjuste + 0.10, 29);
      }
    },
    diminuirTemperatura() {
      if (this.temperaturaAjuste > 24) {
        this.temperaturaAjuste = Math.max(this.temperaturaAjuste - 0.10, 24);
      }
    },
    async enviarAjuste() {
      if (this.enviandoDados) return;
      
      try {
        this.enviandoDados = true;
        this.ultimoEnvio = new Date().getTime(); // Marca o momento do envio
        
        const temperaturaParaEnviar = parseFloat(this.temperaturaAjuste.toFixed(2));
        const temperaturaRef = dbRef(database, 'configuracoes/padrao_temperatura');
        
        await set(temperaturaRef, temperaturaParaEnviar);
        
        console.log('Temperatura atualizada com sucesso:', temperaturaParaEnviar);
        
        // Atualiza localmente para feedback imediato
        this.temperaturaIdeal = temperaturaParaEnviar;
        
      } catch (error) {
        console.error('Erro ao atualizar temperatura:', error);
      } finally {
        this.enviandoDados = false;
      }
    }
  }
};
</script>

<style scoped>
.coluna-texto {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  background-color: #262F80;
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
  color: #ffffff;
  text-align: center;
  width: 100%;
  max-width: 250px;
  height: 240px;
  box-shadow: inset 1px 1px 2px #6e73a8, inset -1px -1px 2px #a0a9fc;
  overflow: hidden;
}

.linha-temperatura {
  margin: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px 0;
}

.linha-temperatura h3 {
  margin: 0 0 3px 0;
  font-size: 0.70rem;
  line-height: 1.2;
  font-weight: 500;
}

.valor-temperatura {
  font-size: 1.50rem;
  font-weight: bold;
  line-height: 1.3;
  margin: 0;
}

.linha-botoes {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 4px 0;
  flex: none;
}

.botao-ajuste {
  width: 50px;
  height: 50px;
  font-size: 1.25rem;
  background-color: #3a45a3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.botao-ajuste:hover:not(:disabled) {
  background-color: #4d5ac4;
  transform: scale(1.05);
}

.botao-ajuste:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #3a45a3;
  transform: none;
}

.linha-ajuste {
  margin-top: auto;
  padding-top: 4px;
  flex: none;
}

.botao-enviar {
  width: 110px;
  max-width: 180px;
  height: 50px;
  margin: 0 auto;
  padding: 7px 10px;
  background-color: #3a45a3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-sizing: border-box;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.botao-enviar:hover:not(:disabled) {
  background-color: #4d5ac4;
  transform: scale(1.02);
}

.botao-enviar:disabled {
  opacity: 0.7;
  cursor: wait;
  background-color: #3a45a3;
  transform: none;
}

@media (max-width: 400px) {
  .coluna-texto {
    height: 230px;
    padding: 8px;
  }
  
  .valor-temperatura {
    font-size: 1.15rem;
  }
  
  .botao-ajuste {
    width: 50px;
    height: 50px;
    font-size: 1.1rem;
  }
  
  .botao-enviar {
    padding: 6px 8px;
    font-size: 0.85rem;
  }
}
</style>