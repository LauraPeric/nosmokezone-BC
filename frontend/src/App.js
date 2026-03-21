import "./App.css";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

function App() {

  const [screen, setScreen] = useState("welcome");
  const [nickname, setNickname] = useState("");
  const [tempName, setTempName] = useState("");

  const [days, setDays] = useState(0);
  const [saved, setSaved] = useState(0);

  const [newBadge, setNewBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const milestones = [1,7,15,30,60];

  // ⏳ delay helper
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ✅ LOAD
  useEffect(() => {
    const savedDays = localStorage.getItem("days");
    const savedMoney = localStorage.getItem("saved");
    const savedName = localStorage.getItem("nickname");

    if (savedDays) setDays(Number(savedDays));
    if (savedMoney) setSaved(Number(savedMoney));
if (savedName) {
  setNickname(savedName);
}
  }, []);

  // ✅ SAVE
  useEffect(() => {
    localStorage.setItem("days", days);
    localStorage.setItem("saved", saved);
    localStorage.setItem("nickname", nickname);
  }, [days, saved, nickname]);

  async function connectWallet() {
    const provider = await detectEthereumProvider();

    if (provider) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setScreen("nickname");
    } else {
      alert("Install MetaMask");
    }
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
    setDays(0);
    setSaved(0);
  }

  async function markSmokeFree() {

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {

      const newDay = days + 1;

      // 🎯 milestone only
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

        console.log("Milestone recorded:", newDay);

        // ⏳ UX delay
        await delay(2000);

        setLoading(false);
        setNewBadge(newDay);
      }

      // ✅ update state
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

            {/* 🏆 BADGES */}
            <div className="badges">
              <h3>Badges</h3>

              {milestones
                .filter((m) => days >= m)
                .map((m) => (

                  <div key={m} className="badge earned-badge">
                    <span className="icon">🏆</span>
                    <span>Day {m}</span>
                  </div>

              ))}
            </div>

            {/* 🎉 POPUP */}
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