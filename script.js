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
            } else { requestAnimationFrame(checkBlow); }
        }
        checkBlow();
    } catch {
        document.getElementById('candle-screen').onclick = () => {
            document.getElementById('candle-screen').style.display = 'none';
        };
    }
}
window.onload = initMic;

// 2. Logica Rasfoire (Rescrisă)
gallery.addEventListener('click', function() {
    // Luam toate pozele care NU au inca clasa fly-away
    const availableImages = Array.from(document.querySelectorAll('.gallery img:not(.fly-away)'));
    
    if (availableImages.length > 0) {
        // Sortam sa fim siguri ca o luam pe cea cu z-index-ul cel mai mare (de deasupra)
        availableImages.sort((a, b) => b.style.zIndex - a.style.zIndex);
        availableImages[0].classList.add('fly-away');
    } else {
        // Resetam galeria daca toate au zburat
        document.querySelectorAll('.gallery img').forEach(img => {
            img.classList.remove('fly-away');
        });
    }
});

// 3. Butonul NU
const moveButton = () => {
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.random() * 80 + 'vw';
    noBtn.style.top = Math.random() * 80 + 'vh';
};
noBtn.onmouseover = moveButton;
noBtn.ontouchstart = (e) => { e.preventDefault(); moveButton(); };

// 4. DA
yesBtn.onclick = () => {
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('letter-container').classList.remove('hidden');
    const startDate = new Date("2025-03-11T00:00:00");
    setInterval(() => {
        const diff = Math.floor((new Date() - startDate) / 1000);
        document.getElementById('seconds-count').innerText = diff.toLocaleString('ro-RO');
    }, 1000);
};
