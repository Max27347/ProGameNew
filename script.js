const CONFIG = {
    PARTICLE_COUNT: 50,
    CLICK_EFFECT_DURATION: 1000,
    RESIZE_DEBOUNCE: 200,
    CONFETTI_COUNT: 30,
    MAX_SCALE: 1.4,
    MIN_SCALE: 1,
    SCALE_INCREMENT: 0.1,
    INCOME_INTERVAL: 3600000
};

const SKINS = [
    { src: 'https://em-content.zobj.net/source/telegram/386/video-game_1f3ae.webp', gradient: 'radial-gradient(circle at 50% 50%,rgba(255,255,255,0.2),transparent 70%)', color: '#FFFFFF', worldName: 'World of Consoles' }
];

const CHARACTERS = [
    { src: 'https://em-content.zobj.net/source/telegram/386/video-game_1f3ae.webp', name: 'Controller' },
    { src: 'https://em-content.zobj.net/source/telegram/386/monkey-face_1f435.webp', name: 'Monkey' },
    { src: 'https://em-content.zobj.net/source/telegram/386/gorilla_1f98d.webp', name: 'Gorilla' },
    { src: 'https://em-content.zobj.net/source/telegram/386/dog-face_1f436.webp', name: 'Dog' },
    { src: 'https://em-content.zobj.net/source/telegram/386/cat-face_1f431.webp', name: 'Cat' },
    { src: 'https://em-content.zobj.net/source/telegram/386/lion_1f981.webp', name: 'Lion' },
    { src: 'https://em-content.zobj.net/source/telegram/386/tiger-face_1f42f.webp', name: 'Tiger' },
    { src: 'https://em-content.zobj.net/source/telegram/386/hamster_1f439.webp', name: 'Hamster' },
    { src: 'https://em-content.zobj.net/source/telegram/386/panda_1f43c.webp', name: 'Panda' },
    { src: 'https://em-content.zobj.net/source/telegram/386/chicken_1f414.webp', name: 'Chicken' },
    { src: 'https://em-content.zobj.net/source/telegram/386/baby-chick_1f424.webp', name: 'Baby Chick' }
];

const BACKGROUND_GRADIENTS = [
    'radial-gradient(circle at 30% 30%, #FF6B6B, #4ECDC4 70%)',
    'linear-gradient(45deg, #FF9A8B, #FF6A88, #4A4E69)',
    'radial-gradient(circle at 50% 50%, #A8E6CF, #DCFFFB 70%)',
    'linear-gradient(135deg, #FFD3A5, #FD6585, #8B008B)',
    'radial-gradient(circle at 70% 20%, #C4E0E5, #4CA1AF 70%)',
    'linear-gradient(90deg, #FEE140, #FA709A)',
    'radial-gradient(circle at 40% 60%, #FFDEE9, #B5FFFC 70%)',
    'linear-gradient(180deg, #8EC5FC, #E0C3FC, #6366F1)',
    'radial-gradient(circle at 20% 80%, #F4C4F3, #FC67FA 70%)',
    'linear-gradient(270deg, #A1C4FD, #C2E9FB, #4B6CB7)'
];

const MUTATION_GRADIENT = 'radial-gradient(circle at 50% 50%, #FFD700, #FF4500 70%)';

const MARKET_SKINS = [
    { id: 'skin1', character: CHARACTERS[1], background: BACKGROUND_GRADIENTS[0], price: 500, timestamp: Date.now() - 10000 },
    { id: 'skin2', character: CHARACTERS[2], background: BACKGROUND_GRADIENTS[1], price: 750, timestamp: Date.now() - 9000 },
    { id: 'skin3', character: CHARACTERS[3], background: BACKGROUND_GRADIENTS[2], price: 300, timestamp: Date.now() - 8000 },
    { id: 'skin4', character: CHARACTERS[4], background: BACKGROUND_GRADIENTS[3], price: 1000, timestamp: Date.now() - 7000 },
    { id: 'skin5', character: CHARACTERS[5], background: BACKGROUND_GRADIENTS[4], price: 600, timestamp: Date.now() - 6000 },
    { id: 'skin6', character: CHARACTERS[6], background: BACKGROUND_GRADIENTS[5], price: 450, timestamp: Date.now() - 5000 },
    { id: 'skin7', character: CHARACTERS[7], background: BACKGROUND_GRADIENTS[6], price: 800, timestamp: Date.now() - 4000 },
    { id: 'skin8', character: CHARACTERS[8], background: BACKGROUND_GRADIENTS[7], price: 550, timestamp: Date.now() - 3000 },
    { id: 'skin9', character: CHARACTERS[9], background: BACKGROUND_GRADIENTS[8], price: 700, timestamp: Date.now() - 2000 },
    { id: 'skin10', character: CHARACTERS[10], background: BACKGROUND_GRADIENTS[9], price: 400, timestamp: Date.now() - 1000 }
];

