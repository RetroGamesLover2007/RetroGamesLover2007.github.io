window.addEventListener('load', function() {

    const games = [
        { name: "Super Mario Bros.", system: "nes", rom: "roms/super-mario-bros.nes" },
        { name: "Sonic the Hedgehog", system: "segaMD", rom: "roms/sonic.md" }
    ];
    const mainArea = document.querySelector('main');
    const gameWrapper = document.getElementById('game-wrapper');
    const buttonRow = document.createElement('div');
    buttonRow.style.marginBottom = '20px';
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '10px';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.justifyContent = 'center';
    games.forEach(function(game) {
      const btn = document.createElement('button');
      btn.textContent = game.name;
      btn.style.padding = '10px 20px';
      btn.style.background = '#0a0a0a';
      btn.style.color = '#33ff33';
      btn.style.border = '2px solid #33ff33';
      btn.style.cursor = 'pointer';
      btn.style.fontFamily = 'monospace';
      btn.style.fontSize = '1rem';

      btn.addEventListener('mouseenter', function() {
          btn.style.background = '#33ff33';
          btn.style.color = '#0a0a0a';
      });
      btn.addEventListener('mouseleave', function() {
          btn.style.background = '#0a0a0a';
          btn.style.color = '#33ff33';
      });

      btn.addEventListener('click', function() {
          launchGame(game.system, game.rom);
      });

      buttonRow.appendChild(btn);
  });
  mainArea.insertBefore(buttonRow, gameWrapper);
  function launchGame(system, romPath) {
    gameWrapper.innerHTML = '';
  new EmulatorJS(gameWrapper, {
          system: system,
          rom: romPath,
          autosave: true,
          gameUrl: romPath,
          dataPath: 'https://cdn.emulatorjs.org/stable/data/',
      });
  }

  });
