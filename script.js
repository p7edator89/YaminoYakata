// 2D謎解きホラーゲーム - JavaScript

// 部屋のオブジェクトを現在の儀式パターンに基づいて更新
function updateRoomObjectsForPattern() {
    const currentPattern = ritualPatterns[gameState.currentRitualPattern];
    
    // 各部屋の紙片オブジェクトを更新
    const paperLocations = [
        { roomId: 0, objectId: "hall_drawer" },
        { roomId: 1, objectId: "library_box" },
        { roomId: 5, objectId: "lab_cabinet" },
        { roomId: 7, objectId: "ancient_safe" },
        { roomId: 8, objectId: "wine_cipher" }
    ];
    
    paperLocations.forEach((location, index) => {
        const room = rooms[location.roomId];
        const obj = room.objects.find(o => o.id === location.objectId);
        if (obj && obj.paper) {
            obj.paper = currentPattern.papers[index];
        }
    });
}

// ゲーム状態管理
// 5つの最終儀式パターン（4つ怖い、1つ良い）
const ritualPatterns = [
    {
        answer: "永遠に呪われる",
        papers: [
            {number: 1, character: "永"},
            {number: 2, character: "遠"},
            {number: 3, character: "に"},
            {number: 4, character: "呪"},
            {number: 5, character: "われる"}
        ],
        story: "死してもなお、この苦痛は永遠に続くのだ...",
        type: "horror"
    },
    {
        answer: "血に染まる館",
        papers: [
            {number: 1, character: "血"},
            {number: 2, character: "に"},
            {number: 3, character: "染"},
            {number: 4, character: "まる"},
            {number: 5, character: "館"}
        ],
        story: "この館の壁は、無数の犠牲者の血で染まっている...",
        type: "horror"
    },
    {
        answer: "魂を奪われる",
        papers: [
            {number: 1, character: "魂"},
            {number: 2, character: "を"},
            {number: 3, character: "奪"},
            {number: 4, character: "わ"},
            {number: 5, character: "れる"}
        ],
        story: "エドワードの実験は、生者の魂を奪い続けている...",
        type: "horror"
    },
    {
        answer: "闇に堕ちる者",
        papers: [
            {number: 1, character: "闇"},
            {number: 2, character: "に"},
            {number: 3, character: "堕"},
            {number: 4, character: "ちる"},
            {number: 5, character: "者"}
        ],
        story: "禁断の知識に触れた者は、必ず闇に堕ちる運命にある...",
        type: "horror"
    },
    {
        answer: "光が救いとなる",
        papers: [
            {number: 1, character: "光"},
            {number: 2, character: "が"},
            {number: 3, character: "救"},
            {number: 4, character: "いと"},
            {number: 5, character: "なる"}
        ],
        story: "真実の光だけが、この呪われた魂を救うことができる。",
        type: "salvation"
    }
];

// レアアイテムの定義（回復アイテム）
const rareItems = [
    {
        id: "protection_charm",
        name: "守護のお守り",
        description: "古い護符。持っているだけで危険を回避しやすくなる。",
        effect: "discovery_reduction",
        value: 5, // 5%減少
        rarity: "common"
    },
    {
        id: "silver_amulet", 
        name: "銀のアミュレット",
        description: "美しく光る銀のアミュレット。強力な守護の力を感じる。",
        effect: "discovery_reduction",
        value: 10, // 10%減少
        rarity: "rare"
    },
    {
        id: "ancient_seal",
        name: "古代の封印石",
        description: "謎の文字が刻まれた石。触ると不思議な安らぎを感じる。",
        effect: "discovery_reduction", 
        value: 8, // 8%減少
        rarity: "uncommon"
    },
    {
        id: "blessed_candle",
        name: "祝福された蝋燭",
        description: "聖なる力を宿した蝋燭。暗闇の中でも希望の光を与えてくれる。",
        effect: "discovery_reduction",
        value: 7, // 7%減少
        rarity: "uncommon"
    },
    {
        id: "mystic_crystal",
        name: "神秘の水晶",
        description: "虹色に輝く美しい水晶。非常に強力な守護の力を持つ。",
        effect: "discovery_reduction",
        value: 15, // 15%減少
        rarity: "legendary"
    },
    // 新しい回復アイテムを追加
    {
        id: "healing_potion",
        name: "回復の秘薬",
        description: "エドワードが調合した特別な薬。見つかる確率を大幅に減少させる。",
        effect: "discovery_reduction",
        value: 12, // 12%減少
        rarity: "rare"
    },
    {
        id: "stealth_cloak",
        name: "隠密のマント",
        description: "薄い布だが、着用者の存在を隠す不思議な力がある。",
        effect: "discovery_reduction",
        value: 20, // 20%減少
        rarity: "legendary"
    },
    {
        id: "shadow_ring",
        name: "影の指輪",
        description: "黒い石がはめ込まれた指輪。影に溶け込む力を与える。",
        effect: "discovery_reduction",
        value: 6, // 6%減少
        rarity: "common"
    }
];

// 空の場所のメッセージ
const emptyLocationMessages = [
    "ここには何もなかった...",
    "空っぽの引き出しだった。",
    "埃だけが舞っている。",
    "期待したが、何も見つからない。",
    "古い蜘蛛の巣があるだけだ。",
    "がっかりするような空間だった。",
    "誰かが先に持ち去ったようだ。",
    "時の流れが全てを奪い去ったようだ。",
    "静寂だけがそこにあった。",
    "何かの痕跡はあるが、もう何もない。"
];

let gameState = {
    currentRoom: 0,
    inventory: [],
    selectedObject: null,
    selectedItem: null,
    discoveryChance: 0,
    solvedPuzzles: [],
    acquiredItems: [], // 取得済みアイテムIDを永続的に追跡
    visitedRooms: [], // 訪問済み部屋を追跡
    collectedPapers: [], // 集めた紙片情報 [{number: 1, character: "永"}, ...]
    currentRitualPattern: 0, // 現在のゲームで使用される儀式パターン
    rareItemLocations: {}, // ランダム配置されたレアアイテムの位置 {objectId: rareItemId}
    checkedEmptyLocations: [], // 調べて空だった場所のリスト
    gameFlags: {
        mirrorActivated: false,
        passageFound: false,
        undergroundAccess: false,
        skeletonExamined: false,
        symbolsDecoded: false,
        altarActivated: false,
        formulaDecoded: false,
        canEscape: false,
        ritualCompleted: false,
        laboratoryAccess: false,
        greenhouseAccess: false,
        bedroomAccess: false,
        familyPuzzleSolved: false,
        herbPuzzleSolved: false,
        libraryAccess: false,
        mapFound: false,
        alternatePassageFound: false,
        lifeSecretRevealed: false,
        // 鍵による扉開錠フラグ
        libraryDoorUnlocked: false,
        laboratoryDoorUnlocked: false,
        cellarAccess: false
    }
};

// オーディオ管理
let audioContext = null;
let isAudioPlaying = false;
let isAllMuted = false;

// ゲーム状態管理
let isGameDisabled = false;

// 見つかる確率表示更新関数（修正版）
function updateDiscoveryChance() {
    const discoveryElement = document.getElementById('discovery-chance');
    const puzzleDiscoveryElement = document.getElementById('puzzle-discovery-chance');
    
    if (discoveryElement) {
        discoveryElement.textContent = `👁️ 見つかる: ${gameState.discoveryChance}%`;
        // 段階的な色とアニメーション変化
        applyDiscoveryChanceStyle(discoveryElement, gameState.discoveryChance);
    }
    
    if (puzzleDiscoveryElement) {
        puzzleDiscoveryElement.textContent = `👁️ 見つかる: ${gameState.discoveryChance}%`;
        // パズル画面でも同じスタイルを適用
        applyDiscoveryChanceStyle(puzzleDiscoveryElement, gameState.discoveryChance);
    }
}

// 見つかる%に応じてスタイルを適用する関数
function applyDiscoveryChanceStyle(element, chance) {
    // 既存のクラスを削除
    element.classList.remove('danger-safe', 'danger-low', 'danger-medium', 
                           'danger-high', 'danger-critical', 'danger-extreme');
    
    // パーセンテージに応じて段階的にスタイルを適用
    if (chance <= 20) {
        element.classList.add('danger-safe');
    } else if (chance <= 35) {
        element.classList.add('danger-low');
    } else if (chance <= 50) {
        element.classList.add('danger-medium');
    } else if (chance <= 65) {
        element.classList.add('danger-high');
    } else if (chance <= 80) {
        element.classList.add('danger-critical');
    } else {
        element.classList.add('danger-extreme');
    }
}

// パズル画面用見つかる確率表示更新関数
function updatePuzzleDiscoveryChance() {
    const puzzleDiscoveryText = document.getElementById('puzzle-discovery-text');
    if (!puzzleDiscoveryText) return;
    
    // 現在の確率を正確に計算
    let currentChance = Math.max(0, gameState.discoveryChance);
    puzzleDiscoveryText.textContent = `👁️ 見つかる: ${currentChance}%`;
    
    // 危険度に応じてクラスを変更（ゲーム画面と同じ基準）
    puzzleDiscoveryText.className = '';
    if (currentChance >= 80) {
        puzzleDiscoveryText.classList.add('danger-high');
    } else if (currentChance >= 60) {
        puzzleDiscoveryText.classList.add('danger-medium');
    } else if (currentChance >= 40) {
        puzzleDiscoveryText.classList.add('danger-low');
    } else {
        puzzleDiscoveryText.classList.add('danger-safe');
    }
}

// 問題のある状況を判定する関数
function hasProblematicConditions() {
    // 以下のような問題がある場合にtrue
    return (
        // 移動できない部屋が多い
        getBlockedRoomsCount() > 3 ||
        // 必要なアイテムが不足している
        isMissingCriticalItems() ||
        // 見つかる確率が急激に上昇した
        gameState.discoveryChance >= 35 ||
        // パズルを間違えた直後
        hasRecentMistakes()
    );
}

// ブロックされた部屋の数を取得
function getBlockedRoomsCount() {
    let blockedCount = 0;
    for (let i = 0; i < rooms.length; i++) {
        if (!canMoveToRoom(i) && i !== gameState.currentRoom) {
            blockedCount++;
        }
    }
    return blockedCount;
}

// 重要なアイテムが不足しているかチェック
function isMissingCriticalItems() {
    const criticalItems = ['library_key', 'candlestick'];
    const hasAnyItem = criticalItems.some(itemId => 
        gameState.inventory.some(item => item.id === itemId)
    );
    return !hasAnyItem && gameState.discoveryChance >= 25;
}

// 最近ミスがあったかチェック
function hasRecentMistakes() {
    return gameState.discoveryChance >= 30 && gameState.discoveryChance < 40;
}

// ミス時の見つかる確率増加とゲームオーバー判定（運要素あり）
function handleMistake() {
    // 見つかる確率を5%〜10%の間でランダムに増加
    const randomIncrease = Math.floor(Math.random() * 6) + 5; // 5〜10の範囲
    gameState.discoveryChance = Math.min(100, gameState.discoveryChance + randomIncrease);
    updateDiscoveryChance();
    
    // パーセンテージの確率で見つかるかどうかを決める
    let isGameOver = false;
    let randomChance = Math.floor(Math.random() * 100) + 1;
    isGameOver = randomChance <= gameState.discoveryChance;
    
    if (isGameOver) {
        // 見つかった！ゲームオーバー
        closePuzzle(); // パズル画面を強制的に閉じる
        showJumpscareOverlay(6000); // 6秒間ジャンプスケア表示
        isGameDisabled = true; // ゲームを無効化
        disableGameUI(); // UI要素を無効化
        playScaryGameOverSound();
        setTimeout(() => {
            endGame(false);
            isJumpscareActive = false;
        }, 6000);
        return true; // ゲームオーバーになった
    } else {
        // 運良く見つからなかった
        queueMessage(`危なかった...まだ見つかっていない（見つかる確率: ${gameState.discoveryChance}%, 判定: ${randomChance}%）`);
        queueMessage(`見つかる確率が${randomIncrease}%上昇し、${gameState.discoveryChance}%になった！`);
        
        // 段階的な警告メッセージ
        if (gameState.discoveryChance >= 90) {
            queueMessage(`非常に危険！次のミスで確実に発見される！`);
        } else if (gameState.discoveryChance >= 70) {
            queueMessage(`かなり危険な状況になってきた...`);
        } else if (gameState.discoveryChance >= 50) {
            queueMessage(`少し注意が必要だ...`);
        } else if (gameState.discoveryChance >= 30) {
            queueMessage(`気を付けよう...`);
        }
        
        return false; // まだ生きている
    }
}

// UI無効化機能
function disableGameUI() {
    // やり直すボタンとリスタートボタン以外のボタンを無効化
    const buttons = document.querySelectorAll('button, .control-btn, .room-nav-btn, .inventory-item, .close-btn');
    buttons.forEach(button => {
        // やり直すボタンとリスタートボタンは無効化しない
        if (button.id === 'retry-btn' || button.id === 'restart-btn') {
            return;
        }
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';
    });
    
    // インタラクティブオブジェクトを無効化
    const objects = document.querySelectorAll('.interactive-object');
    objects.forEach(obj => {
        obj.style.pointerEvents = 'none';
        obj.style.opacity = '0.5';
    });
    
    // パズル入力を無効化
    const puzzleInput = document.getElementById('puzzle-answer');
    if (puzzleInput) {
        puzzleInput.disabled = true;
    }
    
    const submitBtn = document.getElementById('submit-answer');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
    }
    
    // パズル閉じるボタンも無効化
    const closePuzzleBtn = document.getElementById('close-puzzle');
    if (closePuzzleBtn) {
        closePuzzleBtn.disabled = true;
        closePuzzleBtn.style.opacity = '0.5';
    }
    
    // ストーリー通知の閉じるボタンも無効化
    const storyCloseBtn = document.querySelector('.story-close-btn');
    if (storyCloseBtn) {
        storyCloseBtn.style.pointerEvents = 'none';
        storyCloseBtn.style.opacity = '0.5';
    }
}

// UI有効化機能
function enableGameUI() {
    // 全てのボタンを有効化
    const buttons = document.querySelectorAll('button, .control-btn, .room-nav-btn, .inventory-item, .close-btn');
    buttons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
        button.disabled = false;
    });
    
    // インタラクティブオブジェクトを有効化
    const objects = document.querySelectorAll('.interactive-object');
    objects.forEach(obj => {
        obj.style.pointerEvents = 'auto';
        obj.style.opacity = '1';
    });
    
    // パズル入力を有効化
    const puzzleInput = document.getElementById('puzzle-answer');
    if (puzzleInput) {
        puzzleInput.disabled = false;
    }
    
    const submitBtn = document.getElementById('submit-answer');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    // パズル閉じるボタンも有効化
    const closePuzzleBtn = document.getElementById('close-puzzle');
    if (closePuzzleBtn) {
        closePuzzleBtn.disabled = false;
        closePuzzleBtn.style.opacity = '1';
    }
    
    // ストーリー通知の閉じるボタンも有効化
    const storyCloseBtn = document.querySelector('.story-close-btn');
    if (storyCloseBtn) {
        storyCloseBtn.style.pointerEvents = 'auto';
        storyCloseBtn.style.opacity = '1';
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        // スマホの向きを横向きに固定
        lockOrientationToLandscape();
        initializeGame();
    } catch (error) {
        console.error('Error during initialization:', error);
        // エラーが発生した場合は通常の初期化のみ実行
        initializeGame();
    }
});

// スマホの向きを横向きに固定する関数
function lockOrientationToLandscape() {
    try {
        // 画面の向きを横向きに固定
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                console.log('Orientation lock not supported');
            });
        }
        
        // iOS Safari用の向き固定
        if (window.orientation !== undefined) {
            // 縦向きの場合は画面を回転
            if (window.orientation === 0 || window.orientation === 180) {
                applyLandscapeTransform();
            }
        }
        
        // 画面の向き変更を監視
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                try {
                    if (window.orientation === 0 || window.orientation === 180) {
                        // 縦向きになった場合は横向きに強制回転
                        applyLandscapeTransform();
                    } else {
                        // 横向きの場合は通常表示
                        removeLandscapeTransform();
                    }
                } catch (error) {
                    console.error('Error in orientation change handler:', error);
                }
            }, 100);
        });
        
        // リサイズ時の処理
        window.addEventListener('resize', () => {
            try {
                if (window.innerWidth < 768) {
                    // スマホサイズの場合、横向き固定を適用
                    if (window.orientation === 0 || window.orientation === 180) {
                        applyLandscapeTransform();
                    }
                }
                
                // 動的レイアウト調整
                adjustLayoutForScreenSize();
            } catch (error) {
                console.error('Error in resize handler:', error);
            }
        });
        
        // 初期レイアウト調整
        adjustLayoutForScreenSize();
    } catch (error) {
        console.error('Error in lockOrientationToLandscape:', error);
    }
}

// 横向き変換を適用する関数
function applyLandscapeTransform() {
    try {
        // 背景色を確実に設定
        document.body.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a, #0f0f0f)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.color = '#cccccc';
        
        // 横向き変換を適用
        document.body.style.transform = 'rotate(90deg)';
        document.body.style.transformOrigin = 'left top';
        document.body.style.width = '100vh';
        document.body.style.height = '100vw';
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
        document.body.style.position = 'absolute';
        document.body.style.top = '100%';
        document.body.style.left = '0';
        document.body.style.zIndex = '1';
        
        // ゲームコンテナも調整
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.width = '100vh';
            gameContainer.style.height = '100vw';
            gameContainer.style.background = 'transparent';
            gameContainer.style.position = 'relative';
            gameContainer.style.zIndex = '2';
        }
    } catch (error) {
        console.error('Error applying landscape transform:', error);
    }
}

// 横向き変換を解除する関数
function removeLandscapeTransform() {
    try {
        // 背景色を元に戻す
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        document.body.style.color = '';
        
        // 横向き変換を解除
        document.body.style.transform = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflowX = '';
        document.body.style.overflowY = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.zIndex = '';
        
        // ゲームコンテナも元に戻す
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.width = '';
            gameContainer.style.height = '';
            gameContainer.style.background = '';
            gameContainer.style.position = '';
            gameContainer.style.zIndex = '';
        }
    } catch (error) {
        console.error('Error removing landscape transform:', error);
    }
}

// 画面サイズに応じてレイアウトを動的調整する関数
function adjustLayoutForScreenSize() {
    try {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // スマホサイズの場合
        if (screenWidth < 768) {
            // ゲームコンテナのサイズ調整
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.style.width = '100vh';
                gameContainer.style.height = '100vw';
            }
            
            // UIパネルの高さ調整
            const uiPanel = document.getElementById('ui-panel');
            if (uiPanel) {
                const panelHeight = Math.min(screenHeight * 0.4, 200);
                uiPanel.style.maxHeight = `${panelHeight}px`;
            }
            
            // インベントリの高さ調整
            const inventoryItems = document.getElementById('inventory-items');
            if (inventoryItems) {
                const inventoryHeight = Math.min(screenHeight * 0.15, 80);
                inventoryItems.style.maxHeight = `${inventoryHeight}px`;
            }
            
            // メッセージエリアの高さ調整
            const messageArea = document.getElementById('message-area');
            if (messageArea) {
                const messageHeight = Math.min(screenHeight * 0.2, 120);
                messageArea.style.maxHeight = `${messageHeight}px`;
            }
            
            // 部屋移動ボタンの高さ調整
            const roomNavButtons = document.getElementById('room-nav-buttons');
            if (roomNavButtons) {
                const navHeight = Math.min(screenHeight * 0.1, 60);
                roomNavButtons.style.maxHeight = `${navHeight}px`;
            }
            
            // パズル画面の位置調整
            const puzzleDiscoveryChance = document.getElementById('puzzle-discovery-chance');
            if (puzzleDiscoveryChance) {
                const topPosition = Math.max(screenHeight * 0.1, 40);
                puzzleDiscoveryChance.style.top = `${topPosition}px`;
            }
            
            // ストーリー通知の位置調整
            const storyNotification = document.getElementById('story-notification');
            if (storyNotification) {
                const bottomPosition = Math.max(screenHeight * 0.02, 5);
                storyNotification.style.bottom = `${bottomPosition}px`;
            }
        }
    } catch (error) {
        console.error('Error adjusting layout:', error);
    }
}

