export class UI {
  constructor() {
    this.levelNameEl = document.getElementById('level-name');
    this.moveCounterEl = document.getElementById('move-counter');
    this.completeOverlay = document.getElementById('level-complete');
    this.completeHeading = document.getElementById('complete-heading');
    this.completeNarrative = document.getElementById('complete-narrative');
    this.completeMovesEl = document.getElementById('complete-moves');
    this.nextLevelBtn = document.getElementById('next-level-btn');
    this.titleScreen = document.getElementById('title-screen');
    this.startBtn = document.getElementById('start-btn');
    this.levelSelectEl = document.getElementById('level-select');
    this.introOverlay = document.getElementById('level-intro');
    this.introLevelName = document.getElementById('intro-level-name');
    this.introDescription = document.getElementById('intro-description');
    this.introStartBtn = document.getElementById('intro-start-btn');
  }

  setLevelName(name) {
    this.levelNameEl.textContent = name;
  }

  setMoves(count) {
    this.moveCounterEl.textContent = `Moves: ${count}`;
  }

  showComplete(moves, isLastLevel, narrativeText) {
    this.completeHeading.textContent = isLastLevel ? 'The Vaults Are Restored' : 'Chamber Activated';
    if (narrativeText) {
      this.completeNarrative.textContent = narrativeText;
      this.completeNarrative.style.display = 'block';
    } else {
      this.completeNarrative.style.display = 'none';
    }
    this.completeMovesEl.textContent = `Completed in ${moves} moves`;
    this.nextLevelBtn.textContent = isLastLevel ? 'Back to Menu' : 'Next Chamber';
    this.completeOverlay.classList.remove('hidden');
  }

  hideComplete() {
    this.completeOverlay.classList.add('hidden');
  }

  showIntro(name, description) {
    this.introLevelName.textContent = name;
    this.introDescription.textContent = description;
    this.introOverlay.classList.remove('hidden');
  }

  hideIntro() {
    this.introOverlay.classList.add('hidden');
  }

  showTitle() {
    this.titleScreen.classList.remove('hidden');
  }

  hideTitle() {
    this.titleScreen.classList.add('hidden');
  }

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
