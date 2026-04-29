window.addEventListener('load', function() {

    const games = [
        { name: "Super Mario Bros.", system: "nes", rom: "roms/super-mario-bros.nes" },
        { name: "The Legend of Zelda", system: "nes", rom: "roms/zelda.nes" },
        { name: "Metroid", system: "nes", rom: "roms/metroid.nes" },
        { name: "Sonic the Hedgehog", system: "segaMD", rom: "roms/sonic.md" },
        { name: "Streets of Rage 2", system: "segaMD", rom: "roms/sor2.md" }
    ];

    var currentEmulator = null;

    const searchInput = document.getElementById('search-bar');
    const gameList = document.getElementById('game-list');
    const controlBar = document.getElementById('control-bar');

    controlBar.style.display = 'none';

    function renderGameList(filterText) {
        gameList.innerHTML = '';

        const filtered = games.filter(function(game) {
            return game.name.toLowerCase().includes(filterText.toLowerCase());
        });

        if (filtered.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No games found.';
            emptyMsg.style.padding = '15px';
            emptyMsg.style.color = '#33ff33';
            emptyMsg.style.opacity = '0.6';
            gameList.appendChild(emptyMsg);
            return;
        }

        filtered.forEach(function(game) {
            const item = document.createElement('div');
            item.className = 'game-item';
            item.textContent = game.name;

            item.addEventListener('click', function() {
                document.querySelectorAll('.game-item').forEach(function(el) {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                launchGame(game.system, game.rom);
            });

            gameList.appendChild(item);
        });
    }

    searchInput.addEventListener('input', function() {
        renderGameList(this.value);
    });

    renderGameList('');

    function launchGame(system, romPath) {
        document.getElementById('game-wrapper').innerHTML = '';

        const filename = romPath.split('/').pop();

        currentEmulator = new EmulatorJS('#game-wrapper', {
            system: system,
            rom: romPath,
            gameUrl: romPath,
            gameFileName: filename,
            autosave: false,
            dataPath: 'data/',
            controlBarVisible: false,
            menuBarVisible: false
        });

        controlBar.style.display = 'flex';

        setTimeout(function() {
            var canvas = document.querySelector('#game-wrapper canvas');
            var iframe = document.querySelector('#game-wrapper iframe');
            if (canvas) {
                canvas.style.width = '800px';
                canvas.style.height = '600px';
            }
            if (iframe) {
                iframe.style.width = '800px';
                iframe.style.height = '600px';
            }

            var builtInUI = document.querySelectorAll('.emulatorjs-menu-bar, .emulatorjs-control-bar, .emulatorjs-start-menu');
            builtInUI.forEach(function(el) {
                el.remove();
            });
        }, 1500);
    }

    document.getElementById('btn-play').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.resume) {
            currentEmulator.resume();
        }
    });

    document.getElementById('btn-pause').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.pause) {
            currentEmulator.pause();
        }
    });

    document.getElementById('btn-stop').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.exit) {
            currentEmulator.exit();
            currentEmulator = null;
            document.getElementById('game-wrapper').innerHTML = '';
            controlBar.style.display = 'none';
        }
    });

    document.getElementById('btn-save').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.saveState) {
            currentEmulator.saveState();
        }
    });

    document.getElementById('btn-load').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.loadState) {
            currentEmulator.loadState();
        }
    });

    document.getElementById('btn-fullscreen').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.enterFullscreen) {
            currentEmulator.enterFullscreen();
        }
    });

});