function initializeGame() {
    // DOM要素を取得（存在するもののみ）
    const startBtn = document.getElementById('start-btn');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const closePuzzleBtn = document.getElementById('close-puzzle');
    const restartBtn = document.getElementById('restart-btn');
    const retryBtn = document.getElementById('retry-btn');

    // イベントリスナーを設定（遅延なしで即座に実行）
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            playButtonClickSound();
            startGame(); // 遅延なしで即座に実行
        });
    }
    
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', () => {
            playButtonClickSound();
            submitPuzzleAnswer(); // 遅延なしで即座に実行
        });
    }
    
    if (closePuzzleBtn) {
        closePuzzleBtn.addEventListener('click', () => {
            playButtonClickSound();
            closePuzzle(); // 遅延なしで即座に実行
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playButtonClickSound();
            restartGame(); // 遅延なしで即座に実行
        });
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            playButtonClickSound();
            restartGame(); // 遅延なしで即座に実行
        });
    }

    // 初期UI表示
    updateInventoryDisplay();
    
    // ウィンドウリサイズ時の位置調整イベントリスナーを追加
    window.addEventListener('resize', () => {
        if (document.getElementById('puzzle-screen').classList.contains('active')) {
            adjustDiscoveryChancePosition();
        }
        // 動的レイアウト調整
        adjustLayoutForScreenSize();
    });
}

// 音響重複防止のための変数
let currentlyPlayingSounds = [];

// オーディオ初期化と再生
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // ミュートボタンのイベントリスナー設定
        setupAudioControls();
    } catch (error) {
        console.log('Audio not supported');
    }
}

// 効果音の重複を防ぐための停止関数
function stopAllSounds() {
    currentlyPlayingSounds.forEach(sound => {
        try {
            sound.stop();
        } catch (e) {
            // 既に停止済みの場合はエラーを無視
        }
    });
    currentlyPlayingSounds = [];
}

// サウンドオブジェクトを登録する関数
function registerSound(oscillator, duration) {
    currentlyPlayingSounds.push(oscillator);
    setTimeout(() => {
        const index = currentlyPlayingSounds.indexOf(oscillator);
        if (index > -1) {
            currentlyPlayingSounds.splice(index, 1);
        }
    }, duration * 1000);
}











// オーディオコントロールの設定
function setupAudioControls() {
    const muteAllBtn = document.getElementById('mute-all-btn');
    
    if (muteAllBtn) {
        muteAllBtn.addEventListener('click', toggleAllMute);
    }
}

// 全音声ミュート切り替え
function toggleAllMute() {
    isAllMuted = !isAllMuted;
    const btn = document.getElementById('mute-all-btn');
    
    if (isAllMuted) {
        btn.textContent = '🔇';
        btn.classList.add('muted');
        btn.title = '全音声ミュート解除';
    } else {
        btn.textContent = '🔊';
        btn.classList.remove('muted');
        btn.title = '全音声ミュート';
    }
}



function playRandomEffect() {
    if (!isAudioPlaying || isAllMuted) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(100 + Math.random() * 200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log("Audio effect failed:", error);
    }
}

function playJumpScare() {
    if (!audioContext || isAllMuted) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// 怖いゲームオーバー専用効果音
function playScaryGameOverSound() {
    if (!audioContext || isAllMuted) return;
    stopAllSounds();
    try {
        // 不気味な低音ドローン
        const bass = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bass.connect(bassGain);
        bassGain.connect(audioContext.destination);
        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(60, audioContext.currentTime);
        bass.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 3.0);
        bassGain.gain.setValueAtTime(0, audioContext.currentTime);
        bassGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.5);
        bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 6.0);
        bass.start();
        bass.stop(audioContext.currentTime + 6.0);
        registerSound(bass, 6.0);

        // 歪んだ高音ノイズ
        setTimeout(() => {
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.2, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseBuffer.length; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.18, audioContext.currentTime);
            whiteNoise.connect(noiseGain).connect(audioContext.destination);
            whiteNoise.start();
            whiteNoise.stop(audioContext.currentTime + 1.2);
            registerSound(whiteNoise, 1.2);
        }, 300);

        // 断続的な金属音
        setTimeout(() => {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(400 + Math.random() * 200, audioContext.currentTime);
                    gain.gain.setValueAtTime(0.18, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
                    osc.connect(gain).connect(audioContext.destination);
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.18);
                    registerSound(osc, 0.18);
                }, i * 200);
            }
        }, 1200);

        // 重厚な中音域の不協和音
        setTimeout(() => {
            const dissonant = audioContext.createOscillator();
            const dissonantGain = audioContext.createGain();
            dissonant.connect(dissonantGain);
            dissonantGain.connect(audioContext.destination);
            dissonant.type = 'square';
            dissonant.frequency.setValueAtTime(150, audioContext.currentTime);
            dissonant.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 2.0);
            dissonantGain.gain.setValueAtTime(0, audioContext.currentTime);
            dissonantGain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.3);
            dissonantGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3.0);
            dissonant.start();
            dissonant.stop(audioContext.currentTime + 3.0);
            registerSound(dissonant, 3.0);
        }, 1500);
    } catch (error) {
        console.log("Scary game over sound failed:", error);
    }
}

// 不気味な成功音
function playSuccessSound() {
    if (!audioContext || isAllMuted) return;
    
    try {
        // 不気味な鐘の音（短調）
        const darkNotes = [261.63, 311.13, 392.00]; // C4, D#4, G4 (短調和音)
        
        darkNotes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            // より暗い響きのために音量調整
            const volume = 0.12 - (index * 0.02);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1.5);
            registerSound(oscillator, 1.5);
        });
        
        // エコー効果
        setTimeout(() => {
            const echoOsc = audioContext.createOscillator();
            const echoGain = audioContext.createGain();
            
            echoOsc.connect(echoGain);
            echoGain.connect(audioContext.destination);
            
            echoOsc.type = 'triangle';
            echoOsc.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
            
            echoGain.gain.setValueAtTime(0, audioContext.currentTime);
            echoGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05);
            echoGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
            
            echoOsc.start();
            echoOsc.stop(audioContext.currentTime + 1.0);
            registerSound(echoOsc, 1.0);
        }, 300);
        
    } catch (error) {
        console.log("Success sound failed:", error);
    }
}

// 開始ボタンの効果音
function playStartSound() {
    if (!audioContext || isAllMuted) return;
    
    try {
        // メイン音（遅延なし）
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.8);
        
    } catch (error) {
        console.log("Start sound failed:", error);
    }
}

// 不気味なボタンクリック音
function playButtonClickSound() {
    if (isAllMuted) return;
    
    if (!audioContext) {
        // audioContextがない場合は即座に初期化を試行
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio context initialization failed:', error);
            return;
        }
    }
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.2); // A3
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.25);
        registerSound(oscillator, 0.25);
    } catch (error) {
        console.log("Button click sound failed:", error);
    }
}

function playFailureSound() {
    if (!audioContext || isAllMuted) return;
    
    try {
        // 不気味な失敗音
        const lowOsc = audioContext.createOscillator();
        const lowGain = audioContext.createGain();
        
        lowOsc.connect(lowGain);
        lowGain.connect(audioContext.destination);
        
        lowOsc.type = 'sawtooth';
        lowOsc.frequency.setValueAtTime(110, audioContext.currentTime); // A2
        lowOsc.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.8); // A1
        
        lowGain.gain.setValueAtTime(0, audioContext.currentTime);
        lowGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
        lowGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
        
        lowOsc.start();
        lowOsc.stop(audioContext.currentTime + 1.0);
        registerSound(lowOsc, 1.0);
        
        // 不協和音の追加
        setTimeout(() => {
            const dissonantOsc = audioContext.createOscillator();
            const dissonantGain = audioContext.createGain();
            
            dissonantOsc.connect(dissonantGain);
            dissonantGain.connect(audioContext.destination);
            
            dissonantOsc.type = 'square';
            dissonantOsc.frequency.setValueAtTime(123.47, audioContext.currentTime); // B2 (不協和音)
            
            dissonantGain.gain.setValueAtTime(0, audioContext.currentTime);
            dissonantGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
            dissonantGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            dissonantOsc.start();
            dissonantOsc.stop(audioContext.currentTime + 0.5);
            registerSound(dissonantOsc, 0.5);
        }, 200);
        
    } catch (error) {
        console.log("Failure sound failed:", error);
    }
}

function playItemUseSound() {
    if (!audioContext || isAllMuted) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        registerSound(oscillator, 0.3);
    } catch (error) {
        console.log("Item use sound failed:", error);
    }
}

// 部屋データ
const rooms = [
    {
        id: 0,
        name: "玄関ホール",
        description: "薄暗い玄関ホール。月明かりが差し込む中、壁には古い肖像画が掛かっている。この館の元主人と思われる男性の絵だが、その目は生きているかのように見る者を追いかける。",
        backstory: "この館は100年前、錬金術師エドワード・グレイが住んでいた場所だった。彼は永遠の命を求めて危険な実験を繰り返していたが、ある日突然姿を消した。",
        objects: [
            { id: "painting", name: "エドワードの肖像画", x: 30, y: 40, description: "錬金術師エドワード・グレイの肖像画。彼の鋭い目が見る者を見つめ、額縁の装飾には月・星・太陽の記号が刻まれている。何かが隠されているようだ。" },
            { id: "candlestick", name: "古い燭台", x: 15, y: 25, description: "重厚な真鍮製の燭台。底に小さな鍵穴のような穴が開いている。", item: true },
            { id: "mirror", name: "古い鏡", x: 80, y: 30, description: "銀で縁取られた古い鏡。よく見ると表面に薄く文字が浮かんでいる。" },
            { id: "door_library", name: "私室への扉", x: 90, y: 70, description: "重厚な木の扉。真鍮の鍵穴がある。施錠されているようだ。" },
            { id: "hall_drawer", name: "小さな引き出し", x: 60, y: 80, description: "壁に取り付けられた小さな木製の引き出し。錆びた取っ手がついている。", paper: {number: 1, character: "永"} }
        ]
    },
    {
        id: 1,
        name: "エドワードの私室（図書室）",
        description: "エドワードの私室兼図書室。壁一面に錬金術の古書が並び、机の上には実験道具が散らばっている。空気は古い羊皮紙と薬草の匂いで満ちている。",
        backstory: "エドワードがここで数々の実験を行っていた。彼の日記によると、「真実の扉」を開く鍵を探していたようだ。",
        accessible: false,
        objects: [
            { id: "bookshelf", name: "錬金術書の本棚", x: 20, y: 50, description: "古代の錬金術に関する貴重な書物が並んでいる。『賢者の石について』『生命の水』『永遠への扉』などのタイトルが見える。" },
            { id: "diary", name: "エドワードの実験日記", x: 60, y: 30, description: "エドワードが残した実験日記。最後のページには暗号のような文字が書かれ、「真実への扉を開く鍵」について記されている。", item: true },
            { id: "crystal", name: "魔力の水晶", x: 40, y: 60, description: "青白く光る美しい水晶。錬金術の実験に使われていたもののようだ。触ると暖かい。", item: true },
            { id: "experiment_notes", name: "研究ノート", x: 85, y: 40, description: "エドワードの重要な研究ノート。錬金術の哲学について深く考察されている。選択を迫る内容が書かれている。" },
            { id: "secret_passage", name: "隠し通路", x: 10, y: 80, description: "本棚の陰に隠された小さな通路。狭いが人一人通れそうだ。" },
            { id: "desk", name: "エドワードの机", x: 70, y: 70, description: "古い木製の机。引き出しには小さな鍵穴がある。" },
            { id: "library_box", name: "古い宝石箱", x: 25, y: 20, description: "机の隅に置かれた小さな宝石箱。中に何か入っているようだ。", paper: {number: 2, character: "遠"} }
        ]
    },
    {
        id: 2,
        name: "秘密の書斎",
        description: "隠し通路の先にある小さな書斎。ここにはエドワードの最も重要な研究資料が保管されている。壁には複雑な図形と数式が描かれている。",
        backstory: "エドワードが最終実験の準備を行った場所。ここで彼は「生命の謎」を解き明かそうとしていた。",
        accessible: false,
        objects: [
            { id: "formula", name: "生命の公式", x: 50, y: 40, description: "壁に描かれた複雑な錬金術の公式。生命を操る秘密が記されているようだ。" },
            { id: "small_key", name: "小さな真鍮の鍵", x: 30, y: 70, description: "小さくて精巧な真鍮の鍵。机の引き出し用のようだ。", item: true },
            { id: "tome", name: "禁断の書", x: 80, y: 50, description: "黒い革装丁の分厚い本。『死者蘇生の術』と題されている。開くのを躊躇してしまう。", item: true }
        ]
    },
    {
        id: 3,
        name: "地下通路",
        description: "館の地下に延びる石造りの通路。湿気が高く、壁には緑色の苔が生えている。奥からかすかに青い光が漏れている。",
        backstory: "エドワードが実験室への秘密のルートとして作った通路。多くの実験材料がここを通って運ばれた。",
        accessible: false,
        objects: [
            { id: "skeleton", name: "古い骸骨", x: 70, y: 60, description: "通路の角に倒れている古い骸骨。手に何かを握りしめている。" },
            { id: "golden_key", name: "黄金の鍵", x: 70, y: 60, description: "骸骨が握っていた美しい黄金の鍵。実験室への鍵のようだ。", item: true, hidden: true },
            { id: "door", name: "地下実験室への扉", x: 10, y: 40, description: "重厚な石の扉。黄金の鍵穴がある。地下実験室への入り口のようだ。" }
        ]
    },
    {
        id: 4,
        name: "古い温室",
        description: "館の裏にある朽ち果てた温室。かつては錬金術の実験に使う薬草が栽培されていた。今は枯れた植物と割れたガラスが散乱している。",
        backstory: "エドワードが薬草栽培と植物実験を行っていた場所。ここで生命力の源を研究していた。",
        accessible: false,
        objects: [
            { id: "broken_pot", name: "割れた植木鉢", x: 70, y: 30, description: "古い陶製の植木鉢。底に小さな隠し扉がある。" },
            { id: "vines", name: "異様な蔓", x: 50, y: 80, description: "温室を覆う不気味な蔓。触ると微かに脈打っている感覚がある。" },
            { id: "herb_pot", name: "古い薬草鉢", x: 30, y: 50, description: "エドワードが薬草栽培に使っていた古い鉢。表面に調合レシピが刻まれている。" }
        ]
    },
    {
        id: 5,
        name: "地下実験室",
        description: "館の地下深くにある秘密の実験室。石の壁には古代の記号が刻まれ、中央には大きな錬金術の魔法陣が描かれている。空気は重く、何か不吉な力を感じる。",
        backstory: "エドワードの最後の実験が行われた場所。彼はここで「永遠の命」を手に入れようとしたが、実験は失敗し、彼の魂は館に囚われてしまった。",
        accessible: false,
        objects: [
            { id: "symbols", name: "古代の封印記号", x: 50, y: 40, description: "壁に刻まれた古代の封印記号。丸（魂）、三角（精神）、四角（肉体）を表している。エドワードの最後の実験に関連する重要な手がかりのようだ。" },
            { id: "altar", name: "錬金術の祭壇", x: 50, y: 60, description: "中央にある石の祭壇。3つの窪みがあり、何かを置くためのもののようだ。" },
            { id: "ancient_door", name: "古代の印章扉", x: 15, y: 70, description: "実験室の奥にある古い扉。四つの印章が埋め込まれており、正しい順番で押す必要がある。生命の循環を表しているようだ。" },
            { id: "exit", name: "封印された出口", x: 80, y: 60, description: "重厚な石の扉。古代の記号によって封印されている。エドワードの魂を解放することで、この封印を解くことができるかもしれない。" },
            { id: "lab_cabinet", name: "実験器具の棚", x: 20, y: 30, description: "様々な実験器具が並ぶ棚。奥に小さな隠し扉がある。", paper: {number: 3, character: "に"} }
        ]
    },
    {
        id: 6,
        name: "エドワードの寝室",
        description: "館の2階にあるエドワードの私的な寝室。埃をかぶったベッドと古いドレッサーがある。壁には彼の家族の肖像画が飾られている。",
        backstory: "エドワードが最後の夜を過ごした部屋。ここで彼は最終実験への決意を固めた。",
        accessible: false,
        objects: [
            { id: "family_portrait", name: "家族の肖像画", x: 30, y: 40, description: "エドワードと妻、娘の肖像画。娘の目から一筋の涙が流れているように見える。" },
            { id: "old_bed", name: "古いベッド", x: 70, y: 70, description: "エドワードが最後に眠ったベッド。枕の下に何かが隠されているようだ。" },
            { id: "letter", name: "妻への手紙", x: 70, y: 70, description: "エドワードが妻に宛てて書いた最後の手紙。実験への後悔と愛が綴られている。", item: true, hidden: true },
            { id: "dresser", name: "古いドレッサー", x: 20, y: 60, description: "鏡台。引き出しには小さな宝石箱がある。" }
        ]
    },
    {
        id: 7,
        name: "大図書館",
        description: "館の北翼にある巨大な図書館。天井まで届く書棚には古代から現代までの書物が所狭しと並んでいる。",
        objects: [
            { id: "ancient_tome", name: "古代の書物", x: 30, y: 40, description: "「星座と運命の書」と題された古い本。占星術について書かれ、特定のページに印がついている。" },
            { id: "library_ladder", name: "図書館の梯子", x: 15, y: 30, description: "高い書棚にある本を取るための古い木製の梯子。上の棚に興味深い本が見える。" },
            { id: "reading_desk", name: "読書机", x: 60, y: 60, description: "大きな読書机。開かれた本と古い地図、そして数学のパズルが置かれている。" },
            { id: "blackboard", name: "数学の黒板", x: 75, y: 35, description: "読書机の近くにある黒板。複雑な数学の問題が書かれている。エドワードの年齢に関する謎かけのようだ。" },
            { id: "secret_bookshelf", name: "謎の本棚", x: 80, y: 50, description: "他とは異なる装飾の施された本棚。3つの本が少し出ている。引っ張る順番に意味がありそうだ。" },
            { id: "ancient_safe", name: "古い金庫", x: 45, y: 25, description: "17世紀の金庫。4桁の数字コンビネーションが必要。表面に天体の模様が刻まれている。", paper: {number: 4, character: "愛"} }
        ],
        onEnter: () => {
            if (!gameState.gameFlags.libraryUnlocked) {
                gameState.gameFlags.libraryUnlocked = true;
                queueMessage("大図書館への扉が開かれた。知識の宝庫に足を踏み入れる。");
            }
        }
    },
    {
        id: 8,
        name: "地下貯蔵庫",
        description: "館の地下深くにある古い貯蔵庫。ワインや食料が保管されていたが、今は埃と蜘蛛の巣に覆われている。",
        objects: [
            { id: "storage_box", name: "古い木箱", x: 70, y: 40, description: "食料保存用の木箱。中に何か硬いものが入っている。" },
            { id: "cellar_wall", name: "地下室の壁", x: 50, y: 80, description: "石造りの壁。暗号文字が刻まれている。『HFBFODF NBUUFS』と読める。" },
            { id: "wine_cipher", name: "ワイン樽の暗号", x: 85, y: 20, description: "古い樽に刻まれた文字。『EDARG DRAWDE』と書かれている。", paper: {number: 5, character: "が"} }
        ],
        onEnter: () => {
            queueMessage("地下貯蔵庫に降りてきた。ひんやりとした空気が肌を刺す。");
        }
    }
];

