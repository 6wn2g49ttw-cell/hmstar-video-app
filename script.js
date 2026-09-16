let tg = window.Telegram.WebApp;
tg.expand();

// টেলিগ্রাম থেকে ইউজারের নাম ফেচ করা
let usernameEl = document.getElementById("username");
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    usernameEl.innerText = `Welcome, ${tg.initDataUnsafe.user.first_name}! 🐹`;
} else {
    usernameEl.innerText = "Welcome, Hamster Viewer! 🐹";
}

// -------------------------------------------------------------
// ভিডিওর তালিকা (ভিডিও এবং থাম্বনেইল লিংক সহ)
// -------------------------------------------------------------
const videos = [
  {
    id: 1,
    title: "Hamster Video 1",
    duration: "3:30",
    url: "https://files.catbox.moe/ohubx2.mp4", // ভিডিওর ডিরেক্ট লিংক
    thumbnail: "https://files.catbox.moe/2h4w0t.webp" // আপনার দেওয়া থাম্বনেইল লিংক
  }
];

const videoGrid = document.getElementById("video-grid");
const videoListSection = document.getElementById("video-list-section");
const playerSection = document.getElementById("player-section");
const nowPlaying = document.getElementById("now-playing");
const backBtn = document.getElementById("back-btn");

const adModal = document.getElementById("ad-modal");
const countdownEl = document.getElementById("countdown");
const skipAdBtn = document.getElementById("skip-ad-btn");

let selectedVideo = null;
let adTimerInterval = null;

// ভিডিও লিস্ট স্ক্রিনে রেন্ডার করা (থাম্বনেইল সহ)
function renderVideos() {
    videoGrid.innerHTML = "";
    videos.forEach(video => {
        let card = document.createElement("div");
        card.className = "video-card";
        
        let thumbContent = video.thumbnail 
            ? `<img src="${video.thumbnail}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">` 
            : `▶`;

        card.innerHTML = `
            <div class="thumbnail" style="overflow:hidden; display:flex; align-items:center; justify-content:center;">${thumbContent}</div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>Duration: ${video.duration} | 📺 Watch Ad to Play</p>
            </div>
        `;
        card.addEventListener("click", () => triggerAdBeforePlay(video));
        videoGrid.appendChild(card);
    });
}

// ভিডিওতে ক্লিক করার পর এড পপআপ ওপেন করা
function triggerAdBeforePlay(video) {
    selectedVideo = video;
    adModal.classList.remove("hidden");
    
    let timeLeft = 5; // ৫ সেকেন্ডের এড কাউন্টডাউন
    countdownEl.innerText = timeLeft;
    skipAdBtn.disabled = true;
    skipAdBtn.innerText = `Please wait (${timeLeft}s)`;

    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("warning");

    adTimerInterval = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(adTimerInterval);
            skipAdBtn.disabled = false;
            skipAdBtn.innerText = "Watch Video Now ▶";
        }
    }, 1000);
}

// এড শেষ হওয়ার পর ভিডিও আনলক হওয়া
skipAdBtn.addEventListener("click", () => {
    adModal.classList.add("hidden");
    playVideo(selectedVideo);
});

// টেলিগ্রাম মিনি অ্যাপের ভেতরে সরাসরি ভিডিও প্লে করার লজিক
function playVideo(video) {
    videoListSection.classList.add("hidden");
    playerSection.classList.remove("hidden");
    
    nowPlaying.innerText = video.title;
    
    let videoPlayer = document.getElementById("video-player");
    let videoSource = document.getElementById("video-source");
    
    if (videoPlayer && videoSource) {
        videoPlayer.style.display = "block";
        videoSource.src = video.url;
        videoPlayer.load();
        videoPlayer.play();
    }
}

// ব্যাক বাটনে ক্লিক করে লিস্টে ফিরে যাওয়া এবং ভিডিও বন্ধ করা
backBtn.addEventListener("click", () => {
    let videoPlayer = document.getElementById("video-player");
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }
    playerSection.classList.add("hidden");
    videoListSection.classList.remove("hidden");
});

// অ্যাপ লোড হওয়ার সাথে সাথে ভিডিও লিস্ট দেখানো
renderVideos();
