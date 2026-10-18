/* ==========================================================================
   CONFIGURABLE BIRTHDAY SURPRISE SETTINGS
   ========================================================================== */
const birthdayConfig = {
    sisterName: "Smruti",
    nickname: "Doremon",
    birthday: "12 Dec 2026",
    passcode: "1212",
    yourName: "Your Brother",

    memories: [
        {
            image: "assets/photos/A.jpeg",
            caption: "My forever Sister in crime 💕"
        },
        {
            image: "assets/photos/B.jpeg",
            caption: "From chaos to beautiful memories ❤️"
        },
        {
            image: "assets/photos/C.jpeg",
            caption: "Some memories are truly priceless ✨"
        },
        {
            image: "assets/photos/D.jpeg",
            caption: "Life is so much better with a sister like you 🌸"
        }
    ],

    wishes: [
        "Best Secret Keeper 💕",
        "Always Supportive ❤️",
        "Sister Partner in Crime 😄",
        "My Forever Best Sister Cat 🫶",
        "Your Smile Brightens Days ✨",
        "Always Stay Amazing 🌟",
        "Endless Joy & Health 🎉",
        "Pure Golden Heart 💖"
    ],

    scratchShayari: `🌸 "Sisters share the sweetest memories 
& the strongest bonds. 
Wish you endless smiles and a lifetime of happiness, 
my dearest Doremon!" 💖✨`,
    
    letter: `Dear Dayan Sis Smruti (Doremon) ❤️,

Today is not just your birthday.
It's a reminder of how lucky I am to have a sister like you.

Through every laugh, every argument, every silly moment and every memory, you have always had a special place in my life.

You are more than my sister.
You are my secret keeper, my partner in crime, my supporter and one of the most precious people in my life.

I hope this new year of your life brings you endless happiness, success, peace and beautiful memories.

Never stop smiling.
Never stop dreaming.
And always remember that no matter where life takes us, I'll always be there for you.`
};

const state = {
    currentScene: 1,
    enteredPin: "",
    audioPlaying: false,
    audioObj: null,
    sounds: {},
    puzzleState: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    puzzleMoves: 0,
    poppedBalloons: 0,
    scratchRevealed: false
};

document.addEventListener("DOMContentLoaded", () => {
    initConfiguration();
    initAudioSystem();
    initBackgroundCanvas();
    initSceneTransitions();
    initPasscodeLock();
    initCakeBoomInteraction();
    initMemoriesCarousel();
    initBalloonGame();
    initPuzzleGame();
    initScratchCard();
    initEnvelopeLetter();
});

function initConfiguration() {
    document.querySelectorAll("#dashSisterName, #finaleSisterName").forEach(el => el.textContent = `${birthdayConfig.sisterName} (${birthdayConfig.nickname})`);
    
    const scratchUnderlayer = document.getElementById("scratchUnderlayer");
    if (scratchUnderlayer) {
        scratchUnderlayer.innerHTML = `
            <div class="gift-icon">🎁</div>
            <div class="shayari-text">${birthdayConfig.scratchShayari}</div>
            <p class="reveal-sub" style="margin-top:10px; color:#ff6b8b;">~ Special Surprise For Doremon ❤️</p>
        `;
    }

    document.getElementById("letterHeading").textContent = `Dear ${birthdayConfig.sisterName} (${birthdayConfig.nickname}) ❤️`;
    document.getElementById("letterAuthor").textContent = birthdayConfig.yourName;
    document.getElementById("lockLiveDate").textContent = `Birthday: ${birthdayConfig.birthday}`;
}

function initAudioSystem() {
    state.audioObj = new Audio("assets/music/Sis.mpeg");
    state.audioObj.loop = true;

    const fxList = ['gift-open', 'pop', 'unlock', 'scratch', 'success'];
    fxList.forEach(fx => {
        const audio = new Audio(`assets/sounds/${fx}.mp3`);
        audio.preload = 'auto';
        state.sounds[fx] = audio;
    });

    const toggleBtn = document.getElementById("audioToggleBtn");
    toggleBtn.addEventListener("click", toggleMusic);
}

function playSoundFX(name) {
    if (state.sounds[name]) {
        state.sounds[name].currentTime = 0;
        state.sounds[name].play().catch(() => {});
    }
}

function toggleMusic() {
    const toggleBtn = document.getElementById("audioToggleBtn");
    if (state.audioPlaying) {
        state.audioObj.pause();
        state.audioPlaying = false;
        toggleBtn.classList.remove("playing");
        toggleBtn.querySelector(".audio-icon").textContent = "🔇";
    } else {
        state.audioObj.play().then(() => {
            state.audioPlaying = true;
            toggleBtn.classList.add("playing");
            toggleBtn.querySelector(".audio-icon").textContent = "🔊";
        }).catch(() => console.log("User interaction needed for audio"));
    }
}

