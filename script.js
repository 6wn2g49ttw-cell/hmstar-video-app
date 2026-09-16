let tg = window.Telegram.WebApp;
tg.expand();

// টেলিগ্রাম থেকে ইউজারের নাম ফেচ করা
let usernameEl = document.getElementById("username");
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    usernameEl.innerText = `Welcome, ${tg.initDataUnsafe.user.first_name}! 🐹`;
} else {
    usernameEl.innerText = "Welcome, Hamster Viewer!";
}

// -----------------------------------------------------------------
// ভিডিওর তালিকা: নিচের 'url' এর জায়গায় আপনার আসল ভিডিওর .mp4 ডিরেক্ট লিংক বসিয়ে দিন
// -----------------------------------------------------------------
const videos = [
    {
        id: 1,
        title: "Hamster Video 1",
        duration: "01:58",
        url: "https://xhamster46.desi/videos/indian-milf-im-sure-you-must-be-jealous-for-not-fucking-her-8392733" // এখানে আপনার রিয়েল ভিডিও লিংক দিন
    },
    {
        id: 2,
        title: "Hamster Video 2",
        duration: "0:30",
        url: "https://www.w3schools.com/html/mov_bbb.mp4" // এখানে আপনার রিয়েল ভিডিও লিংক দিন
    }
];

const videoGrid = document.getElementById("video-grid");
const videoListSection = document.getElementById("video-list-section");
const playerSection = document.getElementById("player-section");
const videoPlayer = document.getElementById("video-player");
const videoSource = document.getElementById("video-source");
const nowPlaying = document.getElementById("now-playing");
const backBtn = document.getElementById("back-btn");

const adModal = document.getElementById("ad-modal");
const countdownEl = document.getElementById("countdown");
const skipAdBtn = document.getElementById("skip-ad-btn");

let selectedVideo = null;
let adTimerInterval = null;

// ভিডিও লিস্ট স্ক্রিনে রেন্ডার করা
function renderVideos() {
    videoGrid.innerHTML = "";
    videos.forEach(video => {
        let card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="thumbnail">▶</div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>Duration: ${video.duration} | 📺 Watch Ad to Play</p>
            </div>
        `;
        card.addEventListener("click", () => triggerAdBeforePlay(video));
        videoGrid.appendChild(card);
    });
}

// ভিডিওতে ক্লিক করার পর অ্যাড পপআপ ওপেন করা
function triggerAdBeforePlay(video) {
    selectedVideo = video;
    adModal.classList.remove("hidden");
    
    let timeLeft = 5; // ৫ সেকেন্ডের অ্যাড কাউন্টডাউন (এখানে আপনার রিয়েল অ্যাড নেটওয়ার্ক কোড বসাতে পারেন)
    countdownEl.innerText = timeLeft;
    skipAdBtn.disabled = true;
    skipAdBtn.innerText = `Please wait (${timeLeft}s)...`;

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

// অ্যাড শেষ হওয়ার পর ভিডিও আনলক হওয়া
skipAdBtn.addEventListener("click", () => {
    adModal.classList.add("hidden");
    playVideo(selectedVideo);
});

// ভিডিও প্লে করার লজিক
function playVideo(video) {
    videoListSection.classList.add("hidden");
    playerSection.classList.remove("hidden");
    
    nowPlaying.innerText = video.title;
    videoSource.src = video.url;
    videoPlayer.load();
    videoPlayer.play();
}

// ব্যাক বাটনে ক্লিক করে লিস্টে ফিরে যাওয়া
backBtn.addEventListener("click", () => {
    videoPlayer.pause();
    playerSection.classList.add("hidden");
    videoListSection.classList.remove("hidden");
});

// অ্যাপ লোড হওয়ার সাথে সাথে ভিডিও লিস্ট দেখানো
renderVideos();
