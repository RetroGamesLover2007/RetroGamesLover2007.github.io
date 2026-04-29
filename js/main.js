window.addEventListener('load', function() {

    const games = [
        { name: "Super Mario Bros.", system: "nes", rom: "roms/super-mario-bros.nes" },
        { name: "The Legend of Zelda", system: "nes", rom: "roms/zelda.nes" },
        { name: "Metroid", system: "nes", rom: "roms/metroid.nes" },
        { name: "Sonic the Hedgehog", system: "segaMD", rom: "roms/sonic.md" },
        { name: "Streets of Rage 2", system: "segaMD", rom: "roms/sor2.md" }
    ];

    const searchInput = document.getElementById('search-bar');
    const gameList = document.getElementById('game-list');

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

    new EmulatorJS('#game-wrapper', {
        system: system,
        rom: romPath,
        gameUrl: romPath,
        gameFileName: filename,
        autosave: true,
        dataPath: 'data/',
        width: 800,
        height: 600
    });
    }
