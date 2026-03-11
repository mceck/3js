export class UI {
  constructor() {
    this.levelNameEl = document.getElementById('level-name');
    this.moveCounterEl = document.getElementById('move-counter');
    this.completeOverlay = document.getElementById('level-complete');
    this.completeMovesEl = document.getElementById('complete-moves');
    this.nextLevelBtn = document.getElementById('next-level-btn');
    this.titleScreen = document.getElementById('title-screen');
    this.startBtn = document.getElementById('start-btn');
    this.levelSelectEl = document.getElementById('level-select');
  }

  setLevelName(name) {
    this.levelNameEl.textContent = name;
  }

  setMoves(count) {
    this.moveCounterEl.textContent = `Moves: ${count}`;
  }

  showComplete(moves, isLastLevel) {
    this.completeMovesEl.textContent = `Completed in ${moves} moves`;
    this.nextLevelBtn.textContent = isLastLevel ? 'Back to Menu' : 'Next Chamber';
    this.completeOverlay.classList.remove('hidden');
  }

  hideComplete() {
    this.completeOverlay.classList.add('hidden');
  }

  showTitle() {
    this.titleScreen.classList.remove('hidden');
  }

  hideTitle() {
    this.titleScreen.classList.add('hidden');
  }

  // Build level select buttons
  buildLevelSelect(totalLevels, unlockedLevel, onSelect) {
    this.levelSelectEl.innerHTML = '';
    for (let i = 0; i < totalLevels; i++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.textContent = i + 1;
      if (i > unlockedLevel) {
        btn.classList.add('locked');
      } else {
        btn.addEventListener('click', () => onSelect(i));
      }
      this.levelSelectEl.appendChild(btn);
    }
  }
}
