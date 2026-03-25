import "./App.css";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";
import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {

  const [screen, setScreen] = useState("welcome");
  const [nickname, setNickname] = useState("");
  const [tempName, setTempName] = useState("");

  const [days, setDays] = useState(0);
  const [saved, setSaved] = useState(0);

  const [badges, setBadges] = useState([]);
  const [archivedBadges, setArchivedBadges] = useState([]);
  const [newBadge, setNewBadge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const milestones = [1,7,15,30,60];

  const slipText = ["Slipped once", "Slipped twice", "Slipped several times", "Slipped many times", "Slipped often"];

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // load
  useEffect(() => {
    const savedDays = sessionStorage.getItem("days");
    const savedMoney = sessionStorage.getItem("saved");
    const savedName = sessionStorage.getItem("nickname");
    const savedBadges = sessionStorage.getItem("badges");
    const savedArchived = sessionStorage.getItem("archivedBadges");

    if (savedDays !== null) setDays(Number(savedDays));
    if (savedMoney !== null) setSaved(Number(savedMoney));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedArchived) setArchivedBadges(JSON.parse(savedArchived));

    if (savedName) {
      setNickname(savedName);
      setScreen("dashboard");
    }

    setIsLoaded(true);
  }, []);

  // save
  useEffect(() => {
    if (!isLoaded) return;

    sessionStorage.setItem("days", days);
    sessionStorage.setItem("saved", saved);
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("badges", JSON.stringify(badges));
    sessionStorage.setItem("archivedBadges", JSON.stringify(archivedBadges));
  }, [days, saved, nickname, badges, archivedBadges, isLoaded]);

  // autosafe  firebase
  useEffect(() => {
    if (!isLoaded) return;
    if (!window.ethereum) return;

    async function sync() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const user = await signer.getAddress();

        await saveToFirebase(user);
      } catch (err) {
        console.log("Firebase sync error:", err);
      }
    }

    sync();
  }, [days, saved, badges, archivedBadges, isLoaded]);

  async function connectWallet() {
    const provider = await detectEthereumProvider();
    if (!provider) {
      alert("Install MetaMask");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const userAddress = window.ethereum.selectedAddress;

    const savedName = sessionStorage.getItem("nickname");
    if (savedName) {
      setNickname(savedName);
      setScreen("dashboard");
    } else {
      setScreen("nickname");
    }

    loadFromFirebase(userAddress).catch(err => console.log("Firebase load error:", err));
  }

  function saveName() {
    if (!tempName.trim()) {
      alert("Upiši nadimak");
      return;
    }
    setNickname(tempName);
    setScreen("dashboard");
  }

  function slippedToday() {
    setArchivedBadges((prev) => {
      const updated = [...prev];
      badges.forEach((day) => {
        const existing = updated.find(b => b.day === day);
        if (existing) {
          existing.slipped += 1; // povećaj slip
        } else {
          updated.push({ day, slipped: 1 }); // novi badge u archived
        }
      });
      return updated.sort((a,b)=>a.day-b.day);
    });

    setDays(0);
    setSaved(0);
    setBadges([]);
    setNewBadge(null);
  }

  async function saveToFirebase(userAddress) {
    console.log("X Saving to Firebase:", { userAddress, days, saved, badges, archivedBadges });
    await setDoc(doc(db, "users", userAddress), {
      days,
      saved,
      badges,
      archivedBadges
    });
    console.log("+ Saved to Firebase!");
  }

  async function loadFromFirebase(userAddress) {
    const docRef = doc(db, "users", userAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      setDays(data.days || 0);
      setSaved(data.saved || 0);
      setBadges(data.badges || []);
      setArchivedBadges(data.archivedBadges || []);
    }
  }

  async function markSmokeFree() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {
      const newDay = days + 1;

      if (milestones.includes(newDay)) {
        setLoading(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        const user = await signer.getAddress();
        const tx = await contract.markDay(user);
        await tx.wait();

        const streak = await contract.streaks(user);
        console.log("ON-CHAIN streak:", Number(streak));

        await delay(2000);
        setLoading(false);

        setNewBadge(newDay);

        setBadges((prev) => {
          if (!prev.includes(newDay)) return [...prev, newDay];
          return prev;
        });
      }

      setDays((prev) => prev + 1);
      setSaved((prev) => prev + 3.5);

    } catch (error) {
      console.error(error);
      alert("Transaction failed");
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="card">

        {screen === "welcome" && (
          <>
            <h1>NoSmokeZone</h1>
            <p className="subtitle">Start your smoke-free journey</p>

            <button className="primary" onClick={connectWallet}>
              Connect Wallet
            </button>

            <div className="features">
              <p>Track your progress</p>
              <p>Save money</p>
              <p>Build healthy habits</p>
            </div>
          </>
        )}

        {screen === "nickname" && (
          <>
            <h2>Welcome</h2>
            <p>Choose your nickname</p>

            <input
              className="input"
              placeholder="Upiši nadimak"
              onChange={(e) => setTempName(e.target.value)}
            />

            <button className="primary" onClick={saveName}>
              Continue
            </button>
          </>
        )}

        {screen === "dashboard" && (
          <>
            <h2>Hello {nickname}</h2>

            <div className="streak-box">
              <div>
                <p>Smoke-free for</p>
                <h1>{days} days</h1>
              </div>

              <div className="circle">
                <CircularProgressbar
                  value={days}
                  maxValue={60}
                  text={`${days}`}
                />
              </div>
            </div>

            <div className="savings">
              <p>Saved</p>
              <h1>{saved}€</h1>
            </div>

            <div className="buttons">
              <button className="good" onClick={markSmokeFree} disabled={loading}>
                {loading ? "Minting..." : "Smoke-Free Today"}
              </button>

              <button className="bad" onClick={slippedToday} disabled={loading}>
                I Slipped Today
              </button>
            </div>

            <div className="badges">
              <h3>Badges</h3>
              {badges.length === 0 && <p>No badges yet</p>}
              {badges.map((m) => (
                <div key={m} className="badge earned-badge">
                  <span className="icon">🏆</span>
                  <span>Day {m}</span>
                </div>
              ))}
            </div>

            {archivedBadges.length > 0 && (
              <div className="badges archived">
                <h3>Past Achievements</h3>
                {archivedBadges.map((b, i) => {
                  let slipDisplay = "";
                  if (b.slipped === 1) slipDisplay = slipText[0];
                  else if (b.slipped === 2) slipDisplay = slipText[1];
                  else if (b.slipped === 3) slipDisplay = slipText[2];
                  else if (b.slipped === 4) slipDisplay = slipText[3];
                  else slipDisplay = slipText[4]; // 5 ili više

                  return (
                    <div key={i} className="badge locked-badge">
                      <span className="icon">🔒</span>
                      <span>Day {b.day} ({slipDisplay})</span>
                    </div>
                  )
                })}
              </div>
            )}

            {newBadge && (
              <div className="popup">
                <div className="popup-content">
                  <h2>🎉 New Badge!</h2>
                  <p>You reached Day {newBadge}!</p>
                  <button onClick={() => setNewBadge(null)}>
                    Awesome!
                  </button>
                </div>
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}

export default App;