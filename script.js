const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const gallery = document.getElementById('photo-gallery');
const gameContainer = document.getElementById('game-container');
const letterContainer = document.getElementById('letter-container');

// 1. Detectare suflat în microfon
async function initMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function checkBlow() {
            analyser.getByteFrequencyData(dataArray);
            let sum = dataArray.reduce((a, b) => a + b);
            let average = sum / dataArray.length;

            if (average > 45) { // Pragul de suflat
                document.getElementById('flame').style.display = 'none';
                setTimeout(() => {
                    document.getElementById('candle-screen').style.opacity = '0';
                    setTimeout(() => document.getElementById('candle-screen').style.display = 'none', 1000);
                }, 500);
                stream.getTracks().forEach(track => track.stop());
            } else {
                requestAnimationFrame(checkBlow);
            }
        }
        checkBlow();
    } catch (err) {
        // Dacă refuză microfonul, lăsăm un click pe ecran să funcționeze
        document.getElementById('candle-screen').onclick = () => {
            document.getElementById('candle-screen').style.display = 'none';
        };
    }
}
window.onload = initMic;

// 2. Click pe galerie pentru desfacere
gallery.addEventListener('click', () => {
    gallery.classList.toggle('open');
});

// 3. Butonul NU fuge
const moveButton = () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
};
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(); });

// 4. Click pe DA
yesBtn.addEventListener('click', () => {
    gameContainer.classList.add('hidden');
    letterContainer.classList.remove('hidden');

    // Pornire Cronometru (11 Martie 2025)
    const startDate = new Date("2025-03-11T00:00:00");
    setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startDate) / 1000);
        document.getElementById('seconds-count').innerText = diff.toLocaleString('ro-RO');
    }, 1000);
});