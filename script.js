// script.js
import { db } from "./firebase-config.js";
import { collection, doc, getDocs, setDoc, onSnapshot, runTransaction } from "firebase/firestore";



// Hero data
const heroes = [
  { id: "1", name: "X", img: "images/x.jpg", votes: 100 },
  { id: "2", name: "Queen", img: "images/queen.jpg", votes: 0 },
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

const heroesContainer = document.getElementById("heroes-container");
const topHeroDiv = document.getElementById("top-hero");

// Initialize Firestore heroes collection
async function initializeHeroes() {
  const snapshot = await getDocs(collection(db, "heroes"));
  if (snapshot.empty) {
    for (const hero of heroes) {
      await setDoc(doc(db, "heroes", hero.id), {
        name: hero.name,
        img: hero.img,
        votes: hero.votes
      });
    }
    console.log("Heroes initialized ✅");
  }
}
initializeHeroes();

// Listen for real-time updates
const heroesCol = collection(db, "heroes");
onSnapshot(heroesCol, snapshot => {
  const updatedHeroes = [];
  snapshot.forEach(docSnap => updatedHeroes.push({ id: docSnap.id, ...docSnap.data() }));
  renderHeroes(updatedHeroes);
});

// Render heroes
function renderHeroes(heroList) {
  heroList.sort((a, b) => b.votes - a.votes);

  heroesContainer.innerHTML = "";
  topHeroDiv.innerHTML = "";

  const top = heroList[0];
  topHeroDiv.innerHTML = `
    <div>
      <img src="${top.img}" alt="${top.name}" />
      <h2>${top.name} - Rank 1 🥇 (${top.votes} votes)</h2>
    </div>
  `;

  heroList.slice(1).forEach((hero, index) => {
    heroesContainer.innerHTML += `
      <div class="hero-card" onclick="vote('${hero.id}')">
        <img src="${hero.img}" alt="${hero.name}" />
        <div class="rank">#${index + 2}</div>
        <p>${hero.name} (${hero.votes})</p>
      </div>
    `;
  });
}

// Voting system
async function vote(id) {
  const heroRef = doc(db, "heroes", id);

  try {
    await runTransaction(db, async (transaction) => {
      const heroDoc = await transaction.get(heroRef);
      if (!heroDoc.exists()) return;
      const newVotes = (heroDoc.data().votes || 0) + 1;
      transaction.update(heroRef, { votes: newVotes });
    });
  } catch (error) {
    console.error("Vote failed: ", error);
  }
}