class GameState {
    constructor() {
        this.coins = 1000;
        this.scale = CONFIG.MIN_SCALE;
        this.canInteract = true;
        this.isOverlayActive = false;
        this.isTelegram = !!(window.Telegram?.WebApp?.initData);
        this.isShopActive = false;
        this.isMarketActive = false;
        this.isLeaderboardActive = false;
        this.inventory = [];
        this.characters = [];
        this.selectedCharacter = null;
        this.nextIncomeTime = 0;
        this.isTimerStarted = false;
        this.walletConnected = false;
        this.walletAddress = null;
        this.leaderboard = [
            { nickname: 'Player123', coins: 1000, rank: 1 },
            { nickname: 'GamerX', coins: 800, rank: 2 },
            { nickname: 'CoinMaster', coins: 600, rank: 3 },
            { nickname: 'DiamondKing', coins: 400, rank: 4 },
            { nickname: 'CryptoStar', coins: 200, rank: 5 }
        ];
    }
    getCoins() { return this.coins; }
    addCoins(amount) {
        this.coins += amount;
        this.updateLeaderboard();
    }
    resetCoins(value) {
        this.coins = value;
        this.updateLeaderboard();
    }
    isTelegramEnvironment() { return this.isTelegram; }
    isShopViewActive() { return this.isShopActive; }
    setShopViewActive(value) { this.isShopActive = value; }
    isMarketViewActive() { return this.isMarketActive; }
    setMarketViewActive(value) { this.isMarketActive = value; }
    isLeaderboardViewActive() { return this.isLeaderboardActive; }
    setLeaderboardViewActive(value) { this.isLeaderboardActive = value; }
    addToInventory(item) {
        const character = {
            ...item,
            level: 1,
            incomeRate: 100,
            timerEnd: 0
        };
        this.inventory.push(character);
        this.characters.push(character);
        if (item.name === 'Controller' && !this.selectedCharacter) {
            this.selectedCharacter = character;
        }
    }
    getInventory() { return this.inventory; }
    getCharacters() { return this.characters; }
    setSelectedCharacter(character) {
        this.selectedCharacter = character;
        this.isTimerStarted = false;
        this.nextIncomeTime = 0;
    }
    getSelectedCharacter() { return this.selectedCharacter; }
    updateLeaderboard() {
        const playerEntry = this.leaderboard.find(p => p.nickname === 'Player123');
        if (playerEntry) {
            playerEntry.coins = this.coins;
        }
        this.leaderboard.sort((a, b) => b.coins - a.coins);
        this.leaderboard.forEach((player, index) => {
            player.rank = index + 1;
        });
    }
    getLeaderboard() { return this.leaderboard; }
    upgradeCharacter(character) {
        if (character.level < 3) {
            const upgradeCost = character.level === 1 ? 1000 : 3000;
            if (this.coins >= upgradeCost) {
                this.coins -= upgradeCost;
                character.level += 1;
                character.incomeRate = character.level * 100;
                this.updateLeaderboard();
                return true;
            }
        }
        return false;
    }
    getNextIncomeTime() { return this.nextIncomeTime; }
    setNextIncomeTime(time) { this.nextIncomeTime = time; }
    startTimer() { this.isTimerStarted = true; }
    isTimerActive() { return this.isTimerStarted; }
    setWalletConnected(connected, address = null) {
        this.walletConnected = connected;
        this.walletAddress = address;
    }
    isWalletConnected() { return this.walletConnected; }
    getWalletAddress() { return this.walletAddress; }
}

class ParticleSystem {
    constructor(canvas, count) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = new Array(count);
        this.time = 0;
        this.isAnimating = false;
        for (let i = 0; i < count; i++) this.particles[i] = this.createParticle();
        this.resize(); // Инициализация размеров canvas
    }
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3
        };
    }
    update() {
        this.time += 0.016;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedX += (Math.random() - 0.5) * 0.05;
            p.speedY += (Math.random() - 0.5) * 0.05;
            p.speedX = Math.max(-0.5, Math.min(0.5, p.speedX));
            p.speedY = Math.max(-0.5, Math.min(0.5, p.speedY));
            p.opacity = 0.3 + 0.5 * (Math.sin(this.time + i) + 1) / 2;
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color').trim();
        let r = 255, g = 255, b = 255;
        if (highlightColor.startsWith('#')) {
            const hex = highlightColor.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        console.log('ParticleSystem started'); // Лог для отладки
        this.canvas.classList.remove('game-hidden'); // Убедимся, что canvas видим
        this.canvas.classList.add('visible');
        this.animate();
    }
    stop() {
        this.isAnimating = false;
        this.canvas.classList.remove('visible');
        this.canvas.classList.add('game-hidden');
    }
    animate() {
        if (!this.isAnimating) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x = Math.random() * this.canvas.width;
            p.y = Math.random() * this.canvas.height;
        }
        console.log('ParticleSystem resized:', this.canvas.width, this.canvas.height); // Лог для отладки
    }
}

class ConfettiSystem {
    constructor(canvas, count, nextColor) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = false;
        this.nextColor = nextColor || '#FFFFFF';
        this.colors = ['#FFFFFF', this.nextColor];
        this.maxCount = count;
        this.spawnRate = 0.05;
        this.removeProbability = 0.02;
        this.resize();
    }
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -Math.random() * 50,
            width: Math.random() * 3 + 3,
            height: Math.random() * 3 + 3,
            speedY: Math.random() * 2 + 2,
            opacity: 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * Math.PI * 2
        };
    }
    update() {
        this.particles = this.particles.filter(p => {
            p.y += p.speedY;
            p.rotation += 0.05;
            if (p.y > this.canvas.height * 0.9) return Math.random() > this.removeProbability;
            return true;
        });
        if (this.particles.length < this.maxCount && Math.random() < this.spawnRate) this.particles.push(this.createParticle());
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.save();
            this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            this.ctx.restore();
        }
    }
    start(nextColor) {
        if (this.isAnimating) return;
        if (nextColor) {
            this.nextColor = nextColor;
            this.colors = ['#FFFFFF', this.nextColor];
        }
        this.particles = [];
        for (let i = 0; i < this.maxCount; i++) {
            const p = this.createParticle();
            p.y = Math.random() * this.canvas.height;
            this.particles.push(p);
        }
        this.isAnimating = true;
        this.canvas.classList.remove('game-hidden');
        this.canvas.classList.add('visible');
        this.animate();
    }
    stop() {
        this.isAnimating = false;
        this.canvas.classList.remove('visible');
        this.canvas.classList.add('game-hidden');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        if (this.isAnimating) {
            for (let i = 0; i < this.maxCount; i++) {
                const p = this.createParticle();
                p.y = Math.random() * this.canvas.height;
                this.particles.push(p);
            }
        }
    }
}

class ClickEffectPool {
    constructor() {
        this.pool = [];
        this.active = [];
    }
    getEffect() {
        let effect = this.pool.pop();
        if (!effect) {
            effect = document.createElement('img');
            effect.src = 'https://em-content.zobj.net/source/telegram/386/collision_1f4a5.webp';
            effect.className = 'click-effect';
            effect.setAttribute('draggable', 'false');
        }
        return effect;
    }
    showEffect(x, y) {
        const effect = this.getEffect();
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        document.body.appendChild(effect);
        this.active.push(effect);
        setTimeout(() => {
            effect.remove();
            this.active = this.active.filter(e => e !== effect);
            this.pool.push(effect);
        }, CONFIG.CLICK_EFFECT_DURATION);
    }
}