function navigateToScene(sceneNumber) {
    const currentEl = document.getElementById(`scene-${state.currentScene}`);
    const nextEl = document.getElementById(`scene-${sceneNumber}`);

    if (currentEl) currentEl.classList.remove("active");
    if (nextEl) {
        nextEl.classList.add("active");
        state.currentScene = sceneNumber;
        triggerSceneHook(sceneNumber);
    }
}

function triggerSceneHook(sceneNumber) {
    if (sceneNumber === 3) startLoadingSequence();
    if (sceneNumber === 4) animateDashboardCounters();
}

function initSceneTransitions() {
    const giftBox = document.getElementById("giftBox");
    giftBox.addEventListener("click", () => {
        giftBox.classList.add("open");
        playSoundFX("gift-open");
        if (!state.audioPlaying) toggleMusic();
        setTimeout(() => navigateToScene(2), 1200);
    });

    document.getElementById("toGalleryBtn").addEventListener("click", () => navigateToScene(5));
    document.getElementById("toBalloonGameBtn").addEventListener("click", () => navigateToScene(6));
    document.getElementById("toPuzzleBtn").addEventListener("click", () => navigateToScene(7));
    document.getElementById("toScratchBtn").addEventListener("click", () => navigateToScene(8));
    document.getElementById("toEnvelopeBtn").addEventListener("click", () => navigateToScene(9));

    document.getElementById("replayBtn").addEventListener("click", () => {
        document.getElementById("finaleOverlay").classList.add("hidden");
        state.enteredPin = "";
        navigateToScene(1);
    });
}

function initPasscodeLock() {
    const timeEl = document.getElementById("lockLiveTime");
    const updateTime = () => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);

    const keypadBtns = document.querySelectorAll(".key-btn");
    const dots = document.querySelectorAll("#pinDisplay .dot");
    const feedback = document.getElementById("lockFeedback");
    const lockCard = document.querySelector(".lock-device");

    keypadBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.key;

            if (key === "back") {
                state.enteredPin = state.enteredPin.slice(0, -1);
            } else if (key === "enter") {
                validatePin();
                return;
            } else if (state.enteredPin.length < 4) {
                state.enteredPin += key;
            }

            updatePinDots();
            if (state.enteredPin.length === 4) {
                setTimeout(validatePin, 200);
            }
        });
    });

    function updatePinDots() {
        dots.forEach((dot, idx) => {
            if (idx < state.enteredPin.length) dot.classList.add("filled");
            else dot.classList.remove("filled");
        });
    }

    function validatePin() {
        if (state.enteredPin === birthdayConfig.passcode) {
            playSoundFX("unlock");
            playSoundFX("success");
            document.getElementById("lockIcon").textContent = "🔓";
            
            showUnlockSurprisePopup();

            setTimeout(() => navigateToScene(3), 1800);
        } else {
            playSoundFX("pop");
            lockCard.classList.add("shake");
            feedback.textContent = "Oops! Try again 💕";
            feedback.style.color = "#ff4757";
            state.enteredPin = "";
            setTimeout(() => {
                lockCard.classList.remove("shake");
                updatePinDots();
            }, 500);
        }
    }
}

function showUnlockSurprisePopup() {
    let popup = document.getElementById("unlockPopup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "unlockPopup";
        popup.className = "unlock-popup-overlay";
        document.body.appendChild(popup);
    }
    popup.innerHTML = `
        <h2>🎉 BOOM! 🎉</h2>
        <p style="font-size:1.4rem; margin-top:8px; color:#fff;">Happy Birthday ${birthdayConfig.nickname}! 💖🎂</p>
        <p style="font-size:0.9rem; margin-top:4px; opacity:0.8;">Unlocking your surprise world...</p>
    `;
    
    setTimeout(() => popup.classList.add("show"), 50);
    setTimeout(() => popup.classList.remove("show"), 1700);
}

function startLoadingSequence() {
    let progress = 0;
    const progressCircle = document.getElementById("progressCircle");
    const percentText = document.getElementById("loadPercent");
    const statusText = document.getElementById("loaderStatusText");

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 3;
        if (progress > 100) progress = 100;

        percentText.textContent = progress;
        const offset = 264 - (264 * progress) / 100;
        progressCircle.style.strokeDashoffset = offset;

        if (progress > 40 && progress < 80) {
            statusText.textContent = "Unwrapping sibling secrets...";
        } else if (progress >= 80) {
            statusText.textContent = `Ready? Happy Birthday ${birthdayConfig.nickname}... 💖`;
        }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => navigateToScene(4), 800);
        }
    }, 150);
}

