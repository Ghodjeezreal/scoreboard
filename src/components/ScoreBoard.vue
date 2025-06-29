<template>
  <div class="scoreboard">
    <header class="header">
      <template v-if="editingTitle">
        <input
          v-model="gameTitle"
          @blur="editingTitle = false"
          @keyup.enter="editingTitle = false"
          class="edit-title"
          :maxlength="32"
          autofocus
        />
      </template>
      <template v-else>
        <h1 @click="editingTitle = true" title="Click to edit">{{ gameTitle }}</h1>
      </template>
    </header>
    <div class="main">
      <div class="side left" style="background: #001F54;">
        <div class="team-name">
          <template v-if="editingLeft">
            <input
              v-model="leftLabel"
              @blur="editingLeft = false"
              @keyup.enter="editingLeft = false"
              class="edit-input"
              :maxlength="16"
              autofocus
            />
          </template>
          <template v-else>
            <h2 @click="editingLeft = true" title="Click to edit">{{ leftLabel }}</h2>
          </template>
        </div>
        <div class="score">{{ leftScore }}</div>
        <div class="controls">
          <button @click="leftScore++">+</button>
          <button @click="leftScore--" :disabled="leftScore === 0">-</button>
          <button @click="leftScore = 0">Reset</button>
        </div>
      </div>
      <div class="side right" style="background: #800020;">
        <div class="team-name">
          <template v-if="editingRight">
            <input
              v-model="rightLabel"
              @blur="editingRight = false"
              @keyup.enter="editingRight = false"
              class="edit-input"
              :maxlength="16"
              autofocus
            />
          </template>
          <template v-else>
            <h2 @click="editingRight = true" title="Click to edit">{{ rightLabel }}</h2>
          </template>
        </div>
        <div class="score">{{ rightScore }}</div>
        <div class="controls">
          <button @click="rightScore++">+</button>
          <button @click="rightScore--" :disabled="rightScore === 0">-</button>
          <button @click="rightScore = 0">Reset</button>
        </div>
      </div>
    </div>
    <div class="round-controls">
      <button @click="saveRound">Save Round</button>
      <button @click="resetAll">Reset All</button>
      <button @click="clearRounds" :disabled="rounds.length === 0">Clear Saved Rounds</button>
    </div>
    <div class="round-history" v-if="rounds.length">
      <h3>Round History</h3>
      <ul>
        <li v-for="(round, idx) in rounds" :key="idx">
          <strong>Round {{ idx + 1 }}:</strong>
          {{ round.title || gameTitle }} — {{ round.leftLabel }}: {{ round.leftScore }}, {{ round.rightLabel }}: {{ round.rightScore }}
          <span v-if="round.winner">&nbsp;|&nbsp;<b>Winner:</b> {{ round.winner }}</span>
        </li>
      </ul>
    </div>
    <footer class="footer">
  <p>
    Created by
    <a href="https://portfoliobyfred.netlify.app" target="_blank" rel="noopener noreferrer">
      Fredrick Okojie
    </a>
  </p>
</footer>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Game title
const gameTitle = ref('Nationale 20 Volleyball')
const editingTitle = ref(false)

// Team names and scores
const leftScore = ref(0)
const rightScore = ref(0)
const leftLabel = ref('Team Coach')
const rightLabel = ref('Team B')
const editingLeft = ref(false)
const editingRight = ref(false)

// Rounds history (array of objects)
const rounds = ref([])

const LOCAL_KEY = 'scoreboard_rounds_v1'
const LOCAL_TITLE = 'scoreboard_title_v1'

// Load from localStorage
onMounted(() => {
  const storedRounds = localStorage.getItem(LOCAL_KEY)
  if (storedRounds) {
    rounds.value = JSON.parse(storedRounds)
  }
  const storedTitle = localStorage.getItem(LOCAL_TITLE)
  if (storedTitle) {
    gameTitle.value = storedTitle
  }
})

// Watch for changes to save rounds and title
watch(rounds, (val) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(val))
}, { deep: true })

