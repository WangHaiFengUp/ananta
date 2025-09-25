// 游戏站点JavaScript功能

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeGames();
    initializeSmoothScrolling();
});

// 初始化所有游戏
function initializeGames() {
    initClickGame();
    initMemoryGame();
    initGuessGame();
}

// 1. 点击游戏
function initClickGame() {
    const clickTarget = document.getElementById('clickTarget');
    const clickScore = document.getElementById('clickScore');
    const clickTimer = document.getElementById('clickTimer');
    
    let score = 0;
    let timeLeft = 10;
    let gameActive = false;
    let gameInterval;
    
    clickTarget.addEventListener('click', function() {
        if (!gameActive) {
            startClickGame();
        } else {
            score++;
            clickScore.textContent = score;
            
            // 添加点击效果
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        }
    });
    
    function startClickGame() {
        gameActive = true;
        score = 0;
        timeLeft = 10;
        clickScore.textContent = score;
        clickTimer.textContent = timeLeft;
        clickTarget.textContent = '快点击！';
        
        gameInterval = setInterval(() => {
            timeLeft--;
            clickTimer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endClickGame();
            }
        }, 1000);
    }
    
    function endClickGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clickTarget.textContent = `游戏结束！得分: ${score}`;
        
        setTimeout(() => {
            clickTarget.textContent = '点击开始新游戏';
            timeLeft = 10;
            clickTimer.textContent = timeLeft;
        }, 3000);
    }
}

// 2. 记忆游戏
function initMemoryGame() {
    const memoryCells = document.querySelectorAll('.memory-cell');
    const startMemoryBtn = document.getElementById('startMemory');
    const memoryLevel = document.getElementById('memoryLevel');
    
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let gameActive = false;
    let showingSequence = false;
    
    startMemoryBtn.addEventListener('click', startMemoryGame);
    
    memoryCells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (gameActive && !showingSequence) {
                handleCellClick(index);
            }
        });
    });
    
    function startMemoryGame() {
        level = 1;
        sequence = [];
        playerSequence = [];
        gameActive = true;
        memoryLevel.textContent = level;
        startMemoryBtn.textContent = '游戏中...';
        startMemoryBtn.disabled = true;
        
        nextLevel();
    }
    
    function nextLevel() {
        playerSequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        showSequence();
    }
    
    function showSequence() {
        showingSequence = true;
        let index = 0;
        
        const showNext = () => {
            if (index < sequence.length) {
                const cellIndex = sequence[index];
                const cell = memoryCells[cellIndex];
                
                cell.classList.add('active');
                setTimeout(() => {
                    cell.classList.remove('active');
                    index++;
                    setTimeout(showNext, 300);
                }, 500);
            } else {
                showingSequence = false;
            }
        };
        
        setTimeout(showNext, 500);
    }
    
    function handleCellClick(cellIndex) {
        playerSequence.push(cellIndex);
        
        // 检查当前点击是否正确
        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            endMemoryGame(false);
            return;
        }
        
        // 如果完成了当前序列
        if (playerSequence.length === sequence.length) {
            level++;
            memoryLevel.textContent = level;
            
            if (level > 10) {
                endMemoryGame(true);
            } else {
                setTimeout(nextLevel, 1000);
            }
        }
    }
    
    function endMemoryGame(won) {
        gameActive = false;
        showingSequence = false;
        
        if (won) {
            startMemoryBtn.textContent = '恭喜通关！';
        } else {
            startMemoryBtn.textContent = `游戏结束！到达关卡 ${level - 1}`;
        }
        
        setTimeout(() => {
            startMemoryBtn.textContent = '开始游戏';
            startMemoryBtn.disabled = false;
            memoryLevel.textContent = '1';
        }, 3000);
    }
}

// 3. 猜数字游戏
function initGuessGame() {
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const guessFeedback = document.getElementById('guessFeedback');
    const guessAttempts = document.getElementById('guessAttempts');
    
    let targetNumber = generateRandomNumber();
    let attempts = 0;
    let gameWon = false;
    
    guessBtn.addEventListener('click', makeGuess);
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
    
    function generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }
    
    function makeGuess() {
        if (gameWon) {
            resetGuessGame();
            return;
        }
        
        const guess = parseInt(guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            guessFeedback.textContent = '请输入1-100之间的数字！';
            guessFeedback.className = 'guess-feedback';
            return;
        }
        
        attempts++;
        guessAttempts.textContent = attempts;
        
        if (guess === targetNumber) {
            guessFeedback.textContent = `🎉 恭喜你猜对了！数字就是 ${targetNumber}！`;
            guessFeedback.className = 'guess-feedback correct';
            guessBtn.textContent = '再玩一次';
            gameWon = true;
        } else if (Math.abs(guess - targetNumber) <= 5) {
            guessFeedback.textContent = '很接近了！再试试看！';
            guessFeedback.className = 'guess-feedback close';
        } else if (guess < targetNumber) {
            guessFeedback.textContent = '太小了！试试更大的数字';
            guessFeedback.className = 'guess-feedback far';
        } else {
            guessFeedback.textContent = '太大了！试试更小的数字';
            guessFeedback.className = 'guess-feedback far';
        }
        
        guessInput.value = '';
        guessInput.focus();
    }
    
    function resetGuessGame() {
        targetNumber = generateRandomNumber();
        attempts = 0;
        gameWon = false;
        guessAttempts.textContent = attempts;
        guessFeedback.textContent = '开始猜测吧！';
        guessFeedback.className = 'guess-feedback';
        guessBtn.textContent = '猜测';
        guessInput.value = '';
        guessInput.focus();
    }
}

// 平滑滚动功能
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 添加一些有趣的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 为游戏卡片添加鼠标跟踪效果
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // 添加页面加载动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 观察所有游戏卡片
    gameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // 按空格键开始点击游戏
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const clickTarget = document.getElementById('clickTarget');
        if (clickTarget) {
            clickTarget.click();
        }
    }
    
    // 按R键重置猜数字游戏
    if (e.key.toLowerCase() === 'r' && e.target.tagName !== 'INPUT') {
        const guessBtn = document.getElementById('guessBtn');
        if (guessBtn && guessBtn.textContent === '再玩一次') {
            guessBtn.click();
        }
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // 为触摸设备优化点击游戏
    const clickTarget = document.getElementById('clickTarget');
    if (clickTarget) {
        clickTarget.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });
    }
}