class UIManager {
    constructor(elements) {
        this.elements = elements;
        this.pendingUpdates = {};
    }
    updateCoinCounterPosition() {
        const topMenuHeight = this.elements.topMenu.offsetHeight;
        this.elements.coinCounter.style.top = `${topMenuHeight + 10}px`;
    }
    updateLoadingPercent(percent) {
        this.elements.loadingPercent.textContent = `${Math.round(percent)}%`;
    }
    showGameUI() {
        this.elements.loadingScreen.classList.add('hidden');
        this.elements.topMenu.classList.remove('game-hidden');
        this.elements.topMenu.classList.add('visible');
        this.elements.particleCanvas.classList.remove('game-hidden');
        this.elements.particleCanvas.classList.add('visible');
        this.elements.mainContent.classList.remove('game-hidden');
        this.elements.mainContent.classList.add('visible');
        this.elements.footer.classList.remove('game-hidden');
        this.elements.footer.classList.add('visible');
        setTimeout(() => { this.elements.loadingScreen.style.display = 'none'; }, 500);
    }
    updateCharacterScale(scale) {
        this.elements.character.style.transform = `scale(${scale})`;
    }
    updateTimerDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        this.elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    toggleConnectButton(show) {
        this.elements.tonConnect.style.display = show ? 'flex' : 'none';
    }
    toggleDisconnectButton(show) {
        this.elements.disconnectWallet.style.display = show ? 'block' : 'none';
    }
    queueUpdate(key, value) {
        this.pendingUpdates[key] = value;
    }
    applyUpdates() {
        requestAnimationFrame(() => {
            for (const [key, value] of Object.entries(this.pendingUpdates)) {
                if (key === 'coins') this.elements.coinCount.textContent = Math.floor(value);
                if (key === 'totalCoins') this.elements.totalCoins.textContent = Math.floor(value);
                if (key === 'characterSrc') this.elements.character.src = value;
                if (key === 'gradient') {
                    console.log('Applying gradient:', value); // Лог для отладки
                    document.documentElement.style.setProperty('--bg-gradient', value);
                }
                if (key === 'highlightColor') document.documentElement.style.setProperty('--highlight-color', value);
                if (key === 'worldName') this.elements.playerStats.textContent = value;
                if (key === 'incomeRate') this.elements.incomeRate.textContent = value;
            }
            this.pendingUpdates = {};
            const digits = this.elements.coinCount.textContent.length;
            const translateX = digits > 5 ? -(digits - 5) * 10 : 0;
            this.elements.coinCounter.style.transform = `translateX(${translateX}px)`;
        });
    }
}

class CharacterController {
    constructor(state, ui, effectPool, confettiSystem) {
        this.state = state;
        this.ui = ui;
        this.effectPool = effectPool;
        this.confettiSystem = confettiSystem;
        this.listeners = [];
        this.lastTapTime = 0;
        this.resetTimeout = null;
    }
    initialize() {
        const currentSkin = SKINS[0];
        this.ui.queueUpdate('characterSrc', currentSkin.src);
        this.ui.queueUpdate('gradient', currentSkin.gradient);
        this.ui.queueUpdate('highlightColor', currentSkin.color);
        this.ui.queueUpdate('worldName', currentSkin.worldName);
        this.ui.queueUpdate('coins', this.state.getCoins());
        this.ui.queueUpdate('totalCoins', this.state.getCoins());
        this.updateIncomeRate();
        this.ui.applyUpdates();
        this.attachListeners();
    }
    updateIncomeRate() {
        const selectedCharacter = this.state.getSelectedCharacter();
        const totalIncomeRate = selectedCharacter ? selectedCharacter.incomeRate || 100 : 100;
        this.ui.queueUpdate('incomeRate', totalIncomeRate);
    }
    updateAppearance() {
        const currentSkin = SKINS[0];
        const selectedCharacter = this.state.getSelectedCharacter();
        if (selectedCharacter) {
            this.ui.queueUpdate('characterSrc', selectedCharacter.src);
            this.ui.queueUpdate('gradient', selectedCharacter.isMutated ? MUTATION_GRADIENT : selectedCharacter.background || currentSkin.gradient);
            this.ui.queueUpdate('highlightColor', selectedCharacter.isMutated ? '#FFD700' : currentSkin.color);
        } else {
            this.ui.queueUpdate('characterSrc', currentSkin.src);
            this.ui.queueUpdate('gradient', currentSkin.gradient);
            this.ui.queueUpdate('highlightColor', currentSkin.color);
        }
        this.ui.queueUpdate('worldName', currentSkin.worldName);
        this.ui.applyUpdates();
        this.updateIncomeRate();
    }
    handleTap(e) {
        e.preventDefault();
        const now = performance.now();
        if (now - this.lastTapTime < 100) return;
        this.lastTapTime = now;
        if (!this.state.canInteract || this.state.isOverlayActive) return;
        if (!this.state.isTimerActive()) {
            this.state.startTimer();
            this.state.setNextIncomeTime(Date.now() + CONFIG.INCOME_INTERVAL);
            this.startTimer();
            this.startIncomeTimer();
            this.startCoinUpdate();
        }
        this.state.scale = Math.min(this.state.scale + CONFIG.SCALE_INCREMENT, CONFIG.MAX_SCALE);
        this.ui.updateCharacterScale(this.state.scale);
        this.effectPool.showEffect(e.clientX, e.clientY);
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => {
            if (this.state.scale !== CONFIG.MIN_SCALE) {
                this.state.scale = CONFIG.MIN_SCALE;
                this.ui.updateCharacterScale(this.state.scale);
            }
        }, 1000);
    }
    startIncomeTimer() {
        setInterval(() => {
            const selectedCharacter = this.state.getSelectedCharacter();
            const totalIncomeRate = selectedCharacter ? selectedCharacter.incomeRate || 100 : 100;
            this.ui.queueUpdate('incomeRate', totalIncomeRate);
            this.ui.applyUpdates();
            this.state.setNextIncomeTime(Date.now() + CONFIG.INCOME_INTERVAL);
        }, CONFIG.INCOME_INTERVAL);
    }
    startCoinUpdate() {
        const updateCoins = () => {
            if (this.state.isTimerActive()) {
                const selectedCharacter = this.state.getSelectedCharacter();
                const totalIncomeRate = selectedCharacter ? selectedCharacter.incomeRate || 100 : 100;
                const incomePerSecond = totalIncomeRate / 3600;
                this.state.addCoins(incomePerSecond);
                this.ui.queueUpdate('coins', this.state.getCoins());
                this.ui.queueUpdate('totalCoins', this.state.getCoins());
                this.ui.applyUpdates();
            }
            setTimeout(updateCoins, 1000);
        };
        updateCoins();
    }
    startTimer() {
        const updateTimer = () => {
            if (!this.state.isTimerActive()) {
                this.ui.updateTimerDisplay(0);
            } else {
                const timeLeft = this.state.getNextIncomeTime() - Date.now();
                if (timeLeft <= 0) {
                    this.ui.updateTimerDisplay(0);
                } else {
                    this.ui.updateTimerDisplay(timeLeft);
                }
            }
            requestAnimationFrame(updateTimer);
        };
        updateTimer();
    }
    attachListeners() {
        const tapListener = this.handleTap.bind(this);
        this.ui.elements.character.addEventListener('pointerdown', tapListener);
        this.listeners.push({ element: this.ui.elements.character, type: 'pointerdown', listener: tapListener });
    }
    destroy() {
        this.listeners.forEach(({ element, type, listener }) => element.removeEventListener(type, listener));
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
    }
}