watch(gameTitle, (val) => {
  localStorage.setItem(LOCAL_TITLE, val)
})

// Save a round, with winner
function saveRound() {
  let winner = ''
  if (leftScore.value > rightScore.value) {
    winner = leftLabel.value
  } else if (rightScore.value > leftScore.value) {
    winner = rightLabel.value
  } else {
    winner = 'Draw'
  }
  rounds.value.push({
    title: gameTitle.value,
    leftLabel: leftLabel.value,
    rightLabel: rightLabel.value,
    leftScore: leftScore.value,
    rightScore: rightScore.value,
    winner
  })
}

// Reset all (scores and labels)
function resetAll() {
  leftScore.value = 0
  rightScore.value = 0
  leftLabel.value = 'Team Coach'
  rightLabel.value = 'Team B'
}

// Clear all saved rounds
function clearRounds() {
  rounds.value = []
}
</script>

<style scoped>
.scoreboard {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #222;
  z-index: 100;
}
.header {
  width: 100vw;
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1vw 0 1vw 0;
  font-size: 2.5vw;
  box-shadow: 0 2px 8px #0004;
  z-index: 120;
}
.header h1 {
  margin: 0;
  cursor: pointer;
  font-size: 2.2em;
  font-weight: bold;
  letter-spacing: 0.03em;
  background: rgba(255,255,255,0.06);
  padding: 0.2em 1em;
  border-radius: 0.5em;
  display: inline-block;
  transition: background 0.2s;
}
.header h1:hover {
  background: rgba(255,255,255,0.18);
}
.edit-title {
  font-size: 2vw;
  border-radius: 0.5vw;
  border: 1.5px solid #fff;
  padding: 0.1em 0.5em;
  margin: 0;
  width: 13em;
  background: #222;
  color: #fff;
  text-align: center;
}
.main {
  flex: 1;
  display: flex;
  height: 100%;
}
.side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.score {
  font-size: 9vw;
  font-weight: bold;
  margin: 2vw 0;
}
.controls {
  display: flex;
  gap: 0.8vw;
  margin-top: 1vw;
}
button {
  font-size: 2vw;
  padding: 1vw 2vw;
  border: none;
  border-radius: 0.5vw;
  background: rgba(255,255,255,0.2);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: rgba(255,255,255,0.35);
}
.round-controls {
  display: flex;
  justify-content: center;
  gap: 2vw;
  padding: 1vw 0 0.5vw 0;
  background: #222;
  border-top: 1px solid #333;
}
.reset-all {
  background: #111;
  color: #fff;
  font-size: 2vw;
  padding: 1vw 3vw;
  border-radius: 1vw;
  z-index: 110;
  opacity: 0.85;
}
.team-name {
  min-height: 3em;
  display: flex;
  align-items: center;
}
h2 {
  margin: 0;
  cursor: pointer;
  background: rgba(255,255,255,0.08);
  padding: 0.2em 0.7em;
  border-radius: 0.5em;
  transition: background 0.2s;
  font-size: 1.3em;
}
h2:hover {
  background: rgba(255,255,255,0.22);
}
.edit-input {
  font-size: 2vw;
  border-radius: 0.5vw;
  border: 1.5px solid #fff;
  padding: 0.1em 0.5em;
  margin: 0;
  width: 8em;
}
.round-history {
  background: #282828;
  color: #fff;
  padding: 1vw 3vw;
  border-top: 1px solid #333;
  max-height: 29vh;
  overflow-y: auto;
}
.round-history h3 {
  margin-top: 0;
  font-size: 1.25em;
}
.round-history ul {
  margin: 0;
  padding-left: 1.2em;
  font-size: 1.1em;
}
.round-history li {
  margin-bottom: 0.3em;
}
@media (max-width: 600px) {
  .score {
    font-size: 20vw;
  }
  button, .reset-all, .edit-input, .edit-title {
    font-size: 3.5vw;
    padding: 2vw 3vw;
  }
  .header {
    font-size: 2.5vw;
    padding: 2vw 0;
  }
  .round-history {
    font-size: 3.5vw;
  }
}
</style>