function animateDashboardCounters() {
    const counters = document.querySelectorAll(".counter-val");
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        let current = 0;
        const increment = Math.ceil(target / 40);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = current;
            }
        }, 30);
    });
}

function initCakeBoomInteraction() {
    const cake = document.querySelector(".cake-container");
    if (!cake) return;

    cake.addEventListener("click", () => {
        playSoundFX("pop");
        playSoundFX("success");
        
        cake.style.transition = "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        cake.style.transform = "scale(1.3) rotate(5deg)";

        let boomToast = document.getElementById("cakeBoomToast");
        if (!boomToast) {
            boomToast = document.createElement("div");
            boomToast.id = "cakeBoomToast";
            boomToast.style.cssText = "position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,107,139,0.95); color: #fff; padding: 18px 28px; border-radius: 50px; font-weight: bold; font-size: 1.3rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; border: 2px solid #ffd700; transition: all 0.3s ease;";
            document.body.appendChild(boomToast);
        }
        
        boomToast.innerHTML = `💥 BOOM! Happy Birthday ${birthdayConfig.nickname}! 🎂🎉`;
        boomToast.style.opacity = "1";
        boomToast.style.transform = "translate(-50%, -50%) scale(1.1)";

        setTimeout(() => {
            cake.style.transform = "scale(1) rotate(0deg)";
        }, 200);

        setTimeout(() => {
            if (boomToast) boomToast.style.opacity = "0";
        }, 2500);
    });
}

function initMemoriesCarousel() {
    const track = document.getElementById("carouselTrack");
    const dotsContainer = document.getElementById("carouselDots");

    birthdayConfig.memories.forEach((mem, idx) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        
        const img = document.createElement("img");
        img.src = mem.image;
        img.alt = `Memory ${idx + 1}`;
        img.onerror = () => {
            img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232a0845"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ff6b8b" font-size="20">Memory Photo ${idx+1}</text></svg>`;
        };

        const caption = document.createElement("div");
        caption.className = "slide-caption";
        caption.textContent = mem.caption;

        slide.appendChild(img);
        slide.appendChild(caption);
        track.appendChild(slide);

        const dot = document.createElement("div");
        dot.className = `dot-indicator ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    let currentSlide = 0;
    const slidesCount = birthdayConfig.memories.length;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        Array.from(dotsContainer.children).forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slidesCount;
        goToSlide(currentSlide);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
        goToSlide(currentSlide);
    });
}

function initBalloonGame() {
    const arena = document.getElementById("balloonArena");
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6', '#ff6b8b'];

    birthdayConfig.wishes.forEach((wish, idx) => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.backgroundColor = colors[idx % colors.length];
        balloon.style.left = `${(idx % 4) * 22 + 5}%`;
        balloon.style.top = `${Math.floor(idx / 4) * 45 + 10}%`;
        balloon.style.animationDelay = `${idx * 0.3}s`;

        balloon.addEventListener("click", () => {
            playSoundFX("pop");
            balloon.style.transform = "scale(1.5)";
            balloon.style.opacity = "0";
            balloon.style.pointerEvents = "none";
            
            document.getElementById("wishMessage").textContent = `🎈 "${wish}"`;
            state.poppedBalloons++;

            if (state.poppedBalloons >= birthdayConfig.wishes.length) {
                document.getElementById("toPuzzleBtn").classList.remove("hidden");
                playSoundFX("success");
            }
        });

        arena.appendChild(balloon);
    });
}