class Game {
    constructor(elements) {
        this.state = new GameState();
        this.ui = new UIManager(elements);
        this.particleSystem = new ParticleSystem(elements.particleCanvas, CONFIG.PARTICLE_COUNT);
        this.confettiSystem = new ConfettiSystem(elements.confettiCanvas, CONFIG.CONFETTI_COUNT, '#FFFFFF');
        this.effectPool = new ClickEffectPool();
        this.characterController = new CharacterController(this.state, this.ui, this.effectPool, this.confettiSystem);
        this.resizeTimeout = null;
        this.listeners = [];
        this.isInventoryView = false;
        this.availableMarketSkins = [...MARKET_SKINS];
        this.tonConnectUI = null;
    }
    initializeWallet() {
        try {
            this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'https://max27347.github.io/ProGameNew/manifest.json',
                buttonRootId: 'ton-connect'
            });
            if (this.state.isTelegramEnvironment()) {
                this.tonConnectUI.uiOptions = {
                    twaReturnUrl: 'https://t.me/Heroes_coin_bot'
                };
            }
            this.tonConnectUI.onStatusChange(walletInfo => {
                if (walletInfo) {
                    const address = walletInfo.account.address;
                    this.state.setWalletConnected(true, address);
                    this.ui.toggleDisconnectButton(true);
                    this.ui.toggleConnectButton(false);
                } else {
                    this.state.setWalletConnected(false, null);
                    this.ui.toggleDisconnectButton(false);
                    if (this.ui.elements.marketContainer.classList.contains('visible')) {
                        this.ui.toggleConnectButton(true);
                    }
                }
                this.ui.applyUpdates();
            });
            const disconnectListener = async () => {
                try {
                    await this.tonConnectUI.disconnect();
                    console.log('Wallet disconnected');
                } catch (error) {
                    console.error('Error disconnecting wallet:', error);
                    alert(`Failed to disconnect wallet: ${error.message}`);
                }
            };
            this.ui.elements.disconnectWallet.addEventListener('pointerdown', disconnectListener);
            this.listeners.push({
                element: this.ui.elements.disconnectWallet,
                type: 'pointerdown',
                listener: disconnectListener
            });
            if (this.tonConnectUI.wallet) {
                this.state.setWalletConnected(true, this.tonConnectUI.wallet.account.address);
                this.ui.toggleDisconnectButton(true);
                this.ui.applyUpdates();
            }
        } catch (error) {
            console.error('Error initializing TON Connect UI:', error);
            this.ui.applyUpdates();
        }
    }
    async preloadAssets() {
        const imageUrls = [
            'https://placehold.co/40x40',
            ...SKINS.map(skin => skin.src),
            ...CHARACTERS.map(char => char.src),
            'https://em-content.zobj.net/source/telegram/386/television_1f4fa.webp',
            'https://em-content.zobj.net/source/telegram/386/crown_1f451.webp',
            'https://em-content.zobj.net/source/telegram/386/shopping-bags_1f6cd-fe0f.webp',
            'https://em-content.zobj.net/source/telegram/386/collision_1f4a5.webp',
            'https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp',
            'https://em-content.zobj.net/source/telegram/386/popcorn_1f37f.webp',
            'https://em-content.zobj.net/source/telegram/386/luggage_1f9f3.webp',
            'https://em-content.zobj.net/source/telegram/386/joystick_1f579-fe0f.webp'
        ];
        let loadedCount = 0;
        const totalImages = imageUrls.length;
        const loadImage = url => {
            return new Promise(resolve => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    loadedCount++;
                    const percent = (loadedCount / totalImages) * 100;
                    this.ui.updateLoadingPercent(percent);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to load image: ${url}. Attempting fallback.`);
                    img.src = 'https://dummyimage.com/40x40/000/fff';
                    img.onload = () => {
                        loadedCount++;
                        const percent = (loadedCount / totalImages) * 100;
                        this.ui.updateLoadingPercent(percent);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load fallback image for: ${url}`);
                        loadedCount++;
                        const percent = (loadedCount / totalImages) * 100;
                        this.ui.updateLoadingPercent(percent);
                        resolve();
                    };
                };
            });
        };
        await Promise.all(imageUrls.map(loadImage));
        this.ui.showGameUI();
        this.characterController.initialize();
        this.particleSystem.start(); // Гарантированный запуск частиц
        console.log('Initializing ParticleSystem and UI'); // Лог для отладки
        this.initializeWallet();
    }
    updateInventoryDisplay() {
        const inventoryContainer = this.ui.elements.inventoryItems;
        inventoryContainer.innerHTML = '';
        const inventory = this.state.getInventory();
        inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item-container';
            itemDiv.style.background = item.background || 'none';
            itemDiv.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.name;
            img.className = 'inventory-image';
            if (item.isMutated) img.className += ' mutated';
            const nameDiv = document.createElement('div');
            nameDiv.className = 'inventory-name';
            nameDiv.textContent = item.name;
            const statsDiv = document.createElement('div');
            statsDiv.className = 'inventory-stats';
            statsDiv.style.fontSize = '0.9rem';
            statsDiv.style.color = '#FFF';
            statsDiv.style.opacity = '0.8';
            statsDiv.textContent = `Lvl ${item.level}, ${item.incomeRate}/h`;
            const upgradeButton = document.createElement('div');
            upgradeButton.className = 'upgrade-button';
            upgradeButton.innerHTML = item.level < 3 ?
                `Up ${item.level === 1 ? 1000 : 3000} <img src="https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp" alt="Gem Stone" class="gem-icon">` :
                'Max Level';
            if (item.level < 3) {
                upgradeButton.addEventListener('pointerdown', () => {
                    if (this.state.upgradeCharacter(item)) {
                        itemDiv.classList.add('upgrade-anim');
                        setTimeout(() => itemDiv.classList.remove('upgrade-anim'), 500);
                        this.ui.queueUpdate('coins', this.state.getCoins());
                        this.ui.queueUpdate('totalCoins', this.state.getCoins());
                        this.ui.applyUpdates();
                        this.updateInventoryDisplay();
                        if (this.state.getSelectedCharacter() === item) {
                            this.characterController.updateAppearance();
                        }
                        this.characterController.updateIncomeRate();
                    } else {
                        alert('Not enough diamonds or max level reached!');
                    }
                });
            } else {
                upgradeButton.style.opacity = '0.5';
                upgradeButton.style.pointerEvents = 'none';
            }
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameDiv);
            itemDiv.appendChild(statsDiv);
            itemDiv.appendChild(upgradeButton);
            itemDiv.addEventListener('pointerdown', (e) => {
                if (e.target !== upgradeButton && !e.target.closest('.upgrade-button')) {
                    this.state.setSelectedCharacter(item);
                    this.ui.elements.inventoryContainer.classList.remove('visible');
                    this.ui.elements.inventoryContainer.classList.add('hidden');
                    this.ui.elements.shopContainer.classList.remove('hidden');
                    this.ui.elements.shopContainer.classList.add('visible');
                    this.ui.elements.inventoryArrowLeft.classList.remove('visible');
                    this.ui.elements.inventoryArrowLeft.classList.add('hidden');
                    this.ui.elements.shopArrowLeft.classList.remove('hidden');
                    this.ui.elements.shopArrowLeft.classList.add('visible');
                    this.ui.elements.shopArrowRight.classList.remove('hidden');
                    this.ui.elements.shopArrowRight.classList.add('visible');
                    this.isInventoryView = false;
                    this.characterController.updateAppearance();
                }
            });
            inventoryContainer.appendChild(itemDiv);
        });
    }
    updateLeaderboardDisplay() {
        const tbody = this.ui.elements.leaderboardTable.querySelector('tbody');
        tbody.innerHTML = '';
        const leaderboard = this.state.getLeaderboard();
        leaderboard.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.rank}</td>
                <td>${player.nickname}</td>
                <td>${Math.floor(player.coins)}</td>
            `;
            tbody.appendChild(row);
        });
    }
    initializeMarketFilters() {
        const characterFilter = this.ui.elements.characterFilter;
        const backgroundFilter = this.ui.elements.backgroundFilter;
        CHARACTERS.forEach(char => {
            const option = document.createElement('option');
            option.value = char.name;
            option.textContent = char.name;
            characterFilter.appendChild(option);
        });
        BACKGROUND_GRADIENTS.forEach((bg, index) => {
            const option = document.createElement('option');
            option.value = bg;
            option.textContent = `Background ${index + 1}`;
            backgroundFilter.appendChild(option);
        });
    }
    updateMarketDisplay() {
        const marketContainer = this.ui.elements.marketItems;
        marketContainer.innerHTML = '';
        let filteredSkins = [...this.availableMarketSkins];
        const characterFilter = this.ui.elements.characterFilter.value;
        const backgroundFilter = this.ui.elements.backgroundFilter.value;
        const sortOption = this.ui.elements.priceSort.value;
        if (characterFilter) {
            filteredSkins = filteredSkins.filter(skin => skin.character.name === characterFilter);
        }
        if (backgroundFilter) {
            filteredSkins = filteredSkins.filter(skin => skin.background === backgroundFilter);
        }
        if (sortOption === 'price-desc') {
            filteredSkins.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'price-asc') {
            filteredSkins.sort((a, b) => a.price - b.price);
        } else {
            filteredSkins.sort((a, b) => b.timestamp - a.timestamp);
        }
        filteredSkins.forEach(skin => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'market-item-container';
            itemDiv.style.background = skin.background;
            itemDiv.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
            itemDiv.style.minHeight = '200px';
            const img = document.createElement('img');
            img.src = skin.character.src;
            img.alt = skin.character.name;
            img.className = 'market-image';
            const nameDiv = document.createElement('div');
            nameDiv.className = 'market-name';
            nameDiv.textContent = skin.character.name;
            const priceDiv = document.createElement('div');
            priceDiv.className = 'market-price';
            priceDiv.innerHTML = `
                <span>${skin.price}</span>
                <img src="https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp" alt="Gem Stone" class="gem-icon">
            `;
            const buyButton = document.createElement('div');
            buyButton.className = 'buy-button';
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('pointerdown', () => {
                if (this.state.getCoins() >= skin.price) {
                    this.state.addCoins(-skin.price);
                    this.state.addToInventory({
                        src: skin.character.src,
                        name: skin.character.name,
                        background: skin.background,
                        isMutated: false
                    });
                    this.availableMarketSkins = this.availableMarketSkins.filter(s => s.id !== skin.id);
                    this.updateMarketDisplay();
                    this.updateInventoryDisplay();
                    this.ui.queueUpdate('coins', this.state.getCoins());
                    this.ui.queueUpdate('totalCoins', this.state.getCoins());
                    this.ui.applyUpdates();
                } else {
                    alert('Not enough diamonds!');
                }
            });
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameDiv);
            itemDiv.appendChild(priceDiv);
            itemDiv.appendChild(buyButton);
            marketContainer.appendChild(itemDiv);
        });
    }
    showCaseAnimation(caseType) {
        const isDiamondCase = caseType === 'diamond-rain';
        const currency = isDiamondCase ? '100 Diamonds' : 'Free (Test)';
        const overlay = document.createElement('div');
        overlay.className = 'case-animation-overlay hidden';
        const message = document.createElement('div');
        message.className = 'case-animation-message hidden';
        message.textContent = `Spin for ${currency}!`;
        const animationContainer = document.createElement('div');
        animationContainer.id = 'caseAnimationContainer';
        animationContainer.className = 'case-animation-container';
        const rouletteStrip = document.createElement('div');
        rouletteStrip.className = 'roulette-strip';
        animationContainer.appendChild(rouletteStrip);
        const animationBar = document.createElement('div');
        animationBar.className = 'animation-bar';
        animationContainer.appendChild(animationBar);
        const spinButton = document.createElement('div');
        spinButton.className = 'case-animation-button';
        spinButton.textContent = 'Spin';
        const cancelButton = document.createElement('div');
        cancelButton.className = 'case-animation-cancel';
        cancelButton.textContent = "I'll stop tempting fate";
        overlay.appendChild(message);
        overlay.appendChild(animationContainer);
        overlay.appendChild(spinButton);
        overlay.appendChild(cancelButton);
        document.body.appendChild(overlay);
        const items = [...CHARACTERS.slice(1)];
        const diamondItem = { src: 'https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp', name: 'Diamonds' };
        if (isDiamondCase) {
            items.push(diamondItem);
        }
        const rouletteItems = [];
        const reward = this.generateCaseReward(caseType);
        for (let i = 0; i < 40; i++) {
            if (i === 19) {
                rouletteItems.push(reward);
                continue;
            }
            let randomItem;
            if (isDiamondCase && Math.random() < 0.6) {
                randomItem = diamondItem;
            } else {
                randomItem = items[Math.floor(Math.random() * (isDiamondCase ? items.length : CHARACTERS.length - 1))];
            }
            rouletteItems.push({
                ...randomItem,
                isMutated: randomItem.name !== 'Diamonds' && Math.random() < 0.1,
                background: BACKGROUND_GRADIENTS[Math.floor(Math.random() * BACKGROUND_GRADIENTS.length)],
                value: randomItem.name === 'Diamonds' ? Math.floor(Math.random() * 250) + 1 : undefined
            });
        }
        const renderRoulette = () => {
            rouletteStrip.innerHTML = '';
            rouletteItems.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'roulette-item';
                itemDiv.dataset.itemName = item.name;
                itemDiv.style.background = item.background;
                itemDiv.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
                const bgDiv = document.createElement('div');
                bgDiv.className = 'animation-background';
                bgDiv.style.background = item.background;
                itemDiv.appendChild(bgDiv);
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.name;
                img.className = 'animation-character';
                if (item.isMutated && item.name !== 'Diamonds') img.className += ' mutated';
                itemDiv.appendChild(img);
                if (index === 19) {
                    itemDiv.dataset.winner = 'true';
                }
                rouletteStrip.appendChild(itemDiv);
            });
        };
        renderRoulette();
        requestAnimationFrame(() => {
            overlay.classList.remove('hidden');
            overlay.classList.add('visible');
            message.classList.remove('hidden');
            message.classList.add('visible');
            setTimeout(() => {
                spinButton.className += ' visible';
                cancelButton.className += ' visible';
            }, 300);
        });
        const onCancel = () => {
            overlay.classList.remove('visible');
            overlay.classList.add('hidden');
            message.classList.remove('visible');
            message.classList.add('hidden');
            spinButton.classList.remove('visible');
            cancelButton.classList.remove('visible');
            setTimeout(() => {
                overlay.remove();
                this.state.isOverlayActive = false;
            }, 500);
            cancelButton.removeEventListener('pointerdown', onCancel);
        };
        cancelButton.addEventListener('pointerdown', onCancel);
        const startRoulette = () => {
            if (isDiamondCase && this.state.getCoins() < 100) {
                alert('Not enough diamonds!');
                onCancel();
                return;
            }
            if (isDiamondCase) {
                this.state.addCoins(-100);
                this.ui.queueUpdate('coins', this.state.getCoins());
                this.ui.queueUpdate('totalCoins', this.state.getCoins());
                this.ui.applyUpdates();
            }
            spinButton.style.pointerEvents = 'none';
            spinButton.style.opacity = '0.5';
            rouletteStrip.style.opacity = '1';
            rouletteStrip.style.animation = 'roulette-spin 5s cubic-bezier(0.1, 0.7, 0.3, 1) forwards';
            const onAnimationEnd = () => {
                const isMobile = window.innerWidth <= 600;
                rouletteStrip.style.transform = isMobile ? 'translateX(-2008px)' : 'translateX(-2434px)';
                const winnerIndex = 19;
                const winnerItem = rouletteStrip.children[winnerIndex];
                if (winnerItem) {
                    const img = winnerItem.querySelector('img');
                    if (img) {
                        img.src = reward.src;
                        img.alt = reward.name;
                        img.className = 'animation-character';
                        if (reward.isMutated && reward.name !== 'Diamonds') img.className += ' mutated';
                    }
                    const bgDiv = winnerItem.querySelector('.animation-background');
                    if (bgDiv) {
                        bgDiv.style.background = reward.background;
                    }
                    winnerItem.dataset.itemName = reward.name;
                    winnerItem.style.background = reward.background;
                    winnerItem.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
                    winnerItem.dataset.winner = 'true';
                    winnerItem.classList.add('winner');
                    message.textContent = `You won ${reward.name === 'Diamonds' ? `${reward.value} Diamonds` : reward.name}${reward.isMutated && reward.name !== 'Diamonds' ? ' (Mutated)' : ''}!`;
                    if (reward.name === 'Diamonds') {
                        this.state.addCoins(reward.value);
                        this.ui.queueUpdate('coins', this.state.getCoins());
                        this.ui.queueUpdate('totalCoins', this.state.getCoins());
                    } else {
                        this.state.addToInventory(reward);
                        this.updateInventoryDisplay();
                    }
                    this.ui.applyUpdates();
                    setTimeout(() => {
                        overlay.classList.remove('visible');
                        overlay.classList.add('hidden');
                        message.classList.remove('visible');
                        message.classList.add('hidden');
                        spinButton.classList.remove('visible');
                        cancelButton.classList.remove('visible');
                        setTimeout(() => {
                            overlay.remove();
                            this.state.isOverlayActive = false;
                            rouletteStrip.style.opacity = '1';
                        }, 500);
                    }, 2000);
                }
                rouletteStrip.removeEventListener('animationend', onAnimationEnd);
            };
            rouletteStrip.addEventListener('animationend', onAnimationEnd);
        };
        spinButton.addEventListener('pointerdown', startRoulette);
    }
    generateCaseReward(caseType) {
        const isDiamondCase = caseType === 'diamond-rain';
        const background = BACKGROUND_GRADIENTS[Math.floor(Math.random() * BACKGROUND_GRADIENTS.length)];
        if (isDiamondCase) {
            const roll = Math.random();
            if (roll < 0.95) {
                const diamonds = Math.floor(Math.random() * 250) + 1;
                return {
                    type: 'diamonds',
                    name: 'Diamonds',
                    value: diamonds,
                    isMutated: false,
                    background,
                    src: 'https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp'
                };
            } else {
                const characterIndex = Math.floor(Math.random() * (CHARACTERS.length - 1)) + 1;
                const character = CHARACTERS[characterIndex];
                const isMutated = Math.random() < 0.1;
                return {
                    type: 'character',
                    character,
                    isMutated,
                    background,
                    name: character.name,
                    src: character.src
                };
            }
        } else {
            const characterIndex = Math.floor(Math.random() * (CHARACTERS.length - 1)) + 1;
            const character = CHARACTERS[characterIndex];
            const isMutated = Math.random() < 0.1;
            return {
                type: 'character',
                character,
                isMutated,
                background,
                name: character.name,
                src: character.src
            };
        }
    }
    initialize() {
        this.state.addToInventory({
            src: CHARACTERS[0].src,
            name: CHARACTERS[0].name,
            background: BACKGROUND_GRADIENTS[0],
            isMutated: false
        });
        this.preloadAssets();
        this.initializeMarketFilters();
        this.updateInventoryDisplay();
        this.updateLeaderboardDisplay();
        this.ui.updateCoinCounterPosition();
        const resizeListener = () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.particleSystem.resize();
                this.confettiSystem.resize();
                this.ui.updateCoinCounterPosition();
            }, CONFIG.RESIZE_DEBOUNCE);
        };
        window.addEventListener('resize', resizeListener);
        this.listeners.push({ element: window, type: 'resize', listener: resizeListener });
        const menuItems = this.ui.elements.footer.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const menuType = item.dataset.menu;
            const listener = () => {
                menuItems.forEach(i => i.classList.remove('highlighted'));
                item.classList.add('highlighted');
                this.ui.elements.shopContainer.classList.remove('visible');
                this.ui.elements.shopContainer.classList.add('hidden');
                this.ui.elements.inventoryContainer.classList.remove('visible');
                this.ui.elements.inventoryContainer.classList.add('hidden');
                this.ui.elements.marketContainer.classList.remove('visible');
                this.ui.elements.marketContainer.classList.add('hidden');
                this.ui.elements.leaderboardContainer.classList.remove('visible');
                this.ui.elements.leaderboardContainer.classList.add('hidden');
                this.ui.elements.shopArrowLeft.classList.remove('visible');
                this.ui.elements.shopArrowLeft.classList.add('hidden');
                this.ui.elements.shopArrowRight.classList.remove('visible');
                this.ui.elements.shopArrowRight.classList.add('hidden');
                this.ui.elements.inventoryArrowLeft.classList.remove('visible');
                this.ui.elements.inventoryArrowLeft.classList.add('hidden');
                this.state.setShopViewActive(false);
                this.state.setMarketViewActive(false);
                this.state.setLeaderboardViewActive(false);
                if (menuType === 'home') {
                    this.isInventoryView = false;
                } else if (menuType === 'shop') {
                    this.ui.elements.shopContainer.classList.remove('hidden');
                    this.ui.elements.shopContainer.classList.add('visible');
                    this.ui.elements.shopArrowLeft.classList.remove('hidden');
                    this.ui.elements.shopArrowLeft.classList.add('visible');
                    this.ui.elements.shopArrowRight.classList.remove('hidden');
                    this.ui.elements.shopArrowRight.classList.add('visible');
                    this.state.setShopViewActive(true);
                    this.isInventoryView = false;
                } else if (menuType === 'market') {
                    this.ui.elements.marketContainer.classList.remove('hidden');
                    this.ui.elements.marketContainer.classList.add('visible');
                    this.state.setMarketViewActive(true);
                    this.updateMarketDisplay();
                    if (!this.state.isWalletConnected()) {
                        this.ui.toggleConnectButton(true);
                    } else {
                        this.ui.toggleDisconnectButton(true);
                    }
                } else if (menuType === 'leaderboard') {
                    this.ui.elements.leaderboardContainer.classList.remove('hidden');
                    this.ui.elements.leaderboardContainer.classList.add('visible');
                    this.state.setLeaderboardViewActive(true);
                    this.updateLeaderboardDisplay();
                }
            };
            item.addEventListener('pointerdown', listener);
            this.listeners.push({ element: item, type: 'pointerdown', listener });
        });
        const caseContainers = this.ui.elements.shopContainer.querySelectorAll('.case-container');
        caseContainers.forEach(container => {
            const caseType = container.dataset.case;
            const listener = () => {
                this.state.isOverlayActive = true;
                this.showCaseAnimation(caseType);
            };
            container.addEventListener('pointerdown', listener);
            this.listeners.push({ element: container, type: 'pointerdown', listener });
        });
        const shopArrowLeftListener = () => {
            this.ui.elements.shopContainer.classList.remove('visible');
            this.ui.elements.shopContainer.classList.add('hidden');
            this.ui.elements.inventoryContainer.classList.remove('hidden');
            this.ui.elements.inventoryContainer.classList.add('visible');
            this.ui.elements.shopArrowLeft.classList.remove('visible');
            this.ui.elements.shopArrowLeft.classList.add('hidden');
            this.ui.elements.shopArrowRight.classList.remove('visible');
            this.ui.elements.shopArrowRight.classList.add('hidden');
            this.ui.elements.inventoryArrowLeft.classList.remove('hidden');
            this.ui.elements.inventoryArrowLeft.classList.add('visible');
            this.isInventoryView = true;
            this.updateInventoryDisplay();
        };
        this.ui.elements.shopArrowLeft.addEventListener('pointerdown', shopArrowLeftListener);
        this.listeners.push({ element: this.ui.elements.shopArrowLeft, type: 'pointerdown', listener: shopArrowLeftListener });
        const shopArrowRightListener = () => {
            this.ui.elements.shopContainer.classList.remove('visible');
            this.ui.elements.shopContainer.classList.add('hidden');
            this.ui.elements.inventoryContainer.classList.remove('hidden');
            this.ui.elements.inventoryContainer.classList.add('visible');
            this.ui.elements.shopArrowLeft.classList.remove('visible');
            this.ui.elements.shopArrowLeft.classList.add('hidden');
            this.ui.elements.shopArrowRight.classList.remove('visible');
            this.ui.elements.shopArrowRight.classList.add('hidden');
            this.ui.elements.inventoryArrowLeft.classList.remove('hidden');
            this.ui.elements.inventoryArrowLeft.classList.add('visible');
            this.isInventoryView = true;
            this.updateInventoryDisplay();
        };
        this.ui.elements.shopArrowRight.addEventListener('pointerdown', shopArrowRightListener);
        this.listeners.push({ element: this.ui.elements.shopArrowRight, type: 'pointerdown', listener: shopArrowRightListener });
        const inventoryArrowLeftListener = () => {
            this.ui.elements.inventoryContainer.classList.remove('visible');
            this.ui.elements.inventoryContainer.classList.add('hidden');
            this.ui.elements.shopContainer.classList.remove('hidden');
            this.ui.elements.shopContainer.classList.add('visible');
            this.ui.elements.inventoryArrowLeft.classList.remove('visible');
            this.ui.elements.inventoryArrowLeft.classList.add('hidden');
            this.ui.elements.shopArrowLeft.classList.remove('hidden');
            this.ui.elements.shopArrowLeft.classList.add('visible');
            this.ui.elements.shopArrowRight.classList.remove('hidden');
            this.ui.elements.shopArrowRight.classList.add('visible');
            this.isInventoryView = false;
        };
        this.ui.elements.inventoryArrowLeft.addEventListener('pointerdown', inventoryArrowLeftListener);
        this.listeners.push({ element: this.ui.elements.inventoryArrowLeft, type: 'pointerdown', listener: inventoryArrowLeftListener });
        const filterListener = () => this.updateMarketDisplay();
        this.ui.elements.characterFilter.addEventListener('change', filterListener);
        this.ui.elements.backgroundFilter.addEventListener('change', filterListener);
        this.ui.elements.priceSort.addEventListener('change', filterListener);
        this.listeners.push({ element: this.ui.elements.characterFilter, type: 'change', listener: filterListener });
        this.listeners.push({ element: this.ui.elements.backgroundFilter, type: 'change', listener: filterListener });
        this.listeners.push({ element: this.ui.elements.priceSort, type: 'change', listener: filterListener });
        if (this.state.isTelegramEnvironment()) {
            document.body.dataset.telegram = 'true';
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();
            }
        }
    }
    destroy() {
        this.listeners.forEach(({ element, type, listener }) => element.removeEventListener(type, listener));
        this.characterController.destroy();
        this.particleSystem.stop();
        this.confettiSystem.stop();
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        loadingPercent: document.getElementById('loadingPercent'),
        topMenu: document.getElementById('topMenu'),
        particleCanvas: document.getElementById('particleCanvas'),
        confettiCanvas: document.getElementById('confettiCanvas'),
        mainContent: document.getElementById('mainContent'),
        footer: document.getElementById('footer'),
        character: document.getElementById('character'),
        coinCounter: document.getElementById('coinCounter'),
        coinCount: document.getElementById('coinCount'),
        totalCoins: document.getElementById('totalCoins'),
        shopContainer: document.getElementById('shopContainer'),
        inventoryContainer: document.getElementById('inventoryContainer'),
        marketContainer: document.getElementById('marketContainer'),
        leaderboardContainer: document.getElementById('leaderboardContainer'),
        shopArrowLeft: document.getElementById('shopArrowLeft'),
        shopArrowRight: document.getElementById('shopArrowRight'),
        inventoryArrowLeft: document.getElementById('inventoryArrowLeft'),
        tonConnect: document.getElementById('ton-connect'),
        disconnectWallet: document.getElementById('disconnect-wallet'),
        characterFilter: document.getElementById('characterFilter'),
        backgroundFilter: document.getElementById('backgroundFilter'),
        priceSort: document.getElementById('priceSort'),
        marketItems: document.getElementById('marketItems'),
        inventoryItems: document.getElementById('inventoryItems'),
        leaderboardTable: document.getElementById('leaderboardTable'),
        playerStats: document.querySelector('.player-stats'),
        incomeCounter: document.getElementById('incomeCounter'),
        incomeRate: document.getElementById('incomeRate'),
        incomeTimer: document.getElementById('incomeTimer'),
        timerDisplay: document.getElementById('timerDisplay')
    };
    const game = new Game(elements);
    game.initialize();
    window.addEventListener('beforeunload', () => game.destroy());
});