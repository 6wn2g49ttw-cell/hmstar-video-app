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
// ভিডিওর তালিকা: এখানে আপনার পছন্দমতো যেকোনো ওয়েবসাইট বা ইউটিউবের এমবেড লিংক দিতে পারেন (.com ওয়েবসাইট সাপোর্ট করবে)
// -------------------------------------------------------------
const videos = [
  {
    id: 1,
    title: "Hamster Video 1",
    duration: "18:59",
    url: "https://xhamster46.desi/videos/stepsis-stop-coming-into-my-room-without-asking-or-ill-fuck-you-xhKbpdw" // এখানে আপনার .com বা যেকোনো ওয়েবসাইট/ইউটিউবের এমবেড লিংক দিন
  },
  {
    id: 2,
    title: "Hamster Video 2",
    duration: "3:30",
    url: "https://www.youtube.com/embed/3JZ_D3ELwOQ" // আরেকটি লিংক
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

// ভিডিও বা ওয়েবসাইট প্লে করার লজিক (iframe দিয়ে যেকোনো .com সাইট বা ভিডিও সাপোর্ট করবে)
function playVideo(video) {
    videoListSection.classList.add("hidden");
    playerSection.classList.remove("hidden");
    
    nowPlaying.innerText = video.title;
    
    // ভিডিও প্লেয়ার কন্টেইনার সিলেক্ট করা
    let playerWrapper = document.getElementById("player-wrapper");
    if (!playerWrapper) {
        // যদি র‍্যাপার না থাকে তবে ভিডিও এলিমেন্টের প্যারেন্ট ধরে নেব
        let oldPlayer = document.getElementById("video-player");
        playerWrapper = oldPlayer.parentElement;
    }
    
    // যেকোনো ওয়েবসাইট বা এমবেড লিংক লোড করার জন্য iframe ব্যবহার করা হলো
    playerWrapper.innerHTML = `
        <iframe id="video-iframe" src="${video.url}" width="100%" height="250px" style="border:none; border-radius: 8px;" allowfullscreen></iframe>
    `;
}

// ব্যাক বাটনে ক্লিক করে লিস্টে ফিরে যাওয়া
backBtn.addEventListener("click", () => {
    let iframe = document.getElementById("video-iframe");
    if (iframe) {
        iframe.src = ""; // ভিডিও বা সাইট বন্ধ করার জন্য সোর্স ক্লিয়ার করা
    }
    playerSection.classList.add("hidden");
    videoListSection.classList.remove("hidden");
});

// অ্যাপ লোড হওয়ার সাথে সাথে ভিডিও লিস্ট দেখানো
renderVideos();
