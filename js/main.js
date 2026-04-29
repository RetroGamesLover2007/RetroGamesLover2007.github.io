window.addEventListener('load', function() {

    const games = [
        { name: "Super Mario Bros.", system: "nes", rom: "roms/super-mario-bros.nes" },
        { name: "The Legend of Zelda", system: "nes", rom: "roms/zelda.nes" },
        { name: "Metroid", system: "nes", rom: "roms/metroid.nes" },
        { name: "Sonic the Hedgehog", system: "segaMD", rom: "roms/sonic.md" },
        { name: "Streets of Rage 2", system: "segaMD", rom: "roms/sor2.md" }
    ];

    var currentEmulator = null;
    var nukeInterval = null;

    const searchInput = document.getElementById('search-bar');
    const gameList = document.getElementById('game-list');
    const controlBar = document.getElementById('control-bar');

    controlBar.style.display = 'none';

    function nukeEmulatorUI() {
        var wrapper = document.getElementById('game-wrapper');
        if (!wrapper) return;
        var children = wrapper.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            if (child.tagName !== 'CANVAS' && child.tagName !== 'IFRAME') {
                child.remove();
            }
        }
    }

    function renderGameList(filterText) {
        gameList.innerHTML = '';

        var filtered = games.filter(function(game) {
            return game.name.toLowerCase().includes(filterText.toLowerCase());
        });

        if (filtered.length === 0) {
            var emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No games found.';
            emptyMsg.style.padding = '15px';
            emptyMsg.style.color = '#33ff33';
            emptyMsg.style.opacity = '0.6';
            gameList.appendChild(emptyMsg);
            return;
        }

        filtered.forEach(function(game) {
            var item = document.createElement('div');
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
        if (nukeInterval) clearInterval(nukeInterval);

        var wrapper = document.getElementById('game-wrapper');
        wrapper.innerHTML = '';

        var filename = romPath.split('/').pop();

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

        nukeInterval = setInterval(nukeEmulatorUI, 500);

        setTimeout(function() {
            nukeEmulatorUI();
            console.log('Emulator methods:', Object.keys(currentEmulator));
            if (currentEmulator.gameManager) {
                console.log('gameManager methods:', Object.keys(currentEmulator.gameManager));
            }
        }, 2000);
    }

    document.getElementById('btn-play').addEventListener('click', function() {
        console.log('Play clicked, emulator:', currentEmulator);
        if (currentEmulator) {
            if (typeof currentEmulator.resume === 'function') {
                currentEmulator.resume();
            } else if (currentEmulator.gameManager && typeof currentEmulator.gameManager.resume === 'function') {
                currentEmulator.gameManager.resume();
            } else {
                console.log('Available methods:', Object.keys(currentEmulator));
                if (currentEmulator.gameManager) {
                    console.log('gameManager methods:', Object.keys(currentEmulator.gameManager));
                }
            }
        }
    });

    document.getElementById('btn-pause').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.pause) {
            currentEmulator.pause();
        } else if (currentEmulator && currentEmulator.gameManager && currentEmulator.gameManager.pause) {
            currentEmulator.gameManager.pause();
        }
    });

    document.getElementById('btn-stop').addEventListener('click', function() {
        if (nukeInterval) clearInterval(nukeInterval);
        nukeInterval = null;
        if (currentEmulator && currentEmulator.gameManager && currentEmulator.gameManager.exit) {
            currentEmulator.gameManager.exit();
        }
        currentEmulator = null;
        document.getElementById('game-wrapper').innerHTML = '';
        controlBar.style.display = 'none';
    });

    document.getElementById('btn-save').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.saveState) {
            currentEmulator.saveState();
        } else if (currentEmulator && currentEmulator.gameManager && currentEmulator.gameManager.saveState) {
            currentEmulator.gameManager.saveState();
        }
    });

    document.getElementById('btn-load').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.loadState) {
            currentEmulator.loadState();
        } else if (currentEmulator && currentEmulator.gameManager && currentEmulator.gameManager.loadState) {
            currentEmulator.gameManager.loadState();
        }
    });

    document.getElementById('btn-fullscreen').addEventListener('click', function() {
        if (currentEmulator && currentEmulator.gameManager && currentEmulator.gameManager.openFullscreen) {
            currentEmulator.gameManager.openFullscreen();
        } else {
            var wrapper = document.getElementById('game-wrapper');
            if (wrapper.requestFullscreen) {
                wrapper.requestFullscreen();
            }
        }
    });

});