function initPuzzleGame() {
    const board = document.getElementById("puzzleBoard");
    const moveDisplay = document.getElementById("moveCount");

    state.puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    shuffleSolvablePuzzle();

    function renderBoard() {
        board.innerHTML = "";
        state.puzzleState.forEach((tileIdx, pos) => {
            const tile = document.createElement("div");
            tile.className = `puzzle-tile ${tileIdx === 8 ? 'empty' : ''}`;
            
            if (tileIdx !== 8) {
                const row = Math.floor(tileIdx / 3);
                const col = tileIdx % 3;
                tile.style.backgroundImage = "url('assets/photos/SIS.jpeg'), url('assets/photos/photo1.jpg')";
                tile.style.backgroundPosition = `-${col * 93.3}px -${row * 93.3}px`;
            }

            tile.addEventListener("click", () => handleTileClick(pos));
            board.appendChild(tile);
        });
    }

    function handleTileClick(pos) {
        const emptyPos = state.puzzleState.indexOf(8);
        const validMoves = [
            emptyPos - 1, emptyPos + 1,
            emptyPos - 3, emptyPos + 3
        ];

        const isAdjacent = validMoves.includes(pos) && 
            !(Math.abs(emptyPos % 3 - pos % 3) === 2);

        if (isAdjacent) {
            [state.puzzleState[emptyPos], state.puzzleState[pos]] = [state.puzzleState[pos], state.puzzleState[emptyPos]];
            state.puzzleMoves++;
            moveDisplay.textContent = state.puzzleMoves;
            playSoundFX("pop");
            renderBoard();

            if (checkPuzzleSolved()) {
                playSoundFX("success");
                document.getElementById("puzzleSuccessMessage").classList.remove("hidden");
                document.getElementById("toScratchBtn").classList.remove("hidden");
            }
        }
    }

    function checkPuzzleSolved() {
        return state.puzzleState.every((val, index) => val === index);
    }

    function shuffleSolvablePuzzle() {
        for (let i = 0; i < 30; i++) {
            const emptyPos = state.puzzleState.indexOf(8);
            const possibleMoves = [];
            if (emptyPos % 3 > 0) possibleMoves.push(emptyPos - 1);
            if (emptyPos % 3 < 2) possibleMoves.push(emptyPos + 1);
            if (emptyPos >= 3) possibleMoves.push(emptyPos - 3);
            if (emptyPos < 6) possibleMoves.push(emptyPos + 3);

            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            [state.puzzleState[emptyPos], state.puzzleState[randomMove]] = [state.puzzleState[randomMove], state.puzzleState[emptyPos]];
        }
    }

    renderBoard();
}

function initScratchCard() {
    const canvas = document.getElementById("scratchCanvas");
    const ctx = canvas.getContext("2d");
    let isScratching = false;

    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#d4af37";
    ctx.font = "16px sans-serif";
    ctx.fillText("✨ Scratch Here Doremon ✨", 55, 105);

    function scratch(e) {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        checkScratchPercentage();
    }

    function checkScratchPercentage() {
        if (state.scratchRevealed) return;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clearPixels = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === 0) clearPixels++;
        }

        const percentage = (clearPixels / (canvas.width * canvas.height)) * 100;
        if (percentage > 50) {
            state.scratchRevealed = true;
            canvas.style.display = "none";
            playSoundFX("success");
            
            document.getElementById("scratchUnderlayer").classList.add("shayari-card");
            document.getElementById("scratchStatus").textContent = "✨ Emotional Shayari Unlocked! ❤️";
            document.getElementById("toEnvelopeBtn").classList.remove("hidden");
        }
    }

    canvas.addEventListener("mousedown", () => isScratching = true);
    canvas.addEventListener("mouseup", () => isScratching = false);
    canvas.addEventListener("mousemove", scratch);

    canvas.addEventListener("touchstart", () => isScratching = true);
    canvas.addEventListener("touchend", () => isScratching = false);
    canvas.addEventListener("touchmove", scratch);
}

function initEnvelopeLetter() {
    const envelope = document.getElementById("envelope");
    const letterModal = document.getElementById("letterModal");
    const letterBody = document.getElementById("letterBody");

    envelope.addEventListener("click", () => {
        envelope.classList.add("open");
        playSoundFX("gift-open");

        setTimeout(() => {
            document.getElementById("envelopeStage").classList.add("hidden");
            letterModal.classList.remove("hidden");
            typeWriterEffect(birthdayConfig.letter, letterBody);
        }, 1000);
    });

    document.getElementById("finalCelebrationBtn").addEventListener("click", () => {
        document.getElementById("finaleOverlay").classList.remove("hidden");
        playSoundFX("success");
    });
}

function typeWriterEffect(text, element) {
    element.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(timer);
    }, 25);
}

function initBackgroundCanvas() {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: ['#ffd700', '#ff6b8b', '#d8b4fe'][Math.floor(Math.random() * 3)],
        vy: -Math.random() * 0.8 - 0.2,
        vx: (Math.random() - 0.5) * 0.5
    }));

    function render() {
        ctx.clearRect(0, 0, width, height);

        const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, Math.max(width, height));
        grad.addColorStop(0, '#2a0845');
        grad.addColorStop(1, '#07030d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            if (p.y < 0) p.y = height;
            if (p.x < 0 || p.x > width) p.vx *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.6;
            ctx.fill();
        });

        requestAnimationFrame(render);
    }

    render();
}