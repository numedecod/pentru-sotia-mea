const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const gallery = document.getElementById('photo-gallery');

// 1. Detectare suflat
async function initMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function checkBlow() {
            analyser.getByteFrequencyData(dataArray);
            let average = dataArray.reduce((a, b) => a + b) / dataArray.length;

            if (average > 40) { 
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
    } catch {
        document.getElementById('candle-screen').onclick = () => {
            document.getElementById('candle-screen').style.display = 'none';
        };
    }
}
window.onload = initMic;

// 2. Logica Răsfoire Poze (Una câte una)
const images = Array.from(document.querySelectorAll('.gallery img'));
let topImageIndex = 0; // Indexul pozei care este deasupra

gallery.addEventListener('click', () => {
    if (topImageIndex < images.length) {
        images[topImageIndex].classList.add('fly-away');
        topImageIndex++;
    } else {
        // Resetăm galeria dacă s-au terminat pozele
        images.forEach(img => img.classList.remove('fly-away'));
        topImageIndex = 0;
    }
});

// 3. Butonul NU fuge
const moveButton = () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
};
noBtn.onmouseover = moveButton;
noBtn.ontouchstart = (e) => { e.preventDefault(); moveButton(); };

// 4. Click pe DA + Cronometru
yesBtn.onclick = () => {
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('letter-container').classList.remove('hidden');
    
    const startDate = new Date("2025-03-11T00:00:00");
    setInterval(() => {
        const diff = Math.floor((new Date() - startDate) / 1000);
        document.getElementById('seconds-count').innerText = diff.toLocaleString('ro-RO');
    }, 1000);
};