// パズルデータ
const puzzles = [
    {
        id: "painting_puzzle",
        title: "エドワードの肖像画に隠された秘密",
        content: "エドワードの肖像画の額縁に刻まれた文字が光っている：\n\n『永遠への鍵は天体の数にあり』\n\n額縁の装飾をよく見ると...\n月月月（3つの月）\n星星（2つの星）\n太陽（1つの太陽）\n\nエドワードが示す数字は？",
        answer: "321",
        hint: "額縁の装飾に注目！月が3つ、星が2つ、太陽が1つ。これらの数字を順番に並べて「321」と入力してみよう。",
        detailedHint: "エドワードは錬金術で天体の力を重要視していた。月（3）、星（2）、太陽（1）の順番で数字を組み合わせることが鍵だ。",
        onSolve: () => {
            gameState.gameFlags.paintingPuzzleSolved = true;
            queueMessage("肖像画が光り輝き、エドワードの声が聞こえる：『よくぞ私の暗号を解いた...』");
            queueMessage("絵画の後ろから重厚な真鍮の鍵が現れた！");
            const added = addInventoryItem("library_key", "私室の鍵");
            if (!added) {
                queueMessage("私室の鍵は既に持っている。");
            }
            // 私室へのアクセスも確保
            gameState.gameFlags.libraryAccess = true;
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("肖像画は役目を終え、普通の絵画となった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "mirror_puzzle",
        title: "鏡に浮かぶ古代文字",
        content: "古い鏡の表面に浮かぶ文字：\n\n『ECNEICS DNA CIGAM』\n\nこの文字は何を意味している？\n\nヒント：鏡は物を反転させる...",
        answer: "MAGIC AND SCIENCE",
        hint: "鏡に映った文字は反転している。『ECNEICS DNA CIGAM』を逆から読んでみよう。",
        detailedHint: "鏡の文字を逆から読むと『MAGIC AND SCIENCE』（魔法と科学）になる。エドワードの研究テーマだ。",
        onSolve: () => {
            gameState.gameFlags.mirrorPuzzleSolved = true;
            queueMessage("鏡が青白く光り、隠された通路の在り処を示している...");
            queueMessage("『地下への秘密の道が開かれた』");
            gameState.gameFlags.undergroundAccess = true;
            gameState.gameFlags.bedroomAccess = true;
            queueMessage("【部屋開放】地下通路にアクセスできるようになった！");
            queueMessage("【部屋開放】エドワードの寝室にもアクセスできるようになった！");
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("鏡は役目を終え、ただの古い鏡となった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "diary_puzzle",
        title: "エドワードの暗号日記",
        content: "日記の最後のページに書かれた暗号詩：\n\n『闇の中で光る星は、\n真実への扉を開く鍵。\n最初の文字を集めよ。』\n\n下に各単語のローマ字読みが書かれている：\n闇 → YAMI\n光 → HIKARI\n星 → HOSHI\n真実 → SHINJITSU\n扉 → TOBIRA\n鍵 → KAGI\n\n暗号の答えは？",
        answer: "YHHSTK",
        hint: "『最初の文字を集めよ』とある。各単語の最初の文字は Y-H-H-S-T-K。つまり「YHHSTK」だ！",
        detailedHint: "エドワードの詩の指示通り、各単語（YAMI, HIKARI, HOSHI, SHINJITSU, TOBIRA, KAGI）の最初の文字を順番に取ると「YHHSTK」になる。",
        onSolve: () => {
            gameState.gameFlags.diaryPuzzleSolved = true;
            queueMessage("日記のページが青白く光り、エドワードの知識があなたの心に流れ込んでくる...");
            queueMessage("『古代の封印を解く方法』についての理解を得た！");
            const added = addInventoryItem("knowledge", "エドワードの封印解除の知識");
            if (!added) {
                queueMessage("エドワードの知識は既に得ている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("日記は役目を終え、文字が薄れていった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "formula_puzzle",
        title: "生命の公式",
        content: "壁に描かれた複雑な公式：\n\n『Soul + Mind + Body = ?』\n\n下に記されたヒント：\n「3つの要素が1つになる時、\n生命の真理が明かされる。\n数字で表せ。」\n\n魂(1) + 精神(2) + 肉体(3) = ?",
        answer: "6",
        hint: "Soul(魂)=1, Mind(精神)=2, Body(肉体)=3 を足してみよう。1+2+3=6だ。",
        detailedHint: "エドワードの錬金術では、魂=1、精神=2、肉体=3を表す。これらを合計すると6になる。",
        onSolve: () => {
            gameState.gameFlags.formulaPuzzleSolved = true;
            queueMessage("公式が金色に光り輝く！生命の真理を理解した...");
            queueMessage("エドワードの最後の実験の秘密が明らかになった。");
            gameState.gameFlags.lifeSecretRevealed = true;
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("公式は役目を終え、壁から消えていった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "final_ritual",
        title: "最後の儀式 - 永遠の言葉",
        content: "錬金術の祭壇の前に立つと、エドワードの声が聞こえる...\n\n『私が探し求めた答えは、館の各所に隠された古い紙片に記されている。\n5つの文字を正しい順番で並べれば、永遠への扉が開かれるだろう...』\n\n祭壇に刻まれた文字：\n「生と死を超越し、時を超えて続くもの。\n それは我が願いであり、呪いでもある。\n 愛する者への想いこそが、すべての答え。」\n\n集めた紙片の文字を正しい順番で入力せよ：",
        answer: "永遠に愛が",
        hint: "館で見つけた5枚の紙片を番号順に並べてみよう。1番目、2番目、3番目、4番目、5番目の順番で文字を組み合わせると答えが見える。",
        detailedHint: "5枚の紙片を集めていれば、1番目「永」+ 2番目「遠」+ 3番目「に」+ 4番目「愛」+ 5番目「が」= 「永遠に愛が」が答えだ。",
        isPaperRitual: true,
        onSolve: () => {
            const currentPattern = ritualPatterns[gameState.currentRitualPattern];
            gameState.gameFlags.ritualCompleted = true;
            queueMessage(`『${currentPattern.answer}』という言葉が祭壇に響き渡る...`);
            
            if (currentPattern.type === "horror") {
                // ホラーパターンの場合
                queueMessage("祭壇が血のように赤く光り始める...");
                queueMessage("エドワードの魂が現れるが、その姿は歪み、苦悶に満ちている...");
                queueMessage("『そう...これが私の運命だった...永遠の苦痛が...』");
                queueMessage("『君も同じ道を歩むことになる...この呪いは続くのだ...』");
                queueMessage("エドワードの魂は闇に溶けていくが、館の呪いは完全には解けない...");
                queueMessage("それでも出口の封印は弱まった...急いで脱出しなければ！");
            } else {
                // 救済パターンの場合
                queueMessage("祭壇が温かい金色の光に包まれる...");
                queueMessage("エドワードの魂が現れ、その顔には安らぎが浮かんでいる...");
                queueMessage("『そう...光こそが答えだった...』");
                queueMessage("『君が私を救ってくれた。心から感謝する...』");
                queueMessage("エドワードの魂が安らかに昇天し、館の呪いが完全に解けた！");
                queueMessage("温かい光が館全体を包み込んでいく...");
            }
            
            queueMessage("出口の封印が解除された！");
            gameState.gameFlags.canEscape = true;
            queueMessage("【脱出可能】最終的な脱出ルートが開かれた！");
        }
    },
    {
        id: "family_puzzle",
        title: "家族の肖像画の謎",
        content: "肖像画の家族が持つ数字を解読しよう：\n\nエドワード：右手に「1」の指輪\n妻：左手に「4」のブローチ\n娘：ドレスに「7」の刺繍\n背景の月：「2」の模様\n\n隠された時刻は？\n※4桁の数字で入力",
        answer: "1472",
        hint: "家族が持つ数字を順番に並べよう。エドワード(1)+妻(4)+娘(7)+月(2)=1472",
        detailedHint: "正解は「1472」。エドワード(1)+妻(4)+娘(7)+背景の月(2)の順番で数字を組み合わせる。",
        onSolve: () => {
            gameState.gameFlags.familyPuzzleSolved = true;
            queueMessage("肖像画が光り、隠されていた文字が浮かび上がる...");
            queueMessage("『愛する者への償いは、古き温室にある』");
            gameState.gameFlags.greenhouseAccess = true;
            queueMessage("【部屋開放】古い温室にアクセスできるようになった！");
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("家族の肖像画は役目を終え、静かに微笑んでいる。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "bookshelf_puzzle",
        title: "謎の本棚の秘密",
        content: "3つの本が少し出ている本棚。それぞれの本には番号が書かれている：\n\n1番目の本：『錬金術の基礎』\n2番目の本：『生命の神秘』\n3番目の本：『永遠への扉』\n\n本の背表紙には小さな数字が刻まれている：\n1番目：3\n2番目：1\n3番目：2\n\n正しい順番で本を引く順序は？",
        answer: "213",
        hint: "背表紙の数字を見よう。2番目の本(1)→1番目の本(3)→3番目の本(2)の順番で引く。つまり「213」だ。",
        detailedHint: "各本の番号順に引くのではなく、背表紙の数字(1→3→2)に従って2番目→1番目→3番目の順番で引く。",
        onSolve: () => {
            gameState.gameFlags.bookshelfPuzzleSolved = true;
            queueMessage("本棚が回転して隠し扉が現れた！");
            queueMessage("【部屋開放】大図書館へのアクセスが可能になった！");
            gameState.gameFlags.libraryAccess = true;
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("本棚は役目を終え、通常の本棚となった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "cipher_puzzle",
        title: "ワイン樽の逆さ暗号",
        content: "古い樽に刻まれた文字：\n\n『EDARG DRAWDE』\n\nこの文字列の意味は？\n\nヒント：エドワードは鏡の謎を好んだ...",
        answer: "EDWARD GRADE",
        hint: "『EDARG DRAWDE』を逆から読んでみよう。『EDWARD GRADE』となる。",
        detailedHint: "文字列を逆から読むと『EDWARD GRADE』になる。エドワードの等級や階級を表している。",
        onSolve: () => {
            gameState.gameFlags.cipherPuzzleSolved = true;
            queueMessage("暗号が解かれ、樽の底から古い鍵が現れた！");
            const added = addInventoryItem("cellar_key", "地下貯蔵庫の鍵");
            if (!added) {
                queueMessage("地下貯蔵庫の鍵は既に持っている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("ワイン樽の暗号は役目を終え、文字が消えた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "symbol_puzzle",
        title: "地下室の暗号文字の謎",
        content: "壁に刻まれた暗号文字：\n\n『HFBFODF NBUUFS』\n\nその下に書かれた解読のヒント：\n「エドワードの研究テーマを表す言葉\n各文字を1つ前の文字に戻せ」\n\n例：B→A、C→B、D→C...\n\n暗号を解読すると？",
        answer: "SCIENCE MATTER",
        hint: "各文字を1つ前のアルファベットに戻してみよう。H→G、F→E、B→A...という具合に。",
        detailedHint: "シーザー暗号の一種。『HFBFODF NBUUFS』の各文字を1つ前にずらすと『SCIENCE MATTER』（科学物質）になる。",
        onSolve: () => {
            gameState.gameFlags.symbolPuzzleSolved = true;
            queueMessage("暗号文字が光り、壁の隠し扉が開いた！");
            queueMessage("【部屋開放】地下貯蔵庫へのアクセスが可能になった！");
            gameState.gameFlags.cellarAccess = true;
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("地下室の暗号は役目を終え、壁から消えた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    {
        id: "astronomy_puzzle",
        title: "天体の金庫パズル",
        content: "古い金庫の表面に刻まれた天体の絵と数字：\n\n月の絵 - 3個\n星の絵 - 2個\n太陽の絵 - 1個\n土星の絵 - 4個\n\n各天体の個数を順番に並べて4桁の数字を作れ。",
        answer: "3214",
        hint: "各天体の個数を順番に並べよう。月(3)→星(2)→太陽(1)→土星(4) = 3214",
        detailedHint: "金庫の天体順に数字を並べる：月(3)、星(2)、太陽(1)、土星(4) = 3214",
        onSolve: () => {
            gameState.gameFlags.astronomyPuzzleSolved = true;
            queueMessage("金庫が開いたが、中は空っぽだった...");
            queueMessage("しかし、金庫の内側に古代の知識が刻まれているのを発見した！");
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("古い金庫は役目を終え、静かに閉じられた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // 選択問題パズル
    {
        id: "choice_ritual",
        type: "choice",
        title: "錬金術師の選択",
        content: "エドワードの研究ノートを読んでいると、重要な選択を迫られる場面に遭遇した。\n\n「生命の錬金術において最も重要な要素は何か？」\n\n下記から正しい答えを選択せよ：",
        choices: [
            "黄金と富の追求",
            "魂と精神の調和",
            "権力と支配の確立",
            "知識の独占"
        ],
        correctChoice: 1, // 0ベースのインデックス
        hint: "エドワードは愛する妻を救おうとしていた。彼にとって最も大切だったのは物質的なものではない。",
        detailedHint: "エドワードの研究の真の目的は愛する人を救うことだった。「魂と精神の調和」が正解。",
        onSolve: () => {
            gameState.gameFlags.choiceRitualSolved = true;
            queueMessage("正解！エドワードの真の想いを理解した...");
            queueMessage("研究ノートの隠しページが開かれた！");
            const added = addInventoryItem("hidden_note", "隠された研究ノート");
            if (!added) {
                queueMessage("隠された研究ノートは既に持っている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("研究ノートは役目を終え、知識を与えてくれた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // パターンパズル
    {
        id: "pattern_lock",
        type: "pattern",
        title: "錬金術の印章パズル",
        content: "古い扉に埋め込まれた錬金術の印章。正しいパターンで印章を押さなければ扉は開かない。\n\n壁に刻まれたヒント：「生命の循環を表す印章を順番に押せ」\n\n印章の意味：\n🌱 = 誕生\n🌸 = 成長\n🍂 = 成熟\n💀 = 死\n\n正しい順番でクリックせよ：",
        pattern: [0, 1, 2, 3], // 生命の循環順
        symbols: ["🌱", "🌸", "🍂", "💀"],
        hint: "生命の循環：誕生→成長→成熟→死の順番で印章を押そう。",
        detailedHint: "🌱(誕生)→🌸(成長)→🍂(成熟)→💀(死)の順番でクリックする。",
        onSolve: () => {
            gameState.gameFlags.patternLockSolved = true;
            queueMessage("印章が正しい順番で押され、扉の封印が解けた！");
            queueMessage("古い扉がゆっくりと開かれていく...");
            gameState.gameFlags.secretPassageOpen = true;
            queueMessage("【部屋開放】秘密の通路が開かれた！");
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("古代の印章扉は役目を終え、静かに開いている。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // 数学パズル
    {
        id: "math_riddle",
        type: "choice",
        title: "エドワードの年齢パズル",
        content: "黒板に書かれたエドワードの年齢に関する謎：\n\n「私の年齢は3と7を掛けた数である。\n結婚した時は26歳だった。\n実験を始めてから何年経ったでしょう？」\n\n年齢のヒント：3 × 7 = ?",
        choices: [
            "21歳（まだ結婚前）",
            "26歳（結婚した年）", 
            "31歳（結婚から5年後）",
            "35歳（結婚から9年後）"
        ],
        correctChoice: 2,
        hint: "3×7=21。でも21歳では結婚前。26歳で結婚したなら...現在の年齢を考えよう。",
        detailedHint: "3×7=21だが、26歳で結婚。現在31歳なら結婚から5年後で実験期間も納得できる。",
        onSolve: () => {
            gameState.gameFlags.mathRiddleSolved = true;
            queueMessage("年齢の謎が解けた！エドワードの人生の軌跡を理解した...");
            queueMessage("黒板の裏から古い地図が現れた！");
            const added = addInventoryItem("mansion_map", "館の見取り図");
            if (!added) {
                queueMessage("館の見取り図は既に持っている。");
            } else {
                gameState.gameFlags.mapFound = true;
                queueMessage("【全部屋開放】見取り図を手に入れた！全ての部屋に移動可能になった！");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("数学の黒板は役目を終え、文字が薄れていった。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // 薬草調合パズル
    {
        id: "herb_puzzle", 
        title: "薬草調合の秘密",
        content: "温室の古い薬草鉢に刻まれた調合レシピ：\n\n「生命の薬を作るには以下の材料が必要：\n月の花（3つ）\n星の草（5つ）\n太陽の実（8つ）\n魂の根（1つ）\n\n全ての材料を合計すると、生命の数になる。\nその数は？」",
        answer: "17",
        hint: "各材料の数を全て足してみよう。月(3) + 星(5) + 太陽(8) + 魂(1) = ?",
        detailedHint: "3 + 5 + 8 + 1 = 17。これが生命の数（エドワードの錬金術における重要な数字）。",
        onSolve: () => {
            gameState.gameFlags.herbPuzzleSolved = true;
            queueMessage("薬草調合の秘密が明かされた！生命の数を理解した...");
            queueMessage("薬草鉢の底から小さな鍵が現れた！");
            const added = addInventoryItem("herb_key", "薬草の小さな鍵");
            if (!added) {
                queueMessage("薬草の小さな鍵は既に持っている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("薬草鉢は役目を終え、静かに眠りについた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // 水晶の謎パズル
    {
        id: "crystal_puzzle",
        title: "魔力の水晶の秘密",
        content: "青白く光る美しい水晶を調べると、表面に古代の文字が浮かび上がる：\n\n『光と影の調和\n月の力と太陽の力\n3つの要素を足して\n永遠の数を導け』\n\n水晶の表面に刻まれた数字：\n月の光：7\n太陽の力：9\n影の力：3\n\n永遠の数は？",
        answer: "19",
        hint: "月の光(7) + 太陽の力(9) + 影の力(3) を足してみよう。",
        detailedHint: "7 + 9 + 3 = 19。これが水晶が示す永遠の数だ。",
        onSolve: () => {
            gameState.gameFlags.crystalPuzzleSolved = true;
            queueMessage("水晶が強く光り、隠された知識が流れ込んでくる...");
            queueMessage("『古代の封印解除の術』を理解した！");
            const added = addInventoryItem("crystal_knowledge", "水晶の古代知識");
            if (!added) {
                queueMessage("水晶の古代知識は既に得ている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("水晶は役目を終え、静かに光を失った。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    },
    // 古代書物の謎パズル
    {
        id: "ancient_tome_puzzle",
        title: "星座と運命の書の謎",
        content: "「星座と運命の書」の特定のページを開くと、占星術の謎が現れる：\n\n『12の星座が輪を描く\n火の星座：3つの力\n地の星座：4つの力\n風の星座：2つの力\n水の星座：3つの力\n\n全ての力を合わせて\n運命の数字を導け』\n\n運命の数字は？",
        answer: "12",
        hint: "各星座の力を足してみよう。火(3) + 地(4) + 風(2) + 水(3) = ?",
        detailedHint: "3 + 4 + 2 + 3 = 12。12の星座が示す運命の数字だ。",
        onSolve: () => {
            gameState.gameFlags.ancientTomePuzzleSolved = true;
            queueMessage("古代書物が光り、星の知識が心に宿る...");
            queueMessage("『星座の力による封印解除』の方法を理解した！");
            const added = addInventoryItem("stellar_knowledge", "星座の星の知識");
            if (!added) {
                queueMessage("星座の星の知識は既に得ている。");
            }
            // パズル解決後、オブジェクトを非表示にする
            queueMessage("古代書物は役目を終え、静かに閉じられた。");
            updateRoomDisplay(rooms[gameState.currentRoom]);
        }
    }
];

// 不気味なゲーム開始音
function playGameStartSound() {
    if (!audioContext || isAllMuted) return;
    
    stopAllSounds(); // 既存の音を停止
    
    try {
        // 不気味な低音ドローン
        const droneOsc = audioContext.createOscillator();
        const droneGain = audioContext.createGain();
        
        droneOsc.connect(droneGain);
        droneGain.connect(audioContext.destination);
        
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(55, audioContext.currentTime); // 低いA
        droneOsc.frequency.linearRampToValueAtTime(82.4, audioContext.currentTime + 2.0); // 低いE
        
        droneGain.gain.setValueAtTime(0, audioContext.currentTime);
        droneGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.5);
        droneGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
        
        droneOsc.start();
        droneOsc.stop(audioContext.currentTime + 2.5);
        registerSound(droneOsc, 2.5);
        
        // より重厚な低音の追加
        setTimeout(() => {
            const deepOsc = audioContext.createOscillator();
            const deepGain = audioContext.createGain();
            
            deepOsc.connect(deepGain);
            deepGain.connect(audioContext.destination);
            
            deepOsc.type = 'sawtooth';
            deepOsc.frequency.setValueAtTime(35, audioContext.currentTime); // 極低音
            deepOsc.frequency.linearRampToValueAtTime(60, audioContext.currentTime + 1.5);
            
            deepGain.gain.setValueAtTime(0, audioContext.currentTime);
            deepGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
            deepGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.8);
            
            deepOsc.start();
            deepOsc.stop(audioContext.currentTime + 1.8);
            registerSound(deepOsc, 1.8);
        }, 800);
        
    } catch (error) {
        console.log("Game start sound failed:", error);
    }
}

// 不気味な勝利音（脱出成功）
function playVictorySound() {
    if (!audioContext || isAllMuted) return;
    
    try {
        // 不気味だが美しい解放の音
        const liberationNotes = [
            { freq: 174.61, time: 0.0, duration: 3.0 },   // F3 (深い共鳴)
            { freq: 220.00, time: 0.5, duration: 2.5 },   // A3
            { freq: 261.63, time: 1.0, duration: 2.0 },   // C4
            { freq: 329.63, time: 1.5, duration: 1.5 }    // E4
        ];
        
        liberationNotes.forEach((note) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.time);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + note.time);
            gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + note.time + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + note.duration);
            
            oscillator.start(audioContext.currentTime + note.time);
            oscillator.stop(audioContext.currentTime + note.time + note.duration);
            registerSound(oscillator, note.time + note.duration);
        });
        
        // 深い共鳴音（解放の静寂を表現）
        setTimeout(() => {
            const releaseOsc = audioContext.createOscillator();
            const releaseGain = audioContext.createGain();
            
            releaseOsc.connect(releaseGain);
            releaseGain.connect(audioContext.destination);
            
            releaseOsc.type = 'sine';
            releaseOsc.frequency.setValueAtTime(110, audioContext.currentTime); // 低いA
            releaseOsc.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 2.5); // さらに低く
            
            releaseGain.gain.setValueAtTime(0, audioContext.currentTime);
            releaseGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.5);
            releaseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3.0);
            
            releaseOsc.start();
            releaseOsc.stop(audioContext.currentTime + 3.0);
            registerSound(releaseOsc, 3.0);
        }, 2000);
        
    } catch (error) {
        console.log("Victory sound failed:", error);
    }
}

// ゲーム開始
async function startGame() {
    // ゲーム無効化をリセット
    isGameDisabled = false;
    
    // 音声の初期化を最初に行う
    await initAudio();
    
    // 遅延なしで即座にゲーム開始音を再生
    playGameStartSound();
    
    document.getElementById('title-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // ランダムに儀式パターンを選択
    const randomPattern = Math.floor(Math.random() * ritualPatterns.length);
    
    gameState = {
        currentRoom: 0,
        inventory: [],
        selectedObject: null,
        selectedItem: null,
        discoveryChance: 0,
        solvedPuzzles: [],
        acquiredItems: [], // 取得済みアイテムIDを永続的に追跡
        visitedRooms: [], // 訪問済み部屋を追跡
        collectedPapers: [], // 集めた紙片情報
        currentRitualPattern: randomPattern, // 選択されたパターン
        rareItemLocations: {}, // ランダム配置されたレアアイテムの位置 {objectId: rareItemId}
        checkedEmptyLocations: [], // 調べて空だった場所のリスト
        gameFlags: {
            mirrorActivated: false,
            passageFound: false,
            undergroundAccess: false,
            skeletonExamined: false,
            symbolsDecoded: false,
            altarActivated: false,
            formulaDecoded: false,
            canEscape: false,
            ritualCompleted: false,
            laboratoryAccess: false,
            greenhouseAccess: false,
            bedroomAccess: false,
            familyPuzzleSolved: false,
            herbPuzzleSolved: false,
            libraryAccess: false,
            mapFound: false,
            alternatePassageFound: false,
            lifeSecretRevealed: false,
            // 鍵による扉開錠フラグ
            libraryDoorUnlocked: false,
            laboratoryDoorUnlocked: false,
            cellarAccess: false
        }
    };
    
    // 選択されたパターンに基づいて部屋のオブジェクトを更新
    updateRoomObjectsForPattern();
    
    // レアアイテムをランダムに配置
    gameState.rareItemLocations = generateRandomItemPlacements();
    console.log("ゲーム開始時のレアアイテム配置:", gameState.rareItemLocations);
    
    loadRoom(0);
    
    addPlayerThought("この呪われた館から脱出できるだろうか？");
    
    // 選択されたパターンを表示（ホラーらしく）
    const currentPattern = ritualPatterns[gameState.currentRitualPattern];
    if (currentPattern.type === "horror") {
        addPlayerThought("館に漂う邪悪な気配を感じる...エドワードの魂は苦悶に満ちているようだ。");
        addPlayerThought("この館の真実は恐ろしいものかもしれない...");
    } else {
        addPlayerThought("館の奥に微かな希望の光が見える...もしかすると救いがあるかもしれない。");
        addPlayerThought("エドワードの魂を救うことができれば...");
    }
    addPlayerThought("各部屋で5枚の紙片を集め、最終儀式で真実を明かそう。");
    
    updateInventoryDisplay();
    updateSelectedObjectDisplay();
    updateDirectionArrows(); // 初期の方向矢印を表示
}

// 部屋の読み込み
function loadRoom(roomId) {
    if (!canAccessRoom(roomId)) {
        addPlayerThought(`その部屋にはまだ入れない。必要な条件を満たしていないようだ。`);
        return;
    }
    
    gameState.currentRoom = roomId;
    const room = rooms[roomId];
    
    // プレイヤーの行動を記録
    addPlayerThought(`${room.name}に入った。`);
    
    // 現在の部屋名を更新
    updateCurrentRoomDisplay();
    
    // 初回訪問時にストーリーを表示
    if (!gameState.visitedRooms.includes(roomId)) {
        gameState.visitedRooms.push(roomId);
        showStoryForRoom(roomId);
    }
    
    // インタラクティブオブジェクトの更新
    updateRoomDisplay(room);
    
    // 部屋ナビゲーションの更新
    updateRoomNavigation();
    
    // 部屋固有の処理
    if (room.onEnter) {
        room.onEnter();
    }
    
    // 背景音の変更（遅延なし）
    if (roomId === 4) {
        playJumpScare();
    } else {
        playRandomEffect();
    }
}

// 部屋へアクセス可能かチェック（canMoveToRoomと統合）
function canAccessRoom(roomId) {
    return canMoveToRoom(roomId);
}

// 現在の部屋名表示を更新
function updateCurrentRoomDisplay() {
    const roomDisplay = document.querySelector('#current-room-display span');
    if (roomDisplay && rooms[gameState.currentRoom]) {
        roomDisplay.textContent = `現在の部屋: ${rooms[gameState.currentRoom].name}`;
    }
}

// 部屋表示の更新
function updateRoomDisplay(room) {
    const interactiveObjects = document.getElementById('interactive-objects');
    interactiveObjects.innerHTML = '';
    
    room.objects.forEach(obj => {
        // 隠されたオブジェクトは特定の条件で表示
        if (obj.hidden && !isObjectRevealed(obj.id)) {
            return;
        }
        
        // アイテムは取得済みなら表示しない（二重チェック）
        if (obj.item && (gameState.inventory.some(item => item.id === obj.id) || gameState.acquiredItems.includes(obj.id))) {
            return;
        }
        
        // 解決済みパズルのオブジェクトは表示しない
        if (isPuzzleSolved(obj.id)) {
            return;
        }
        
        const objElement = document.createElement('div');
        objElement.className = 'interactive-object';
        objElement.style.left = `${obj.x}%`;
        objElement.style.top = `${obj.y}%`;

        // 動的サイズ決定
        const { width, height } = getObjectSize(obj);
        objElement.style.width = `${width}px`;
        objElement.style.height = `${height}px`;

        // ラベル（簡潔化）
        objElement.textContent = generateShortName(obj.name);

        // 位置決定（中央揃え & はみ出し防止）
        const containerWidth = interactiveObjects.offsetWidth;
        const containerHeight = interactiveObjects.offsetHeight;

        // 初期はゲーム画面が非表示で幅高さが0の場合がある。
        // その場合は % ベースの位置を維持し、後で adjustRoomObjectPositions() で再配置する。
        if (containerWidth === 0 || containerHeight === 0) {
            // % 位置のままにしておき、return で次のオブジェクトへ
            objElement.style.left = `${obj.x}%`;
            objElement.style.top = `${obj.y}%`;
        } else {
            let leftPx = (obj.x / 100) * containerWidth - width / 2;
            let topPx = (obj.y / 100) * containerHeight - height / 2;
            // クランプ
            leftPx = Math.max(0, Math.min(containerWidth - width, leftPx));
            topPx = Math.max(0, Math.min(containerHeight - height, topPx));
            objElement.style.left = `${leftPx}px`;
            objElement.style.top = `${topPx}px`;
        }

        // クリックで選択
        objElement.addEventListener('click', () => selectObject(obj));
        
        // タッチデバイス用のイベント追加
        objElement.addEventListener('touchstart', (e) => {
            e.preventDefault(); // デフォルトのタッチ動作を防止
            selectObject(obj);
        });

        // クイズ/パズルがある場所は特別な色にする
        if (isQuizLocation(obj.id) || obj.id === "herb_pot") {
            objElement.classList.add('quiz-location');
        }
        
        // 選択されたオブジェクトにselectedクラスを追加
        if (gameState.selectedObject && gameState.selectedObject.id === obj.id) {
            objElement.classList.add('selected');
        }
        
        interactiveObjects.appendChild(objElement);
    });
}

// オブジェクトが表示される条件をチェック
function isObjectRevealed(objectId) {
    switch(objectId) {
        case "golden_key":
            return gameState.gameFlags.skeletonExamined;
        default:
            return false;
    }
}

// パズルが解決済みかチェック
function isPuzzleSolved(objectId) {
    const puzzleMapping = {
        "painting": "painting_puzzle",
        "mirror": "mirror_puzzle", 
        "diary": "diary_puzzle",
        "formula": "formula_puzzle",
        "altar": "final_ritual",
        "family_portrait": "family_puzzle",
        "secret_bookshelf": "bookshelf_puzzle",
        "wine_cipher": "cipher_puzzle",
        "cellar_wall": "symbol_puzzle",
        "ancient_safe": "astronomy_puzzle",
        "experiment_notes": "choice_ritual",
        "ancient_door": "pattern_lock",
        "blackboard": "math_riddle",
        "crystal": "crystal_puzzle",
        "ancient_tome": "ancient_tome_puzzle"
    };
    
    const puzzleId = puzzleMapping[objectId];
    return puzzleId && gameState.solvedPuzzles.includes(puzzleId);
}

// クイズ/パズルがある場所かチェック
function isQuizLocation(objectId) {
    const quizObjects = [
        "painting",
        "mirror",
        "diary",
        "formula",
        "altar",
        "family_portrait",
        "secret_bookshelf",
        "wine_cipher",
        "cellar_wall",
        "ancient_safe",
        "experiment_notes",
        "blackboard",
        "ancient_door",
        "crystal",
        "ancient_tome"
    ];
    
    return quizObjects.includes(objectId);
}

// 選択中オブジェクト表示を更新
function updateSelectedObjectDisplay() {
    const selectedObjectInfo = document.getElementById('selected-object-info');
    if (!selectedObjectInfo) return;
    
    if (gameState.selectedObject) {
        selectedObjectInfo.innerHTML = `
            <strong>${gameState.selectedObject.name}</strong><br>
            <span style="color: #ffffff; font-size: 0.8rem;">${gameState.selectedObject.description}</span>
        `;
        selectedObjectInfo.style.border = '2px solid #000000';
        selectedObjectInfo.style.background = '#2a2a2a';
    } else {
        selectedObjectInfo.textContent = '何も選択されていません';
        selectedObjectInfo.style.border = '1px solid #000000';
        selectedObjectInfo.style.background = '#2a2a2a';
    }
}

// オブジェクト選択
function selectObject(obj) {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    // ツールチップを隠す
    hideObjectTooltip();
    
    // 同じオブジェクトをクリックした場合は選択解除
    if (gameState.selectedObject && gameState.selectedObject.id === obj.id) {
        gameState.selectedObject = null;
        updateObjectSelectionStates();
        updateSelectedObjectDisplay();
        addPlayerThought(`${obj.name}の選択を解除した。`);
        return;
    }
    
    gameState.selectedObject = obj;
    
    // 視覚的フィードバックのために選択状態のみを更新（部屋全体の再描画は避ける）
    updateObjectSelectionStates();
    updateSelectedObjectDisplay();
    
    addPlayerThought(`${obj.name}を選択した。`);
    // examineObjectは削除し、選択時に説明を表示しないように変更
}

// オブジェクトの選択状態のみを更新する関数
function updateObjectSelectionStates() {
    const interactiveObjects = document.querySelectorAll('.interactive-object');
    
    interactiveObjects.forEach(objElement => {
        // 既存の選択クラスを削除
        objElement.classList.remove('selected');
    });
    
    // 選択されたオブジェクトがある場合、対応する要素に選択クラスを追加
    if (gameState.selectedObject) {
        const room = rooms[gameState.currentRoom];
        const selectedObj = room.objects.find(obj => obj.id === gameState.selectedObject.id);
        
        if (selectedObj) {
            // 対応するDOM要素を見つけて選択クラスを追加
            interactiveObjects.forEach(objElement => {
                const objTitle = objElement.title;
                if (objTitle === selectedObj.name) {
                    objElement.classList.add('selected');
                }
            });
        }
    }
    
    // 問題のある場所のボタンを赤色にする
    updateProblematicButtonStyling();
}

// 問題のある場所のボタンスタイルを更新
function updateProblematicButtonStyling() {
    const examineBtn = document.querySelector('.control-btn');
    const useBtn = document.querySelectorAll('.control-btn')[1];
    
    if (!examineBtn || !useBtn) return;
    
    // 既存のproblematicクラスを削除
    examineBtn.classList.remove('problematic');
    useBtn.classList.remove('problematic');
    
    // 選択されたオブジェクトがある場合
    if (gameState.selectedObject) {
        const obj = gameState.selectedObject;
        const room = rooms[gameState.currentRoom];
        
        // 未解決のパズルがある場合（調べるボタンを赤色化）
        const unsolvedPuzzleObjects = [
            { id: "painting", puzzle: "painting_puzzle" },
            { id: "mirror", puzzle: "mirror_puzzle" },
            { id: "diary", puzzle: "diary_puzzle" },
            { id: "formula", puzzle: "formula_puzzle" },
            { id: "family_portrait", puzzle: "family_puzzle" },
            { id: "secret_bookshelf", puzzle: "bookshelf_puzzle" },
            { id: "wine_cipher", puzzle: "cipher_puzzle" },
            { id: "cellar_wall", puzzle: "symbol_puzzle" },
            { id: "ancient_safe", puzzle: "astronomy_puzzle" },
            { id: "experiment_notes", puzzle: "choice_ritual" },
            { id: "ancient_door", puzzle: "pattern_lock" },
            { id: "blackboard", puzzle: "math_riddle" },
            { id: "herb_pot", puzzle: "herb_puzzle" },
            { id: "crystal", puzzle: "crystal_puzzle" },
            { id: "ancient_tome", puzzle: "ancient_tome_puzzle" }
        ];
        
        // 未解決のパズルがある場合
        for (const puzzleObj of unsolvedPuzzleObjects) {
            if (obj.id === puzzleObj.id && !gameState.solvedPuzzles.includes(puzzleObj.puzzle)) {
                examineBtn.classList.add('problematic');
                break;
            }
        }
        
        // 最終儀式でアイテムが必要な場合
        if (obj.id === "altar" && canPerformRitual()) {
            const hasRitualItem = gameState.inventory.some(item => 
                item.id === "crystal" || item.id === "knowledge" || 
                item.id === "crystal_knowledge" || item.id === "stellar_knowledge"
            );
            if (hasRitualItem) {
                useBtn.classList.add('problematic');
            }
        }
        
        // 鍵が必要な扉の場合
        const lockedDoors = [
            { id: "door_library", key: "library_key", message: "私室の鍵が必要" },
            { id: "door", key: "golden_key", message: "黄金の鍵が必要" }
        ];
        
        for (const door of lockedDoors) {
            if (obj.id === door.id) {
                const hasKey = gameState.inventory.some(item => item.id === door.key);
                if (!hasKey) {
                    examineBtn.classList.add('problematic');
                } else {
                    useBtn.classList.add('problematic');
                }
                break;
            }
        }
        
        // アイテムが必要なオブジェクトの場合
        const itemRequiredObjects = [
            { id: "symbols", item: "tome", message: "禁断の書が必要" },
            { id: "mirror", item: "candlestick", message: "燭台が必要", condition: () => !gameState.gameFlags.mirrorActivated }
        ];
        
        for (const itemObj of itemRequiredObjects) {
            if (obj.id === itemObj.id) {
                const hasItem = gameState.inventory.some(item => item.id === itemObj.item);
                const conditionMet = !itemObj.condition || itemObj.condition();
                
                if (!hasItem && conditionMet) {
                    examineBtn.classList.add('problematic');
                } else if (hasItem && conditionMet) {
                    useBtn.classList.add('problematic');
                }
                break;
            }
        }
        
        // 最終儀式が可能な場合（祭壇）
        if (obj.id === "altar" && canPerformRitual()) {
            examineBtn.classList.add('problematic');
        }
        
        // 出口が封印されている場合
        if (obj.id === "exit" && !gameState.gameFlags.canEscape) {
            examineBtn.classList.add('problematic');
        }
    }
}

// オブジェクトを調べる
function examineObject() {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    if (!gameState.selectedObject) {
        addPlayerThought("まず調べたいものを選択しよう。");
        return;
    }
    
    const obj = gameState.selectedObject;
    
    // パズルがある場所かチェックして、直接パズルを開く
    if (isQuizLocation(obj.id)) {
        checkPuzzleTrigger(obj);
        return; // パズルを開いた場合は、他の処理をスキップ
    }
    
    queueMessage(obj.description);
    
    // 特定の条件下での追加情報
    if (obj.id === "mirror" && !gameState.gameFlags.mirrorActivated) {
        queueMessage("文字が薄くてよく見えない。もっと明るい光が必要かもしれない。");
    } else if (obj.id === "mirror" && gameState.gameFlags.mirrorActivated) {
        queueMessage("燭台の光で文字がはっきりと見える！");
    }
    
    // 紙片の発見処理
    if (obj.paper) {
        const alreadyFound = gameState.collectedPapers.some(paper => 
            paper.number === obj.paper.number && paper.character === obj.paper.character
        );
        
        if (!alreadyFound) {
            // 30%の確率でランダムパズルが発生
            if (Math.random() < 0.3) {
                queueMessage(`古い紙片を発見したが、魔法の封印がかかっている！`);
                queueMessage(`封印を解かなければ紙片を取ることができない...`);
                
                // ランダムパズルを選択
                const paperPuzzles = [
                    {
                        id: "paper_riddle_" + Date.now(),
                        type: "choice",
                        title: "紙片の封印 - 魔法の謎かけ",
                        content: "紙片に浮かび上がった古代の謎かけ：\n\n「私は形を持たないが、すべてを包む。\n私は音を立てないが、すべてを動かす。\n私は見えないが、すべてを変える。\n私は何か？」",
                        choices: [
                            "風",
                            "時間", 
                            "魔法",
                            "愛"
                        ],
                        correctChoice: 1,
                        hint: "形を持たず、音を立てず、見えないが、すべてを変える力...",
                        detailedHint: "答えは「時間」。時間はすべてを包み、動かし、変える。",
                        paperReward: obj.paper
                    },
                    {
                        id: "paper_pattern_" + Date.now(),
                        type: "pattern",
                        title: "紙片の封印 - 古代の印章",
                        content: "紙片の周りに古代の印章が現れた。正しい順番で印章を押して封印を解除せよ。\n\n印章の意味：\n🔥 = 火の力\n💧 = 水の力\n🌬️ = 風の力\n🌍 = 地の力\n\n四大元素の調和の順番で印章を押せ：",
                        pattern: [2, 0, 1, 3], // 風→火→水→地
                        symbols: ["🔥", "💧", "🌬️", "🌍"],
                        hint: "四大元素の調和：風が火を起こし、火が水を温め、水が地を潤す。",
                        detailedHint: "🌬️(風)→🔥(火)→💧(水)→🌍(地)の順番で印章を押す。",
                        paperReward: obj.paper
                    },
                    {
                        id: "paper_math_" + Date.now(),
                        type: "choice", 
                        title: "紙片の封印 - 数字の魔法",
                        content: "紙片に数字の魔法陣が浮かび上がった：\n\n「3つの連続する数字の合計は15である。\nその中で最も小さい数字は何か？」\n\n魔法陣を解いて封印を解除せよ：",
                        choices: [
                            "3",
                            "4",
                            "5", 
                            "6"
                        ],
                        correctChoice: 1,
                        hint: "3つの連続する数字をx, x+1, x+2とすると、x + (x+1) + (x+2) = 15",
                        detailedHint: "3x + 3 = 15なので、3x = 12、x = 4。答えは4。",
                        paperReward: obj.paper
                    }
                ];
                
                // ランダムに1つ選択
                const randomPuzzle = paperPuzzles[Math.floor(Math.random() * paperPuzzles.length)];
                
                // パズルを開く
                gameState.paperPuzzleReward = randomPuzzle.paperReward;
                openPuzzle(randomPuzzle.id);
                
                // 一時的にパズルを追加
                puzzles.push(randomPuzzle);
                
                return; // 通常の紙片処理はスキップ
            } else {
                // 通常の紙片取得
                gameState.collectedPapers.push(obj.paper);
                queueMessage(`古い紙片を発見した！`);
                showPaperNotification(obj.paper.number, obj.paper.character);
                playSuccessSound();
            }
        } else {
            queueMessage(`この紙片は既に調べた。`);
            showPaperNotification(obj.paper.number, obj.paper.character);
        }
    }
    
    // ランダムアイテムシステムの処理
    const locationKey = `${gameState.currentRoom}_${obj.id}`;
    const hasRareItem = gameState.rareItemLocations[locationKey];
    const isEmptyLocation = gameState.checkedEmptyLocations.includes(locationKey);
    
    // ランダムアイテムがある場合
    if (hasRareItem && !gameState.acquiredItems.includes(hasRareItem)) {
        const rareItem = rareItems.find(item => item.id === hasRareItem);
        if (rareItem) {
            const added = addInventoryItem(rareItem.id, rareItem.name);
            if (added) {
                queueMessage(`✨ 隠されていた${rareItem.name}を発見した！`);
                queueMessage(`📖 ${rareItem.description}`);
                // 効果は「使う」ボタンで発動させるため、ここでは適用しない
                updateRoomDisplay(rooms[gameState.currentRoom]);
                return; // 通常のアイテム処理はスキップ
            }
        }
    }
    
    // 何もない場所の処理（まだ調べていない場合）
    if (!hasRareItem && !obj.item && !obj.paper && !isEmptyLocation) {
        // 15%の確率でレアアイテムが後から見つかる
        if (Math.random() < 0.15) {
            // ランダムでレアアイテムを生成
            const availableItems = rareItems.filter(item => !gameState.acquiredItems.includes(item.id));
            if (availableItems.length > 0) {
                const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
                const added = addInventoryItem(randomItem.id, randomItem.name);
                if (added) {
                    queueMessage(`🎲 運良く${randomItem.name}を発見した！`);
                    queueMessage(`📖 ${randomItem.description}`);
                    // 効果は後で使用した時に適用
                    return;
                }
            }
        }
        
        const emptyMessage = emptyLocationMessages[Math.floor(Math.random() * emptyLocationMessages.length)];
        queueMessage(emptyMessage);
        gameState.checkedEmptyLocations.push(locationKey);
        playFailureSound();
        return;
    }
    
    // 通常のアイテムの取得処理（既に取得済みでないかチェック）
    if (obj.item) {
        // 二重チェック（インベントリと取得済みリストの両方）
        if (gameState.inventory.some(item => item.id === obj.id) || gameState.acquiredItems.includes(obj.id)) {
            queueMessage(`${obj.name}は既に取得済みです。`);
            playFailureSound();
        } else {
            const added = addInventoryItem(obj.id, obj.name);
            if (added) {
                updateRoomDisplay(rooms[gameState.currentRoom]);
                queueMessage(`${obj.name}を手に入れた！`);
                playRandomEffect();
            }
        }
    }
    
    // パズルではない場合の特別な処理
    checkPuzzleTrigger(obj);
}

// パズルトリガーのチェック
function checkPuzzleTrigger(obj) {
    if (obj.id === "painting" && !gameState.solvedPuzzles.includes("painting_puzzle")) {
        openPuzzle("painting_puzzle");
    } else if (obj.id === "mirror" && !gameState.solvedPuzzles.includes("mirror_puzzle")) {
        openPuzzle("mirror_puzzle");
    } else if (obj.id === "diary" && !gameState.solvedPuzzles.includes("diary_puzzle")) {
        openPuzzle("diary_puzzle");
    } else if (obj.id === "formula" && !gameState.solvedPuzzles.includes("formula_puzzle")) {
        openPuzzle("formula_puzzle");
    } else if (obj.id === "altar" && canPerformRitual()) {
        openPuzzle("final_ritual");
    } else if (obj.id === "door_library") {
        queueMessage("扉は施錠されている。鍵が必要だ。");
        if (gameState.inventory.some(item => item.id === "library_key")) {
            queueMessage("私室の鍵を持っている。鍵を選択して扉に使ってみよう。");
        }
    } else if (obj.id === "secret_passage") {
        if (gameState.gameFlags.passageFound) {
            queueMessage("隠し通路を通って秘密の書斎に向かう。");
            queueMessage("【部屋移動】秘密の書斎に入室した！");
            loadRoom(2);
        } else {
            queueMessage("本棚の陰に何かがありそうだが、手がりが足りない。");
        }
    } else if (obj.id === "skeleton") {
        queueMessage("古い骸骨を調べた。");
        queueMessage("長い間ここで力尽きたようだ...");
        queueMessage("手に何かを握りしめている。");
        gameState.gameFlags.skeletonExamined = true;
        updateRoomDisplay(rooms[gameState.currentRoom]);
    } else if (obj.id === "door") {
        queueMessage("重厚な石の扉は固く閉ざされている。黄金の鍵穴がある。");
        if (gameState.inventory.some(item => item.id === "golden_key")) {
            queueMessage("黄金の鍵を持っている。鍵を選択して扉に使ってみよう。");
        }
    } else if (obj.id === "exit") {
        if (gameState.gameFlags.canEscape) {
            endGame(true);
        } else {
            queueMessage("重厚な石の扉は固く閉ざされている。");
            queueMessage("古代の封印により、まだ開くことができない...");
        }
    } else if (obj.id === "family_portrait" && !gameState.solvedPuzzles.includes("family_puzzle")) {
        openPuzzle("family_puzzle");
    } else if (obj.id === "old_bed") {
        queueMessage("エドワードが最後に眠ったベッド。枕の下に何かが隠されている...");
        queueMessage("妻への手紙を発見した！");
        const added = addInventoryItem("letter", "妻への手紙");
        if (added) {
            updateRoomDisplay(rooms[gameState.currentRoom]);
            queueMessage("エドワードの最後の想いが綴られている...");
        }
    } else if (obj.id === "broken_pot") {
        queueMessage("古い陶製の植木鉢。底に小さな隠し扉があるが、既に空になっている。");
    } else if (obj.id === "vines") {
        queueMessage("異様な蔓を触ると、微かに脈打っている...");
        queueMessage("この温室にはまだ生命の力が宿っているようだ。");
    } else if (obj.id === "secret_bookshelf" && !gameState.solvedPuzzles.includes("bookshelf_puzzle")) {
        openPuzzle("bookshelf_puzzle");
    } else if (obj.id === "wine_cipher" && !gameState.solvedPuzzles.includes("cipher_puzzle")) {
        openPuzzle("cipher_puzzle");
    } else if (obj.id === "cellar_wall" && !gameState.solvedPuzzles.includes("symbol_puzzle")) {
        openPuzzle("symbol_puzzle");
    } else if (obj.id === "ancient_safe" && !gameState.solvedPuzzles.includes("astronomy_puzzle")) {
        openPuzzle("astronomy_puzzle");
    } else if (obj.id === "experiment_notes" && !gameState.solvedPuzzles.includes("choice_ritual")) {
        openPuzzle("choice_ritual");
    } else if (obj.id === "ancient_door" && !gameState.solvedPuzzles.includes("pattern_lock")) {
        openPuzzle("pattern_lock");
    } else if (obj.id === "blackboard" && !gameState.solvedPuzzles.includes("math_riddle")) {
        openPuzzle("math_riddle");
    } else if (obj.id === "herb_pot" && !gameState.solvedPuzzles.includes("herb_puzzle")) {
        openPuzzle("herb_puzzle");
    } else if (obj.id === "crystal" && !gameState.solvedPuzzles.includes("crystal_puzzle")) {
        openPuzzle("crystal_puzzle");
    } else if (obj.id === "ancient_tome" && !gameState.solvedPuzzles.includes("ancient_tome_puzzle")) {
        openPuzzle("ancient_tome_puzzle");
    }
}

// 最終儀式が実行可能かチェック
function canPerformRitual() {
    // 新しい紙片システムの場合、5枚全ての紙片が必要
    const hasAllPapers = gameState.collectedPapers.length >= 5;
    
    if (!hasAllPapers) {
        // 紙片が不足している場合、不足している分を教える
        queueMessage(`最終儀式には5枚の紙片が必要です。現在${gameState.collectedPapers.length}/5枚を所持。`);
        if (gameState.collectedPapers.length > 0) {
            const collected = gameState.collectedPapers
                .sort((a, b) => a.number - b.number)
                .map(p => `${p.number}番目: 「${p.character}」`)
                .join(', ');
            queueMessage(`集めた紙片: ${collected}`);
        }
        return false;
    }
    
    return true;
}

// インベントリ管理
function addInventoryItem(id, name) {
    // 重複チェックを強化（インベントリと取得済みリストの両方をチェック）
    if (gameState.inventory.some(item => item.id === id) || gameState.acquiredItems.includes(id)) {
        addMessage(`${name}は既に持っています。`);
        return false; // 追加しなかった
    }
    
    gameState.inventory.push({ id, name });
    // 永続的な取得済みリストにも追加
    gameState.acquiredItems.push(id);
    updateInventoryDisplay();
    return true; // 追加した
}

function updateInventoryDisplay() {
    const inventoryItems = document.getElementById('inventory-items');
    inventoryItems.innerHTML = '';
    
    // アイテムの使用場所説明
    const itemDescriptions = {
        "candlestick": "鏡に使用",
        "library_key": "私室の扉に使用", 
        "small_key": "机の引き出しに使用",
        "golden_key": "地下扉に使用",
        "crystal": "最終儀式で使用",
        "diary": "暗号解読用",
        "tome": "封印記号に使用",
        "knowledge": "最終儀式で使用",
        "letter": "エドワードの想い",
        "hidden_note": "秘密の研究記録",
        "mansion_map": "全部屋移動可能",
        "protection_charm": "見つかる確率-5%",
        "silver_amulet": "見つかる確率-10%",
        "ancient_seal": "見つかる確率-8%",
        "blessed_candle": "見つかる確率-7%",
        "mystic_crystal": "見つかる確率-15%"
    };
    
    for (let i = 0; i < 12; i++) {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        
        if (i < gameState.inventory.length) {
            const item = gameState.inventory[i];
            const description = itemDescriptions[item.id] || "用途不明";
            
            itemElement.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 3px;">${item.name}</div>
                <div style="font-size: 0.7rem; color: #aaa; line-height: 1.2;">${description}</div>
            `;
            itemElement.addEventListener('click', () => selectInventoryItem(item));
            
            // タッチデバイス用のイベント追加
            itemElement.addEventListener('touchstart', (e) => {
                e.preventDefault(); // デフォルトのタッチ動作を防止
                selectInventoryItem(item);
            });
            
            if (gameState.selectedItem && gameState.selectedItem.id === item.id) {
                itemElement.classList.add('selected');
            }
        }
        
        inventoryItems.appendChild(itemElement);
    }
    
    // 見つかる確率表示を更新
    updateDiscoveryChance();
    
    // 問題のある場所のボタンスタイルを更新
    updateProblematicButtonStyling();
}

function selectInventoryItem(item) {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    gameState.selectedItem = item;
    updateInventoryDisplay();
    addPlayerThought(`${item.name}を選択した。`);
}

// アイテム使用
function useItem() {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    if (!gameState.selectedItem) {
        addPlayerThought("まず使いたいアイテムを選択しよう。");
        playFailureSound();
        return;
    }
    
    const item = gameState.selectedItem;
    
    // ------- 発見率減少アイテムは対象不要で即使用 -------
    const rareMeta = rareItems.find(r => r.id === item.id && r.effect === 'discovery_reduction');
    if (rareMeta) {
        if (!gameState.usedRareItems) gameState.usedRareItems = [];
        if (gameState.usedRareItems.includes(item.id)) {
            addPlayerThought(`${item.name}は既に使用済みです。`);
            playFailureSound();
            return;
        }
        console.debug(`[DEBUG] Using discovery-reduction item '${item.id}'. Current chance: ${gameState.discoveryChance}%`);
        applyRareItemEffect(item.id);
        console.debug(`[DEBUG] After applyRareItemEffect, chance is ${gameState.discoveryChance}%`);
        removeInventoryItem(item.id);
        playItemUseSound();
        addPlayerThought(`${item.name}を使用し、見つかる確率が減少した。`);
        gameState.usedRareItems.push(item.id);
        gameState.selectedItem = null; // アイテム選択解除
        return; // 完了
    }
    
    // --- ここから通常アイテム: 対象が必要 ---
    if (!gameState.selectedObject) {
        addPlayerThought("アイテムを使う対象を選択しよう。");
        playFailureSound();
        return;
    }
    
    const room = rooms[gameState.currentRoom];
    const selectedObj = gameState.selectedObject;
    let itemUsed = false;
    
    // 厳密なアイテムと対象の組み合わせのみ許可
    if (item.id === "candlestick" && selectedObj.id === "mirror" && room.id === 0) {
        queueMessage("燭台を鏡の前に置いた。");
        queueMessage("炎の光が鏡に反射し、隠された文字がはっきりと見えるようになった！");
        gameState.gameFlags.mirrorActivated = true;
        // 燭台は使用後も手元に残る（蝋燭が減っただけ）
        queueMessage("燭台の蝋燭は短くなったが、まだ使える。");
        playItemUseSound();
    } 
    else if (item.id === "library_key" && selectedObj.id === "door_library" && room.id === 0) {
        queueMessage("私室の鍵で扉を開けた。");
        queueMessage("【部屋開放】エドワードの私室に入室可能になった！");
        queueMessage("鍵は扉に挿したままにしておこう。");
        gameState.gameFlags.libraryDoorUnlocked = true;
        removeInventoryItem("library_key");
        playItemUseSound();
        updateRoomNavigation(); // ナビゲーションを更新
        // 自動的に部屋移動せず、プレイヤーが矢印やナビゲーションで移動できるようにする
        gameState.selectedItem = null; // アイテム選択解除
        addPlayerThought("私室への扉が開いた。矢印かナビボタンで移動できる。");
        return; // 早期リターンで重複処理を回避
    } 
    else if (item.id === "small_key" && selectedObj.id === "desk" && room.id === 1) {
        queueMessage("小さな鍵で机の引き出しを開けた。");
        queueMessage("引き出しの中から隠し通路の地図を発見した！");
        gameState.gameFlags.passageFound = true;
        queueMessage("【部屋開放】秘密の書斎への通路が判明した！");
        queueMessage("小さな鍵は引き出しに置いたままにしておこう。");
        removeInventoryItem("small_key");
        playItemUseSound();
    } 
    else if (item.id === "golden_key" && selectedObj.id === "door" && room.id === 3) {
        // 地下通路で黄金の鍵を使って地下実験室へ
        queueMessage("黄金の鍵で地下実験室への扉を開けた。");
        queueMessage("【部屋開放】地下実験室に入室可能になった！");
        gameState.gameFlags.laboratoryAccess = true;
        gameState.gameFlags.laboratoryDoorUnlocked = true;
        queueMessage("黄金の鍵は扉の鍵穴に挿したままにしておこう。");
        removeInventoryItem("golden_key");
        playItemUseSound();
        updateRoomNavigation(); // ナビゲーションを更新
        gameState.selectedItem = null;
        addPlayerThought("地下実験室への扉が開いた。矢印かナビボタンで移動できる。");
        return;
    } 
    else if (item.id === "tome" && selectedObj.id === "symbols" && room.id === 5) {
        queueMessage("禁断の書を開いて古代記号を解読した。");
        queueMessage("記号の真の意味が明らかになる...");
        gameState.gameFlags.symbolsDecoded = true;
        // 禁断の書は使用後も手元に残る
        queueMessage("知識を得たが、書物はまだ手元にある。");
        playItemUseSound();
    } 
    // 最終儀式での特別な処理（各アイテムは最終儀式でのみ使用）
    else if (room.id === 4 && selectedObj.id === "altar" && canPerformRitual()) {
        if (item.id === "crystal" || item.id === "knowledge" || item.id === "crystal_knowledge" || item.id === "stellar_knowledge") {
            queueMessage(`${item.name}を祭壇に配置した。`);
            queueMessage("祭壇が光り、最終儀式が開始される...");
            removeInventoryItem(item.id);
            playItemUseSound();
            // 最終儀式を開始
            openPuzzle("final_ritual");
            return;
        }
    }
    else {
        // より具体的なエラーメッセージ
        if (room.id !== getCorrectRoomForItem(item.id)) {
            queueMessage(`${item.name}はこの部屋では使えません。`);
        } else if (!isCorrectTarget(item.id, selectedObj.id)) {
            queueMessage(`${item.name}は${selectedObj.name}には使えません。`);
        } else {
            queueMessage(`${item.name}をここで使う条件が整っていません。`);
        }
        playFailureSound();
        return;
    }
    
    
    // アイテムが使用された場合は既に個別に処理済み
}

// アイテム削除関数
function removeInventoryItem(itemId) {
    const index = gameState.inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
        gameState.inventory.splice(index, 1);
        // 削除されたアイテムが選択されていた場合、選択を解除
        if (gameState.selectedItem && gameState.selectedItem.id === itemId) {
            gameState.selectedItem = null;
        }
        updateInventoryDisplay();
        // 注意：acquiredItemsからは削除しない（再取得を防ぐため）
    }
}

// ヒント表示
function showHint() {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    const room = rooms[gameState.currentRoom];
    let hint = "";
    
    // 選択中のオブジェクトに関連したヒントを優先表示
    if (gameState.selectedObject) {
        const obj = gameState.selectedObject;
        
        // オブジェクト固有のヒント
        if (obj.id === "edward_painting" && !gameState.solvedPuzzles.includes("painting_puzzle")) {
            hint = "エドワードの肖像画の額縁に注目！月が3つ、星が2つ、太陽が1つ。この数字を組み合わせてみよう。";
        } else if (obj.id === "ancient_mirror" && !gameState.solvedPuzzles.includes("mirror_puzzle")) {
            hint = "鏡の文字「ECNEICS DNA CIGAM」は反転している。逆から読んでみよう！";
        } else if (obj.id === "diary" && !gameState.solvedPuzzles.includes("diary_puzzle")) {
            hint = "日記の暗号：「最初の文字を集めよ」とある。YAMI(Y) + HIKARI(H) + HOSHI(H) + SHINJITSU(S) + TOBIRA(T) + KAGI(K) = ?";
        } else if (obj.id === "formula" && !gameState.solvedPuzzles.includes("formula_puzzle")) {
            hint = "生命の公式：魂(1) + 精神(2) + 肉体(3) = ? 単純な足し算です。";
        } else if (obj.id === "ritual_altar" && !gameState.solvedPuzzles.includes("final_ritual")) {
            const currentPattern = ritualPatterns[gameState.currentRitualPattern];
            if (gameState.collectedPapers.length < 5) {
                hint = `最終儀式には5枚の紙片が必要。現在${gameState.collectedPapers.length}/5枚集めています。`;
            } else {
                hint = `5枚の紙片を番号順に並べよう：${currentPattern.papers.map(p => `${p.number}番「${p.character}」`).join('、')}`;
            }
        } else if (obj.id === "family_portrait" && !gameState.solvedPuzzles.includes("family_puzzle")) {
            hint = "家族の肖像画の数字：エドワード(1) + 妻(4) + 娘(7) + 月(2) を順番に並べて4桁の数字にしよう。";
        } else if (obj.id === "herb_pot" && !gameState.solvedPuzzles.includes("herb_puzzle")) {
            hint = "薬草の調合レシピ：月の花(3) + 星の草(5) + 太陽の実(8) + 魂の根(1) をすべて足してみよう。";
        } else if (obj.id === "crystal" && !gameState.solvedPuzzles.includes("crystal_puzzle")) {
            hint = "水晶の謎：月の光(7) + 太陽の力(9) + 影の力(3) を足して永遠の数を導こう。";
        } else if (obj.id === "ancient_tome" && !gameState.solvedPuzzles.includes("ancient_tome_puzzle")) {
            hint = "星座の謎：火(3) + 地(4) + 風(2) + 水(3) の力を合わせて運命の数字を導こう。";
        } else if (obj.id === "secret_bookshelf" && !gameState.solvedPuzzles.includes("bookshelf_puzzle")) {
            hint = "本棚の本を背表紙の数字順に引こう：2番目の本(1) → 1番目の本(3) → 3番目の本(2)";
        } else if (obj.id === "wine_cipher" && !gameState.solvedPuzzles.includes("cipher_puzzle")) {
            hint = "ワイン樽の文字「EDARG DRAWDE」を逆から読んでみよう。エドワードが好んだ鏡の謎です。";
        } else if (obj.id === "cellar_wall" && !gameState.solvedPuzzles.includes("symbol_puzzle")) {
            hint = "暗号文字『HFBFODF NBUUFS』の各文字を1つ前のアルファベットに戻してみよう。H→G、F→E...";
        } else if (obj.id === "ancient_safe" && !gameState.solvedPuzzles.includes("astronomy_puzzle")) {
            hint = "天体の金庫：月(3) + 星(2) + 太陽(1) + 土星(4) を順番に並べて4桁の数字にしよう。";
        } else {
            // オブジェクトが選択されているが、特定のヒントがない場合
            hint = `${obj.name}を調べている。パズルがあれば解いてみよう。アイテムが必要なら持ち物から選んで「使う」ボタンを押そう。`;
        }
    }
    
    // オブジェクト固有のヒントがない場合、部屋の状況に応じたヒントを提供
    if (!hint) {
    if (gameState.currentRoom === 0) {
        if (!gameState.solvedPuzzles.includes("painting_puzzle")) {
                hint = "エドワードの肖像画をクリックして調べてみよう。額縁の装飾に隠された秘密があります。";
        } else if (!gameState.solvedPuzzles.includes("mirror_puzzle")) {
                hint = "古い鏡に文字が浮かんでいる。鏡は物を反転させることを思い出そう。";
        } else if (!gameState.inventory.some(item => item.id === "library_key")) {
                hint = "肖像画のパズルを解けば、私室への鍵が手に入るはずです。";
        } else {
                hint = "私室の鍵を手に入れた。エドワードの私室のドアを調べて鍵を使ってみよう。";
        }
    } else if (gameState.currentRoom === 1) {
        if (!gameState.inventory.some(item => item.id === "diary")) {
                hint = "エドワードの実験日記を探してみよう。机の上にあるはずです。";
        } else if (!gameState.solvedPuzzles.includes("diary_puzzle")) {
                hint = "日記の暗号詩を読んで、各単語の最初の文字を集めてみよう。";
        } else {
                hint = "日記のパズルを解いたら、他の部屋も探索してみよう。隠し通路があるかもしれません。";
        }
    } else if (gameState.currentRoom === 2) {
        if (!gameState.solvedPuzzles.includes("formula_puzzle")) {
                hint = "壁の生命の公式を解いてみよう。魂、精神、肉体の数値を足し算するだけです。";
        } else {
                hint = "書斎のパズルを解いたら、他の部屋への道が開かれているかもしれません。";
        }
    } else if (gameState.currentRoom === 3) {
        if (!gameState.gameFlags.skeletonExamined) {
                hint = "地下通路の骸骨を調べてみよう。何かを握っているかもしれません。";
        } else {
                hint = "骸骨から手に入れた黄金の鍵で、新しい場所にアクセスできるはずです。";
        }
    } else if (gameState.currentRoom === 4) {
        if (!canPerformRitual()) {
                const currentPattern = ritualPatterns[gameState.currentRitualPattern];
                if (gameState.collectedPapers.length < 5) {
                    hint = `最終儀式には5枚の紙片が必要です。現在${gameState.collectedPapers.length}/5枚。館の各所を探してみましょう。`;
        } else {
                    hint = "5枚の紙片が集まりました！祭壇を調べて最終儀式を行いましょう。";
                }
            } else {
                hint = "祭壇で最終儀式を行う準備ができています。慎重に進めましょう。";
            }
        } else {
            // その他の部屋用のヒント
            hint = "部屋をよく調べて、光っているオブジェクトをクリックしてみよう。パズルやアイテムが隠されているかもしれません。";
        }
    }
    
    // 一般的なヒント（上記のヒントが適用されない場合）
    const generalHints = [
        "光っているオブジェクトをクリックして調べよう。",
        "アイテムを選択してから対象を選び、『使う』ボタンを押そう。",
        "パズルが難しい時は、パズル画面の「ヒント」ボタンを押してみよう。",
        "エドワードの背景ストーリーをよく読むと、パズルのヒントが隠されている。",
        "複数の部屋を行き来して情報を集めよう。",
        "アイテム同士を組み合わせることで新たな道が開けるかも。",
        "ミスをすると見つかる確率が上がるので、慎重に行動しよう。"
    ];
    
    if (!hint) {
        hint = generalHints[Math.floor(Math.random() * generalHints.length)];
    }
    
    addMessage(`💡 ヒント: ${hint}`);
}



// パズル管理
function openPuzzle(puzzleId) {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;
    
    gameState.currentPuzzle = puzzle;
    
    // パズルタイプに応じてUIを切り替え
    const inputTypes = document.querySelectorAll('.puzzle-input-type');
    inputTypes.forEach(type => type.style.display = 'none');
    
    // final_ritualの場合、現在のパターンに基づいて内容を動的に更新
    if (puzzleId === 'final_ritual') {
        const currentPattern = ritualPatterns[gameState.currentRitualPattern];
        
        let dynamicContent;
        if (currentPattern.type === "horror") {
            dynamicContent = `血塗られた錬金術の祭壇の前に立つと、エドワードの苦悶の声が響く...

『私が犯した罪の答えは、館の各所に散らばった呪われた紙片に記されている。
5つの文字を正しい順番で並べれば、永遠の苦痛への扉が開かれるだろう...』

祭壇に血文字で刻まれた呪い：
「生と死の境界を越え、永遠に続く苦痛。
それは我が罪であり、避けらぬ運命。
${currentPattern.story}」

呪われた紙片の文字を正しい順番で入力せよ：`;
        } else {
            dynamicContent = `光に包まれた錬金術の祭壇の前に立つと、エドワードの安らかな声が聞こえる...

『私が探し求めた救いの答えは、館の各所に隠された希望の紙片に記されている。
5つの文字を正しい順番で並べれば、解放への扉が開かれるだろう...』

祭壇に金文字で刻まれた希望：
「生と死を超越し、永遠に続く愛。
それは我が願いであり、救いの光。
${currentPattern.story}」

希望の紙片の文字を正しい順番で入力せよ：`;
        }
        
        // パズルの答えとヒントも動的に更新
        gameState.currentPuzzle.answer = currentPattern.answer;
        if (currentPattern.type === "horror") {
            gameState.currentPuzzle.hint = `呪われた5枚の紙片を番号順に並べよ。${currentPattern.papers.map(p => `${p.number}番目「${p.character}」`).join('、')}の順番で組み合わせると恐ろしい真実が明かされる。`;
        } else {
            gameState.currentPuzzle.hint = `希望の5枚の紙片を番号順に並べよう。${currentPattern.papers.map(p => `${p.number}番目「${p.character}」`).join('、')}の順番で組み合わせると救いの答えが見える。`;
        }
        if (currentPattern.type === "horror") {
            gameState.currentPuzzle.detailedHint = `5枚の呪われた紙片を集めていれば、${currentPattern.papers.map(p => `${p.number}番目「${p.character}」`).join(' + ')} = 「${currentPattern.answer}」が恐ろしい答えだ。`;
        } else {
            gameState.currentPuzzle.detailedHint = `5枚の希望の紙片を集めていれば、${currentPattern.papers.map(p => `${p.number}番目「${p.character}」`).join(' + ')} = 「${currentPattern.answer}」が救いの答えだ。`;
        }
        
    document.getElementById('puzzle-title').textContent = puzzle.title;
        // 改行を保持するためにinnerHTMLを使用し、改行を<br>に変換
        document.getElementById('puzzle-content').innerHTML = dynamicContent.replace(/\n/g, '<br>');
        
        // テキスト入力タイプを表示
        document.getElementById('puzzle-input').style.display = 'flex';
    document.getElementById('puzzle-answer').value = '';
    } else if (puzzle.type === 'choice') {
        // 選択問題の場合
        document.getElementById('puzzle-title').textContent = puzzle.title;
        document.getElementById('puzzle-content').innerHTML = puzzle.content.replace(/\n/g, '<br>');
        
        // 選択肢を生成
        const choiceOptions = document.getElementById('choice-options');
        choiceOptions.innerHTML = '';
        
        puzzle.choices.forEach((choice, index) => {
            const option = document.createElement('div');
            option.className = 'choice-option';
            option.textContent = choice;
            option.addEventListener('click', () => selectChoice(index));
            
            // タッチデバイス用のイベント追加
            option.addEventListener('touchstart', (e) => {
                e.preventDefault(); // デフォルトのタッチ動作を防止
                selectChoice(index);
            });
            choiceOptions.appendChild(option);
        });
        
        document.getElementById('puzzle-choice').style.display = 'block';
        gameState.selectedChoice = null;
    } else if (puzzle.type === 'pattern') {
        // パターンパズルの場合
        document.getElementById('puzzle-title').textContent = puzzle.title;
        document.getElementById('puzzle-content').innerHTML = puzzle.content.replace(/\n/g, '<br>');
        
        // パターングリッドを生成
        const patternGrid = document.getElementById('pattern-grid');
        patternGrid.innerHTML = '';
        
        puzzle.symbols.forEach((symbol, index) => {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            cell.textContent = symbol;
            cell.addEventListener('click', () => selectPatternCell(index));
            
            // タッチデバイス用のイベント追加
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault(); // デフォルトのタッチ動作を防止
                selectPatternCell(index);
            });
            patternGrid.appendChild(cell);
        });
        
        document.getElementById('puzzle-pattern').style.display = 'block';
        gameState.patternSequence = [];
    } else {
        // 通常のテキスト入力パズル
        document.getElementById('puzzle-title').textContent = puzzle.title;
        document.getElementById('puzzle-content').innerHTML = puzzle.content.replace(/\n/g, '<br>');
        
        document.getElementById('puzzle-input').style.display = 'flex';
        document.getElementById('puzzle-answer').value = '';
    }
    
    // パズル画面の見つかる確率表示を更新
    updatePuzzleDiscoveryChance();
    
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('puzzle-screen').classList.add('active');
    
    // フレームサイズに応じて見つかる％の位置を調整
    adjustDiscoveryChancePosition();
    
    playJumpScare();
}

function closePuzzle() {
    // パズルの状態を先にチェック
    const wasUnsolved = gameState.currentPuzzle && !gameState.solvedPuzzles.includes(gameState.currentPuzzle.id);
    
    document.getElementById('puzzle-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // パズル入力をクリア
    const puzzleInput = document.getElementById('puzzle-answer');
    if (puzzleInput) {
        puzzleInput.value = '';
    }
    
    // 選択状態をリセット
    gameState.selectedChoice = null;
    gameState.patternSequence = [];
    
    // パズルを閉じた場合は何もしない（解決状態は変更しない）
    gameState.currentPuzzle = null;
    
    // 見た目ずれ防止のため、ゲーム画面に戻ってからレイアウトを再計算
    updateRoomDisplay(rooms[gameState.currentRoom]);
    
    // 未解決のパズルを閉じた場合にメッセージを表示
    if (wasUnsolved) {
        addMessage("パズルをまだ解いていない。もう一度挑戦する必要がある。");
    }
}

// 選択問題用の関数
function selectChoice(choiceIndex) {
    if (isGameDisabled) return;
    
    gameState.selectedChoice = choiceIndex;
    
    // 選択状態をUI上で表示
    const options = document.querySelectorAll('.choice-option');
    options.forEach((option, index) => {
        option.classList.toggle('selected', index === choiceIndex);
    });
    
    // 選択後、自動的に答えを提出
    setTimeout(() => {
        submitChoiceAnswer();
    }, 500);
}

function submitChoiceAnswer() {
    if (isGameDisabled) return;
    if (!gameState.currentPuzzle || gameState.selectedChoice === null) return;
    
    const puzzle = gameState.currentPuzzle;
    
    if (gameState.selectedChoice === puzzle.correctChoice) {
        addMessage("正解！パズルを解いた！");
        addMessage("謎が解けると、魔力が弱まったようだ...");
        gameState.solvedPuzzles.push(puzzle.id);
        
        // 紙片パズルの場合の特別処理
        if (puzzle.paperReward && gameState.paperPuzzleReward) {
            gameState.collectedPapers.push(gameState.paperPuzzleReward);
            addMessage("封印が解けて紙片を手に入れた！");
            showPaperNotification(gameState.paperPuzzleReward.number, gameState.paperPuzzleReward.character);
            gameState.paperPuzzleReward = null;
        }
        
        if (puzzle.onSolve) {
            puzzle.onSolve();
            updateInventoryDisplay();
        }
        
        updateRoomDisplay(rooms[gameState.currentRoom]);
        updateRoomNavigation();
        
        closePuzzle();
        playSuccessSound();
        
        if (!puzzle.paperReward) {
            addMessage("パズルのオブジェクトが消えた！");
        }
    } else {
        playFailureSound();
        addMessage("間違っている...何かが近づいてくる音がする。");
        
        // 見つかる確率システムを適用
        const isGameOver = handleMistake();
        
        // パズル画面の見つかる確率表示を更新
        updatePuzzleDiscoveryChance();
        
        if (!isGameOver) {
            addMessage("もう一度よく考えてみよう...");
            gameState.selectedChoice = null;
            // 選択状態をリセット
            const options = document.querySelectorAll('.choice-option');
            options.forEach(option => option.classList.remove('selected'));
        }
    }
}

// パターンパズル用の関数
function selectPatternCell(cellIndex) {
    if (isGameDisabled) return;
    
    if (!gameState.patternSequence) {
        gameState.patternSequence = [];
    }
    
    gameState.patternSequence.push(cellIndex);
    
    // セルをアクティブ状態にする
    const cells = document.querySelectorAll('.pattern-cell');
    cells[cellIndex].classList.add('active');
    
    // 順番を表示
    cells[cellIndex].innerHTML = `${gameState.currentPuzzle.symbols[cellIndex]}<br><small>${gameState.patternSequence.length}</small>`;
    
    // パターンが完成したか確認
    if (gameState.patternSequence.length === gameState.currentPuzzle.pattern.length) {
        setTimeout(() => {
            submitPatternAnswer();
        }, 500);
    }
}

function submitPatternAnswer() {
    if (isGameDisabled) return;
    if (!gameState.currentPuzzle || !gameState.patternSequence) return;
    
    const puzzle = gameState.currentPuzzle;
    const isCorrect = gameState.patternSequence.every((cell, index) => 
        cell === puzzle.pattern[index]
    );
    
    if (isCorrect) {
        // 正解の場合
        const cells = document.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            cell.classList.remove('active');
            cell.classList.add('correct');
        });
        
        setTimeout(() => {
            addMessage("正解！パズルを解いた！");
            addMessage("謎が解けると、魔力が弱まったようだ...");
            gameState.solvedPuzzles.push(puzzle.id);
            
            // 紙片パズルの場合の特別処理
            if (puzzle.paperReward && gameState.paperPuzzleReward) {
                gameState.collectedPapers.push(gameState.paperPuzzleReward);
                addMessage("封印が解けて紙片を手に入れた！");
                showPaperNotification(gameState.paperPuzzleReward.number, gameState.paperPuzzleReward.character);
                gameState.paperPuzzleReward = null;
            }
            
            if (puzzle.onSolve) {
                puzzle.onSolve();
                updateInventoryDisplay();
            }
            
            updateRoomDisplay(rooms[gameState.currentRoom]);
            updateRoomNavigation();
            
            closePuzzle();
            playSuccessSound();
            
            if (!puzzle.paperReward) {
                addMessage("パズルのオブジェクトが消えた！");
            }
        }, 1000);
    } else {
        // 不正解の場合
        const cells = document.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            cell.classList.remove('active');
            cell.classList.add('incorrect');
        });
        
        setTimeout(() => {
            playFailureSound();
            addMessage("間違っている...何かが近づいてくる音がする。");
            
            // 見つかる確率システムを適用
            const isGameOver = handleMistake();
            
            // パズル画面の見つかる確率表示を更新
            updatePuzzleDiscoveryChance();
            
            if (!isGameOver) {
                addMessage("もう一度よく考えてみよう...");
                
                // パターンをリセット
                gameState.patternSequence = [];
                cells.forEach((cell, index) => {
                    cell.classList.remove('incorrect');
                    cell.innerHTML = puzzle.symbols[index];
                });
            }
        }, 1000);
    }
}

// 半角・全角文字を正規化する関数
function normalizeText(text) {
    if (!text) return '';
    
    return text
        .toLowerCase()
        .trim()
        // 全角英数字を半角に変換
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        })
        // 全角スペースを半角スペースに変換
        .replace(/　/g, ' ')
        // 全角記号を半角記号に変換
        .replace(/！/g, '!')
        .replace(/？/g, '?')
        .replace(/．/g, '.')
        .replace(/，/g, ',')
        .replace(/：/g, ':')
        .replace(/；/g, ';')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/［/g, '[')
        .replace(/］/g, ']')
        .replace(/｛/g, '{')
        .replace(/｝/g, '}')
        .replace(/＜/g, '<')
        .replace(/＞/g, '>')
        .replace(/＠/g, '@')
        .replace(/＃/g, '#')
        .replace(/＄/g, '$')
        .replace(/％/g, '%')
        .replace(/＆/g, '&')
        .replace(/＊/g, '*')
        .replace(/＋/g, '+')
        .replace(/－/g, '-')
        .replace(/＝/g, '=')
        .replace(/～/g, '~')
        .replace(/＾/g, '^')
        .replace(/＿/g, '_')
        .replace(/｜/g, '|')
        .replace(/＼/g, '\\')
        .replace(/／/g, '/')
        .replace(/｀/g, '`')
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/'/g, "'");
}

function submitPuzzleAnswer() {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    if (!gameState.currentPuzzle) return;
    
    const userInput = document.getElementById('puzzle-answer').value;
    const normalizedAnswer = normalizeText(userInput);
    const normalizedCorrectAnswer = normalizeText(gameState.currentPuzzle.answer);
    
    if (normalizedAnswer === normalizedCorrectAnswer) {
        addMessage("正解！パズルを解いた！");
        addMessage("謎が解けると、魔力が弱まったようだ...");
        gameState.solvedPuzzles.push(gameState.currentPuzzle.id);
        
        if (gameState.currentPuzzle.onSolve) {
            gameState.currentPuzzle.onSolve();
            updateInventoryDisplay();
            
            // 最終儀式の場合はマルチエンディング判定
            if (gameState.currentPuzzle.id === "final_ritual") {
                // エンディングタイプを判定
                let endingType = 'default';
                
                // パーフェクトエンディング：全パズル解決 + 手紙発見
                const allPuzzlesSolved = [
                    "painting_puzzle", "mirror_puzzle", "diary_puzzle", 
                    "formula_puzzle", "family_puzzle", "herb_puzzle"
                ].every(id => gameState.solvedPuzzles.includes(id));
                
                const hasLetter = gameState.acquiredItems.includes("letter");
                
                if (allPuzzlesSolved && hasLetter) {
                    endingType = 'perfect';
                } else if (allPuzzlesSolved) {
                    endingType = 'knowledge';
                }
                
                // 少し遅延してからエンディング画面へ
                setTimeout(() => {
                    endGame(true, endingType);
                }, 2000);
                return;
            }
        }
        
        updateRoomDisplay(rooms[gameState.currentRoom]);
        updateRoomNavigation();
        
        closePuzzle();
        playSuccessSound();
        
        addMessage("パズルのオブジェクトが消えた！");
        
    } else {
        playFailureSound();
        addMessage("間違っている...何かが近づいてくる音がする。");
        
        // 見つかる確率システムを適用
        const isGameOver = handleMistake();
        
        // パズル画面の見つかる確率表示を更新
        updatePuzzleDiscoveryChance();
        
        if (!isGameOver) {
            addMessage("もう一度よく考えてみよう...");
        }
    }
}

// メッセージ管理
function queueMessage(message) {
    // プレイヤーの行動や思考に関するメッセージのみをフィルタリング
    if (isPlayerMessage(message)) {
    if (!gameState.messageQueue) {
        gameState.messageQueue = [];
    }
    gameState.messageQueue.push(message);
    if (!gameState.isShowingMessages) {
        processMessageQueue();
        }
    }
}

// プレイヤーの行動や思考のみを記録する関数
function addPlayerThought(message) {
    if (!gameState.messageQueue) {
        gameState.messageQueue = [];
    }
    gameState.messageQueue.push(message);
    if (!gameState.isShowingMessages) {
        processMessageQueue();
    }
}

// プレイヤーメッセージかどうかを判定する関数
function isPlayerMessage(message) {
    // プレイヤーの行動を表すキーワード
    const actionKeywords = [
        "を選択した", "の選択を解除した", "を手に入れた", "に移動した", "に入った",
        "を調べた", "を使った", "を開けた", "を置いた", "を発見した"
    ];
    
    // プレイヤーの思考・感情を表すキーワード
    const thoughtKeywords = [
        "危なかった", "気を付けよう", "注意が必要", "危険", "よく考えて",
        "かもしれない", "だろうか", "ようだ", "みたい", "らしい",
        "...」", "思う", "感じる", "見える", "聞こえる"
    ];
    
    // 除外するシステムメッセージのキーワード
    const systemKeywords = [
        "が光り", "が現れた", "が開かれた", "にアクセス", "【部屋開放】", "【脱出可能】",
        "エドワード：", "という言葉が", "が響き渡る", "に包まれる", "の封印",
        "温かい光", "血のように", "青白く光", "金色に光"
    ];
    
    // システムメッセージは除外
    if (systemKeywords.some(keyword => message.includes(keyword))) {
        return false;
    }
    
    // プレイヤーの行動や思考メッセージは表示
    return actionKeywords.some(keyword => message.includes(keyword)) ||
           thoughtKeywords.some(keyword => message.includes(keyword)) ||
           message.includes("💡") || // ヒント
           message.includes("★") || // エンディング関連
           message.includes("まず") || message.includes("もう一度");
}

function processMessageQueue() {
    if (!gameState.messageQueue || gameState.messageQueue.length === 0) {
        gameState.isShowingMessages = false;
        return;
    }
    
    gameState.isShowingMessages = true;
    const message = gameState.messageQueue.shift();
    displayMessage(message);
    
    // 次のメッセージを0.5秒後に表示（1.5秒から短縮）
    setTimeout(() => {
        processMessageQueue();
    }, 500);
}

function displayMessage(message) {
    const messageText = document.getElementById('message-text');
    const timestamp = new Date().toLocaleTimeString();
    const newMessage = `<div>[${timestamp}] ${message}</div>`;
    
    // 新しいメッセージを一番上に追加
    messageText.innerHTML = newMessage + messageText.innerHTML;
    
    // メッセージが多すぎる場合は古いものを削除（最大50件）
    const messages = messageText.children;
    if (messages.length > 50) {
        for (let i = messages.length - 1; i >= 50; i--) {
            messageText.removeChild(messages[i]);
        }
    }
}

// 即座にメッセージを表示する関数（プレイヤーの思考のみ）
function addMessage(message) {
    if (isPlayerMessage(message)) {
    displayMessage(message);
    }
}

// createHorrorEffect関数は削除されました

// ゲーム終了を即座に処理（マルチエンディング対応）
function endGame(success, endingType = 'default') {
    // ジャンプスケア画像を必ず非表示にする
    const overlay = document.getElementById('jumpscare-overlay');
    const img = document.getElementById('jumpscare-img');
    if (overlay) overlay.style.display = 'none';
    if (img) img.classList.remove('show');
    // 即座に画面切り替え
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('puzzle-screen').classList.remove('active');
    if (success) {
        // 脱出成功時の効果音を再生
        playVictorySound();
        
        document.getElementById('ending-screen').classList.add('active');
        
        // マルチエンディング分岐
        if (endingType === 'perfect') {
            // パーフェクトエンディング（全パズル解決、手紙発見）
            showStoryNotification(`<strong>真のエンディング：「償いの解放」</strong><br/>
                        エドワードの魂を解放し、家族への手紙も見つけた。<br/>
                        『愛する人への最後の言葉を届けてくれて、ありがとう...』<br/>
                        エドワードは妻と娘の幻影に包まれ、共に光の中へ消えていく...`);
            addMessage("★★★ 真のエンディング達成！ ★★★");
            addMessage("エドワードの魂だけでなく、家族への愛も解放した...");
            addMessage("エドワード：『これで私は本当に自由だ...』");
            addMessage("館の外で三人の霊が手を取り合っているのが見えた。");
        } else if (endingType === 'knowledge') {
            // 知識エンディング（全パズル解決）
            showStoryNotification(`<strong>賢者のエンディング：「知識の継承」</strong><br/>
                        エドワードの錬金術の秘密を全て解き明かした。<br/>
                        『私の知識を受け継ぐ者よ、この力を正しく使うのだ...』<br/>
                        古代の叡智があなたの心に宿り、新たな力を得た...`);
            addMessage("★★ 賢者のエンディング達成！ ★★");
            addMessage("エドワードの全ての知識を受け継いだ...");
            addMessage("あなたは錬金術の奥義を体得した。");
            addMessage("この力をどう使うかは、あなた次第だ...");
        } else {
            // ノーマルエンディング（基本的な脱出）- パターンに応じて分岐
            const currentPattern = ritualPatterns[gameState.currentRitualPattern];
            
            if (currentPattern.type === "horror") {
                // ホラーエンディング
                showStoryNotification(`<strong>ホラーエンディング：「呪いの継承」</strong><br/>
                            館からは脱出したが、エドワードの呪いはあなたの中に宿っている...<br/>
                            闇の知識があなたの心を蝕み始めた。この呪いは永遠に続くのだ...`);
                addMessage("館から脱出したが...何かが違う。");
                addMessage("あなたの影が異様に長く、蠢いているように見える...");
                addMessage("エドワード：『君も私と同じ道を歩むことになる...』");
                addMessage("【警告】呪いはあなたの中に宿った。この悪夢は続く...");
            } else {
                // 救済エンディング
                showStoryNotification(`<strong>救済エンディング：「光の解放」</strong><br/>
                            エドワードの魂を救い、館からの脱出に成功！<br/>
                            温かい光に包まれ、すべての呪いが浄化された...`);
                addMessage("おめでとう！エドワードの魂を救い、館からの脱出に成功した！");
                addMessage("館の外に出ると、温かい光が差し込んでいる。");
            addMessage("エドワード：『ありがとう...これで私も安らかに眠れる...』");
                addMessage("【祝福】あなたは光の力を得た。この経験は糧となるだろう。");
            }
        }
    } else {
        // ジャンプスケアは既にhandleMistakeで表示済みなので、ここでは表示しない
        // 怖いゲームオーバー演出
        document.body.style.backgroundColor = '#000000';
        document.body.style.transition = 'background-color 2s ease';
        setTimeout(() => {
            document.getElementById('gameover-screen').classList.add('active');
            // ... 既存の怖いストーリーやメッセージ ...
            showStoryNotification(`<strong>GAME OVER</strong><br/>
                        <span style="color: #ff0000; text-shadow: 0 0 10px #ff0000;">エドワードの亡霊があなたを見つけた...</span><br/>
                        <span style="color: #666666;">あなたの魂は永遠に館に囚われ、</span><br/>
                        <span style="color: #666666;">新たな彷徨う霊となる運命に...</span><br/>
                        <span style="color: #ff4444;">もう二度と外の世界に戻ることはない。</span>`);
            const terrorMessages = [
                "GAME OVER...",
                "エドワードの冷たい視線があなたを貫く...",
                "体温が急激に下がっていく...",
                "あなたの魂が体から離れていく...",
                "館があなたを永遠に束縛する...",
                "Welcome to your eternal home...",
                "あなたも館の住人の一人となった。"
            ];
            terrorMessages.forEach((message, index) => {
                setTimeout(() => {
                    addMessage(message);
                }, index * 1000);
            });
            setTimeout(() => {
                document.body.style.backgroundColor = '';
                document.body.style.transition = '';
            }, 3000);
        }, 500);
        // playJumpScare(); ← 2回目のジャンプスケア音は鳴らさない
    }
    isAudioPlaying = false;
}

// ゲーム再開
function restartGame() {
    // ゲーム無効化をリセット
    isGameDisabled = false;
    
    // UIを有効化
    enableGameUI();
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById('title-screen').classList.add('active');
    
    // ランダムに儀式パターンを選択
    const randomPattern = Math.floor(Math.random() * ritualPatterns.length);
    
    gameState = {
        currentRoom: 0,
        inventory: [],
        selectedObject: null,
        selectedItem: null,
        discoveryChance: 0,
        solvedPuzzles: [],
        acquiredItems: [], // 取得済みアイテムIDを永続的に追跡
        visitedRooms: [], // 訪問済み部屋を追跡
        collectedPapers: [], // 集めた紙片情報
        currentRitualPattern: randomPattern, // 選択されたパターン
        rareItemLocations: {}, // ランダム配置されたレアアイテムの位置 {objectId: rareItemId}
        checkedEmptyLocations: [], // 調べて空だった場所のリスト
        gameFlags: {
            mirrorActivated: false,
            passageFound: false,
            undergroundAccess: false,
            skeletonExamined: false,
            symbolsDecoded: false,
            altarActivated: false,
            formulaDecoded: false,
            canEscape: false,
            ritualCompleted: false,
            laboratoryAccess: false,
            greenhouseAccess: false,
            bedroomAccess: false,
            familyPuzzleSolved: false,
            herbPuzzleSolved: false,
            libraryAccess: false,
            mapFound: false,
            alternatePassageFound: false,
            lifeSecretRevealed: false,
            // 鍵による扉開錠フラグ
            libraryDoorUnlocked: false,
            laboratoryDoorUnlocked: false,
            cellarAccess: false
        }
    };
    
    isAudioPlaying = false;
    
    // UI要素のリセット
    document.getElementById('message-text').innerHTML = '';
    document.getElementById('inventory-items').innerHTML = '';
    document.getElementById('interactive-objects').innerHTML = '';
    
    // ストーリー通知を閉じる
    const storyNotificationElement = document.getElementById('story-notification');
    if (storyNotificationElement) {
        storyNotificationElement.classList.add('hidden');
    }
    
    // 選択されたパターンに基づいて部屋のオブジェクトを更新
    updateRoomObjectsForPattern();
    
    // レアアイテムをランダムに配置
    gameState.rareItemLocations = generateRandomItemPlacements();
    
    updateInventoryDisplay();
    updateSelectedObjectDisplay();
    
    // 部屋名表示をリセット
    const roomDisplay = document.getElementById('current-room-display');
    if (roomDisplay) {
        roomDisplay.textContent = '現在の部屋: 玄関ホール';
    }
    
    // ストーリーオーバーレイを完全にリセット
    const storyOverlay = document.getElementById('story-overlay');
    const storyNotificationReset = document.getElementById('story-notification');
    if (storyOverlay) {
        storyOverlay.style.display = 'none';
    }
    if (storyNotificationReset) {
        storyNotificationReset.classList.add('hidden');
    }
    
    // ストーリーコンテンツをクリア
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
        storyContent.innerHTML = '';
        storyContent.classList.remove('typing-complete');
    }
    
    // 玄関ホールをロードしてストーリーを表示
    loadRoom(0);
}

// オブジェクト用ツールチップ機能
function showObjectTooltip(event, text, isQuizLocation = false) {
    hideObjectTooltip(); // 既存のツールチップを削除
    
    const tooltip = document.createElement('div');
    tooltip.className = 'object-tooltip';
    tooltip.textContent = text;
    tooltip.id = 'object-tooltip';
    
    if (isQuizLocation) {
        tooltip.classList.add('quiz-location');
    }
    
    const gameContainer = document.getElementById('game-container');
    const rect = event.target.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    
    // ツールチップの位置を計算（オブジェクトの上に表示）
    tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - containerRect.top - 10}px`;
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    
    gameContainer.appendChild(tooltip);
    
    // アニメーション用に少し遅延して表示
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 50);
}

function hideObjectTooltip() {
    const existingTooltip = document.getElementById('object-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// 部屋初回訪問時のストーリー表示機能
function showStoryForRoom(roomId) {
    const storyTexts = {
        0: `<strong>玄関ホール</strong>

古い洋館の玄関。
100年前に消えた錬金術師エドワード・グレイの屋敷だ。

壁には彼の肖像画が飾られ、
その目が今でもあなたを見つめている...`,
            
        1: `<strong>エドワードの私室</strong>

エドワードが生前使っていた書斎兼研究室。

本棚には錬金術の書物が並び、
机には暗号で書かれた日記が残されている。`,
            
        2: `<strong>秘密の書斎</strong>

隠し扉の奥にある秘密の部屋。

ここでエドワードは禁断の実験を行っていたようだ。
生命の公式が壁に描かれている。`,
            
        3: `<strong>地下通路</strong>

館の地下に続く薄暗い通路。

この先に最後の実験室があるはずだが、
骸骨が道を塞いでいる...`,
            
        4: `<strong>古い温室</strong>

館の裏にある朽ち果てた温室。

かつてはエドワードが薬草栽培を行っていたが、
今は枯れた植物と不気味な蔓で覆われている...`,
            
        5: `<strong>地下実験室</strong>

エドワードが最期を迎えた場所。

古代の祭壇があり、ここで彼は永遠の命を求めて
実験を続けていた。魂を解放するには儀式が必要だ。`,
            
        6: `<strong>エドワードの寝室</strong>

館の2階にあるエドワードの私的な寝室。

家族の肖像画が飾られ、
彼の最後の夜の痕跡が残っている...`,
            
        7: `<strong>大図書館</strong>

館の北翼にある巨大な図書館。

天井まで届く書棚には古代から現代までの書物が並び、
エドワードの知識の集大成がここに眠っている。`,
            
        8: `<strong>地下貯蔵庫</strong>

館の地下深くにある古い貯蔵庫。

ワインや食料が保管されていたが、
今は時の止まった静寂に包まれている...`
    };
    
    const storyText = storyTexts[roomId];
    if (storyText) {
        showStoryNotification(storyText);
    }
}

// ストーリー通知を表示（タイピングアニメーション付き）
function showStoryNotification(storyText) {
    const notification = document.getElementById('story-notification');
    const content = document.getElementById('story-content');
    const overlay = document.getElementById('story-overlay');
    
    if (notification && content && overlay) {
        // オーバーレイを表示（ゲーム画面を暗くする）
        overlay.style.display = 'flex';
        
        // 通知を表示
        notification.classList.remove('hidden');
        
        // タイピングアニメーション開始
        typeText(content, storyText);
    }
}

// タイピングアニメーション関数
function typeText(element, text, speed = 50) {
    element.innerHTML = '';
    element.classList.remove('typing-complete');
    
    let index = 0;
    
    function typeNextChar() {
        if (index < text.length) {
            // HTMLタグを処理する場合の対応
            if (text.charAt(index) === '<') {
                const tagEnd = text.indexOf('>', index);
                if (tagEnd !== -1) {
                    element.innerHTML += text.substring(index, tagEnd + 1);
                    index = tagEnd + 1;
                } else {
                    element.innerHTML += text.charAt(index);
                    index++;
                }
            } else {
                element.innerHTML += text.charAt(index);
                index++;
            }
            
            setTimeout(typeNextChar, speed);
        } else {
            // タイピング完了
            element.classList.add('typing-complete');
        }
    }
    
    typeNextChar();
}

// 紙片通知を表示
function showPaperNotification(number, character) {
    const notification = document.getElementById('story-notification');
    const content = document.getElementById('story-content');
    const overlay = document.getElementById('story-overlay');
    
    if (notification && content && overlay) {
        // オーバーレイを表示（ゲーム画面を暗くする）
        overlay.style.display = 'flex';
        
        // 完全に中央揃えのレイアウトを作成
        content.innerHTML = `
<div style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    gap: 15px;
">
    <div style="
        font-size: 1.5rem;
        color: #ff6666;
        font-weight: bold;
        text-align: center;
    ">古い紙片を発見！</div>
    
    <div style="
        font-size: 3rem;
        color: #ffdd00;
        font-weight: bold;
        text-align: center;
        text-shadow: 0 0 10px #ffdd00;
    ">${number}番目: 「${character}」</div>
    
    <div style="
        font-size: 1rem;
        color: #cccccc;
        text-align: center;
    ">${gameState.collectedPapers.length}/5枚の紙片を集めました</div>
</div>
        `;
        notification.classList.remove('hidden');
    }
}

// ストーリー通知を閉じる（グローバル関数）
window.closeStoryNotification = function() {
    const notification = document.getElementById('story-notification');
    const overlay = document.getElementById('story-overlay');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    if (notification) {
        notification.classList.add('hidden');
    }
}

// 部屋移動ボタンの更新
function updateRoomNavigation() {
    const navContainer = document.getElementById('room-nav-buttons');
    if (!navContainer) return;
    
    navContainer.innerHTML = '';
    
    rooms.forEach((room, index) => {
        if (canMoveToRoom(index)) {
            const button = document.createElement('button');
            button.className = 'room-nav-btn';
            if (index === gameState.currentRoom) {
                button.classList.add('current-room');
            }
            button.textContent = room.name;
            button.onclick = () => moveToRoom(index);
            
            // タッチデバイス用のイベント追加
            button.addEventListener('touchstart', (e) => {
                e.preventDefault(); // デフォルトのタッチ動作を防止
                moveToRoom(index);
            });
            navContainer.appendChild(button);
        }
    });
    
    // 方向矢印も更新
    updateDirectionArrows();
}

// 方向矢印の更新
function updateDirectionArrows() {
    // 部屋の方向マッピング
    const roomDirections = {
        0: { // 玄関ホール
            up: 6,    // エドワードの寝室（2階）
            down: 3,  // 地下通路
            left: 1,  // 私室
            right: 4  // 温室
        },
        1: { // 私室
            up: 6,    // エドワードの寝室
            down: null,
            left: null,
            right: 0  // 玄関ホール
        },
        2: { // 秘密の書斎
            up: null,
            down: null,
            left: 1,  // 私室
            right: null
        },
        3: { // 地下通路
            up: 0,    // 玄関ホール
            down: 5,  // 地下実験室
            left: null,
            right: null
        },
        4: { // 温室
            up: null,
            down: null,
            left: 0,  // 玄関ホール
            right: null
        },
        5: { // 地下実験室
            up: 3,    // 地下通路
            down: null,
            left: null,
            right: null
        },
        6: { // エドワードの寝室
            up: 7,    // 大図書館
            down: 0,  // 玄関ホール
            left: 1,  // 私室
            right: 4  // 温室
        },
        7: { // 大図書館
            up: null,
            down: 6,  // エドワードの寝室
            left: null,
            right: 8  // 地下貯蔵庫
        },
        8: { // 地下貯蔵庫
            up: null,
            down: 3,  // 地下通路
            left: 7,  // 大図書館
            right: null
        }
    };
    
    const directions = ['up', 'down', 'left', 'right'];
    const currentRoomDirections = roomDirections[gameState.currentRoom] || {};
    
    directions.forEach(direction => {
        const arrow = document.getElementById(`arrow-${direction}`);
        if (!arrow) return;
        
        const targetRoom = currentRoomDirections[direction];
        
        if (targetRoom !== null && targetRoom !== undefined && canMoveToRoom(targetRoom)) {
            // アクセス可能な部屋のみ表示
            arrow.classList.add('visible');
            arrow.classList.remove('disabled');

            arrow.onclick = () => {
                playButtonClickSound();
                moveToRoom(targetRoom);
            };
            
            // タッチデバイス用のイベント追加
            arrow.addEventListener('touchstart', (e) => {
                e.preventDefault(); // デフォルトのタッチ動作を防止
                playButtonClickSound();
                moveToRoom(targetRoom);
            });
            
            // カスタムツールチップイベント
            arrow.onmouseenter = (e) => showArrowTooltip(e, rooms[targetRoom].name, true);
            arrow.onmouseleave = hideArrowTooltip;
            arrow.onmousemove = (e) => updateArrowTooltipPosition(e);
        } else {
            // アクセスできない部屋や存在しない部屋は表示しない
            arrow.classList.remove('visible');
            arrow.classList.add('disabled');

            arrow.onclick = null;
            arrow.onmouseenter = null;
            arrow.onmouseleave = null;
            arrow.onmousemove = null;
        }
    });
    
    // 部屋が変わる／矢印更新時にツールチップを必ず隠す
    hideArrowTooltip();
}

// 矢印ツールチップを表示する関数
function showArrowTooltip(event, roomName, accessible) {
    const tooltip = document.getElementById('arrow-tooltip');
    if (!tooltip) return;
    
    const text = accessible ? `${roomName}へ移動` : `${roomName}（移動不可）`;
    tooltip.textContent = text;
    
    // スタイルクラスを設定
    tooltip.classList.remove('accessible', 'blocked');
    tooltip.classList.add(accessible ? 'accessible' : 'blocked');
    
    // 位置を設定
    updateArrowTooltipPosition(event);
    
    // 表示
    tooltip.classList.add('show');
}

// 矢印ツールチップの位置を更新する関数
function updateArrowTooltipPosition(event) {
    const tooltip = document.getElementById('arrow-tooltip');
    if (!tooltip) return;
    
    const gameArea = document.getElementById('game-area');
    const rect = gameArea.getBoundingClientRect();
    
    // マウス位置を取得（ゲームエリア内での相対位置）
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // ゲーム画面の中心座標
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // ツールチップのサイズを考慮して位置調整
    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || 150; // デフォルト幅
    const tooltipHeight = tooltipRect.height || 40; // デフォルト高さ
    
    let left, top;
    
    // 矢印の位置に応じてツールチップを中央に向けて配置
    if (x < centerX / 2) {
        // 左側の矢印 - ツールチップを右側（中央寄り）に表示
        left = x + 50;
    } else if (x > rect.width - centerX / 2) {
        // 右側の矢印 - ツールチップを左側（中央寄り）に表示
        left = x - tooltipWidth - 50;
    } else {
        // 中央付近の矢印 - 通常の位置調整
        left = x - tooltipWidth / 2;
    }
    
    if (y < centerY / 2) {
        // 上側の矢印 - ツールチップを下側（中央寄り）に表示
        top = y + 50;
    } else if (y > rect.height - centerY / 2) {
        // 下側の矢印 - ツールチップを上側（中央寄り）に表示
        top = y - tooltipHeight - 50;
    } else {
        // 中央付近の矢印 - 通常の位置調整
        top = y - tooltipHeight / 2;
    }
    
    // 画面境界での最終調整
    left = Math.max(10, Math.min(left, rect.width - tooltipWidth - 10));
    top = Math.max(10, Math.min(top, rect.height - tooltipHeight - 10));
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

// 矢印ツールチップを隠す関数
function hideArrowTooltip() {
    const tooltip = document.getElementById('arrow-tooltip');
    if (!tooltip) return;
    
    tooltip.classList.remove('show');
}

// 部屋移動機能
function moveToRoom(roomId) {
    if (isGameDisabled) return; // ゲーム無効化中は処理しない
    
    if (roomId === gameState.currentRoom) {
        addPlayerThought("すでにその部屋にいる。");
        playFailureSound();
        return;
    }
    
    if (canMoveToRoom(roomId)) {
        playButtonClickSound();
        loadRoom(roomId); // 遅延なしで即座に実行
        addPlayerThought(`${rooms[roomId].name}に移動した。`);
        hideArrowTooltip();
    } else {
        addPlayerThought("その部屋には移動できない。必要な条件を満たしていないようだ。");
        playFailureSound();
    }
}

function canMoveToRoom(roomId) {
    // 玄関ホール（0）にはいつでも戻れる
    if (roomId === 0) return true;
    
    // 見取り図を見つけた場合は全ての部屋に移動可能
    if (gameState.gameFlags.mapFound) return true;
    
    // 個別の移動条件
    switch(roomId) {
        case 1: // 私室（鍵で解錠後のみ）
            return gameState.gameFlags.libraryDoorUnlocked;
        case 2: // 秘密の書斎
            return gameState.gameFlags.passageFound || 
                   gameState.gameFlags.alternatePassageFound ||
                   gameState.currentRoom === 1 ||
                   gameState.solvedPuzzles.includes("diary_puzzle"); // 日記のパズルでも開放
        case 3: // 地下通路
            return gameState.gameFlags.undergroundAccess || 
                   gameState.gameFlags.alternatePassageFound ||
                   gameState.solvedPuzzles.includes("formula_puzzle") ||
                   gameState.solvedPuzzles.includes("mirror_puzzle"); // 鏡のパズルでも開放
        case 4: // 古い温室
            return gameState.gameFlags.greenhouseAccess ||
                   gameState.solvedPuzzles.includes("family_puzzle") ||
                   gameState.currentRoom === 6; // 寝室からも移動可能
        case 5: // 地下実験室（黄金の鍵で解錠後のみ）
            return gameState.gameFlags.laboratoryDoorUnlocked;
        case 6: // エドワードの寝室
            return gameState.gameFlags.bedroomAccess ||
                   gameState.solvedPuzzles.includes("mirror_puzzle") ||
                   gameState.solvedPuzzles.includes("family_puzzle") ||
                   gameState.currentRoom === 1; // 私室からも移動可能
        case 7: // 大図書館
            return gameState.gameFlags.libraryAccess ||
                   gameState.solvedPuzzles.includes("bookshelf_puzzle") ||
                   gameState.solvedPuzzles.includes("painting_puzzle") || // 肖像画パズル解決でも開放
                   gameState.currentRoom === 6; // 寝室からも移動可能
        case 8: // 地下貯蔵庫
            return gameState.gameFlags.cellarAccess ||
                   gameState.solvedPuzzles.includes("symbol_puzzle") ||
                   gameState.solvedPuzzles.includes("cipher_puzzle") || // ワイン樽の暗号解決で開放
                   gameState.solvedPuzzles.includes("bookshelf_puzzle") || // 本棚パズル解決で開放
                   gameState.currentRoom === 7 || // 図書館からも移動可能
                   gameState.currentRoom === 3;   // 地下通路からも移動可能
        default:
            return false;
    }
}

// アイテムの正しい部屋をチェックする関数
function getCorrectRoomForItem(itemId) {
    const itemRoomMap = {
        "candlestick": 0,      // 玄関ホール
        "library_key": 0,      // 玄関ホール
        "small_key": 1,        // 私室
        "golden_key": 3,       // 地下通路
        "tome": 2,             // 秘密の書斎
        "crystal": 4,          // 地下実験室（最終儀式のみ）
        "knowledge": 4         // 地下実験室（最終儀式のみ）
    };
    return itemRoomMap[itemId] !== undefined ? itemRoomMap[itemId] : -1;
}

// アイテムと対象の正しい組み合わせをチェックする関数
function isCorrectTarget(itemId, targetId) {
    const validCombinations = {
        "candlestick": ["mirror"],
        "library_key": ["door_library"],
        "small_key": ["desk"],
        "golden_key": ["door"], // 地下通路の扉
        "tome": ["symbols"],
        "crystal": ["altar"],   // 最終儀式でのみ
        "knowledge": ["altar"]  // 最終儀式でのみ
    };
    
    return validCombinations[itemId] && validCombinations[itemId].includes(targetId);
} 

// ランダムアイテム配置可能なオブジェクトのリスト（必須アイテムを除外）
const randomItemLocations = [
    // 玄関ホール
    { roomId: 0, objectId: "hall_drawer" },
    
    // 私室
    { roomId: 1, objectId: "desk" },
    { roomId: 1, objectId: "library_box" },
    
    // 秘密の書斎
    { roomId: 2, objectId: "tome" }, // 禁断の書を調べる際にランダムアイテムも
    
    // 地下通路
    { roomId: 3, objectId: "skeleton" }, // 骸骨を調べる際に
    
    // 古い温室
    { roomId: 4, objectId: "broken_pot" },
    { roomId: 4, objectId: "vines" },
    
    // 地下実験室
    { roomId: 5, objectId: "lab_cabinet" },
    
    // エドワードの寝室
    { roomId: 6, objectId: "old_bed" },
    { roomId: 6, objectId: "dresser" },
    
    // 大図書館
    { roomId: 7, objectId: "reading_desk" },
    { roomId: 7, objectId: "ancient_safe" },
    { roomId: 7, objectId: "library_ladder" },
    
    // 地下貯蔵庫
    { roomId: 8, objectId: "storage_box" },
    { roomId: 8, objectId: "wine_cipher" }
];

// レアアイテムの出現確率を調整（より見つけやすく）
const rarityChances = {
    "common": 0.25,     // 25% (増加)
    "uncommon": 0.15,   // 15% (増加)
    "rare": 0.08,       // 8% (増加)
    "legendary": 0.03   // 3% (増加)
};

// レアアイテムをランダムに配置する関数
function generateRandomItemPlacements() {
    const placements = {};
    
    // 配置可能な場所をシャッフル
    const availableLocations = [...randomItemLocations];
    
    // 各場所について、レアアイテムが配置されるかチェック
    availableLocations.forEach(location => {
        const locationKey = `${location.roomId}_${location.objectId}`;
        
        // 各レアリティのアイテムをチェック（レア度の高い順）
        const sortedRarities = ["legendary", "rare", "uncommon", "common"];
        
        for (const rarity of sortedRarities) {
            if (Math.random() < rarityChances[rarity]) {
                // このレアリティのアイテムから1つ選択
                const itemsOfRarity = rareItems.filter(item => item.rarity === rarity);
                if (itemsOfRarity.length > 0) {
                    const selectedItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
                    placements[locationKey] = selectedItem.id;
                    break; // 1つの場所には1つのアイテムのみ
                }
            }
        }
    });
    
    // デバッグ用：配置されたアイテムをコンソールに出力
    console.log("配置されたレアアイテム:", placements);
    
    return placements;
}

// レアアイテムの効果を適用する関数
function applyRareItemEffect(itemId) {
    const item = rareItems.find(item => item.id === itemId);
    if (!item) return;
    
    if (item.effect === "discovery_reduction") {
        const oldChance = gameState.discoveryChance;
        gameState.discoveryChance = Math.max(0, gameState.discoveryChance - item.value);
        updateDiscoveryChance();
        
        let rarityText = "";
        let rarityColor = "";
        switch(item.rarity) {
            case "common": 
                rarityText = "（普通）"; 
                rarityColor = "🟢";
                break;
            case "uncommon": 
                rarityText = "（珍しい）"; 
                rarityColor = "🔵";
                break;
            case "rare": 
                rarityText = "（レア）"; 
                rarityColor = "🟣";
                break;
            case "legendary": 
                rarityText = "（伝説級）"; 
                rarityColor = "🟡";
                break;
        }
        
        queueMessage(`${rarityColor} ${item.name}${rarityText}を取得した！`);
        queueMessage(`💫 見つかる確率が${item.value}%減少！ (${oldChance}% → ${gameState.discoveryChance}%)`);
        
        // 特別なメッセージ
        if (gameState.discoveryChance <= 10) {
            queueMessage("🌟 非常に安全な状態になった！館の中を自由に探索できる。");
        } else if (gameState.discoveryChance <= 30) {
            queueMessage("✨ かなり安全になった。エドワードの気配が薄れている。");
        } else if (gameState.discoveryChance <= 50) {
            queueMessage("🔮 少し安全になった。まだ注意が必要だ。");
        }
        
        playSuccessSound();
    }
}

// パズル画面の見つかる％表示位置をフレームサイズに応じて動的調整
function adjustDiscoveryChancePosition() {
    const discoveryChance = document.getElementById('puzzle-discovery-chance');
    const puzzleContainer = document.getElementById('puzzle-container');
    
    if (!discoveryChance || !puzzleContainer) return;
    
    // フレームの位置とサイズを取得
    const containerRect = puzzleContainer.getBoundingClientRect();
    const screenHeight = window.innerHeight;
    
    // フレームの上端からもう少し上に配置
    const topPosition = containerRect.top - 120;
    
    // 画面からはみ出さないように調整
    const minTop = 20; // 画面上端から最低20px
    const finalTop = Math.max(topPosition, minTop);
    
    // 位置を設定（アニメーションなしで一瞬で変更）
    discoveryChance.style.transition = 'none'; // トランジションを無効化
    discoveryChance.style.top = `${finalTop}px`;
    // 完全に固定された左位置を設定（画面幅の中央から要素幅の半分を引く）
    const screenWidth = window.innerWidth;
    const elementWidth = 320; // CSS固定幅と同じ
    const leftPosition = (screenWidth - elementWidth) / 2;
    discoveryChance.style.left = `${leftPosition}px`;
    discoveryChance.style.transform = 'none'; // transformを完全に削除
    
    // 次回のためにトランジションを復元（少し遅延させて）
    requestAnimationFrame(() => {
        discoveryChance.style.transition = 'all 0.3s ease';
    });
}

// オブジェクトの表示サイズを決定する簡易ヘルパー
function getObjectSize(obj) {
    // キーワードごとのサイズマッピング
    const sizeMap = [
        { kw: ['ベッド', 'bed'], w: 160, h: 68 },
        { kw: ['ソファ', 'sofa'], w: 150, h: 60 },
        { kw: ['テーブル', 'table'], w: 140, h: 50 },
        { kw: ['棚', 'cabinet', 'bookshelf', '本棚'], w: 120, h: 55 },
        { kw: ['扉', 'door'], w: 110, h: 45 }
    ];

    for (const { kw, w, h } of sizeMap) {
        if (kw.some(k => obj.name.includes(k))) {
            return { width: w, height: h };
        }
    }

    // 小物は名前長に応じて可変
    const width = Math.min(160, 40 + (obj.name.length * 12));
    const height = 36 + Math.min(24, obj.name.length * 2);
    return { width, height };
}

// 名前を簡潔化する（余計な語を取り除き、最大5文字）
function generateShortName(name) {
    let short = name;

    // 所有者や形容詞的フレーズを取り除く
    const patterns = [
        /(.*?)(?:の|への)(.+)/, // 「◯◯の□□」→□□
    ];
    for (const p of patterns) {
        const match = short.match(p);
        if (match) {
            short = match[2];
        }
    }

    const removeWords = ['古い', '小さな', '錬金術の', '割れた', '壊れた', '異様な', '館'];
    removeWords.forEach(w => {
        short = short.replace(w, '');
    });

    short = short.trim();

    // 必要ならさらに5文字に切り詰め
    const max = 5;
    if (short.length > max) short = short.slice(0, max);

    return short || name.slice(0, max);
}

let isJumpscareActive = false;

function showJumpscareOverlay(duration = 1500) {
    const overlay = document.getElementById('jumpscare-overlay');
    const img = document.getElementById('jumpscare-img');
    if (!overlay || !img) return;
    overlay.style.display = 'flex';
    img.classList.remove('show');
    void img.offsetWidth;
    img.classList.add('show');
    setTimeout(() => {
        overlay.style.display = 'none';
        img.classList.remove('show');
    }, duration);
} 

// テスト用の強制表示コードを削除 