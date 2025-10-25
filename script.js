// ======= Firebase Config =======
const firebaseConfig = {
  apiKey: "AIzaSyCPxTdg3q8WGdg6BkckdlnWorrqXeCVhZE",
  authDomain: "lastxalive.firebaseapp.com",
  projectId: "lastxalive",
  storageBucket: "lastxalive.appspot.com",
  messagingSenderId: "763530458403",
  appId: "1:763530458403:web:e168d85c9178f42858c896",
  measurementId: "G-ZDBWQYTCVP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ======= Hero Data (Local Images) =======
const heroes = [
  { id: "1", name: "X", img: "images/x.jpg", votes: 0 },
  { id: "2", name: "Queen", img: "images/Queen.webp", votes: 0 },
  { id: "3", name: "Dragon Boy", img: "images/dragon.jpg", votes: 0 },
  { id: "4", name: "Ghostblade", img: "images/ghost.jpg", votes: 0 },
  { id: "5", name: "The Johnnies", img: "images/jhonnies.png", votes: 0 },
  { id: "6", name: "Loli", img: "images/loli.jpg", votes: 0 },
  { id: "7", name: "Lucky Cyan", img: "images/cyan.webp", votes: 0 },
  { id: "8", name: "Ahu", img: "images/ahu.webp", votes: 0 },
  { id: "9", name: "E-Soul", img: "images/soul.jpg", votes: 0 },
  { id: "10", name: "Nice", img: "images/nice.webp", votes: 0 },
  { id: "11", name: "Lin Ling", img: "images/linling.jpg", votes: 0 }
];
// script.js or your existing JS file

// Create a new audio object
const bgMusic = new Audio('audio/semparo.mp3');

// Set it to loop
bgMusic.loop = true;

// Play music after user interaction (required in most browsers)
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch((err) => console.log('Audio play blocked:', err));
    }
});

const heroesContainer = document.getElementById("heroes-container");
const topHeroContainer = document.getElementById("top-hero-container");

// Toggle music on click (optional)
document.addEventListener('keydown', (e) => {
  if(e.key === 'm') { // Press 'm' to mute/unmute
    bgMusic.paused ? bgMusic.play() : bgMusic.pause();
  }
});
// ======= Initialize Heroes in Firestore =======
async function initializeHeroes() {
  const snapshot = await db.collection("heroes").get();
  if (snapshot.empty) {
    for (const hero of heroes) {
      await db.collection("heroes").doc(hero.id).set({
        name: hero.name,
        votes: hero.votes
      });
    }
    console.log("Heroes initialized ✅");
  }
}
initializeHeroes();

// ======= Render Heroes =======
function renderHeroes(heroList) {
  heroList.sort((a, b) => b.votes - a.votes);

  // Top hero
  const topHero = heroList[0];
  const topHeroImg = heroes.find(h => h.id === topHero.id).img;
  topHeroContainer.innerHTML = `
    <div class="hero-card" onclick="vote('${topHero.id}')">
      <div class="rank">#1</div>
      <img src="${topHeroImg}" alt="${topHero.name}" />
      <p>${topHero.name} (${topHero.votes} votes)</p>
    </div>
  `;

  // Remaining heroes
  heroesContainer.innerHTML = "";
  heroList.slice(1).forEach((hero, index) => {
    const heroImg = heroes.find(h => h.id === hero.id).img;
    const card = document.createElement("div");
    card.className = "hero-card";
    card.innerHTML = `
      <div class="rank">#${index + 2}</div>
      <img src="${heroImg}" alt="${hero.name}" />
      <p>${hero.name} (${hero.votes} votes)</p>
    `;
    card.onclick = () => vote(hero.id);
    heroesContainer.appendChild(card);
  });
}

// ======= Real-Time Firestore Updates =======
db.collection("heroes").onSnapshot(snapshot => {
  const updatedHeroes = [];
  snapshot.forEach(doc => updatedHeroes.push({ id: doc.id, ...doc.data() }));
  renderHeroes(updatedHeroes);
});

// ======= Voting Function =======
async function vote(id) {
  const heroRef = db.collection("heroes").doc(id);
  try {
    await db.runTransaction(async (transaction) => {
      const heroDoc = await transaction.get(heroRef);
      if (!heroDoc.exists) return;
      const newVotes = (heroDoc.data().votes || 0) + 1;
      transaction.update(heroRef, { votes: newVotes });
    });
  } catch (error) {
    console.error("Vote failed: ", error);
  }
}

