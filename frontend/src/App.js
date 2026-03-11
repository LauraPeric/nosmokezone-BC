import "./App.css";
import { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function App() {

  const [screen, setScreen] = useState("welcome");
  const [nickname, setNickname] = useState("");
  const [tempName, setTempName] = useState("");

  const [days, setDays] = useState(12);
  const [saved, setSaved] = useState(42);

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
    setNickname(tempName);
    setScreen("dashboard");
  }

  function smokeFreeToday() {
    setDays(days + 1);
    setSaved(saved + 3.5);
  }

  function slippedToday() {
    setDays(0);
    setSaved(0);
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
              placeholder="Laura"
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
                  maxValue={30}
                  text={`${days}`}
                />
              </div>

            </div>

            <div className="savings">
              <p>Saved</p>
              <h1>{saved}€</h1>
            </div>

            <div className="buttons">

              <button className="good" onClick={smokeFreeToday}>
                Smoke-Free Today
              </button>

              <button className="bad" onClick={slippedToday}>
                I Slipped Today
              </button>

            </div>

            <div className="mood">
              <p>Mood today</p>

              <div className="emoji">
                <span>🙂</span>
                <span>😊</span>
                <span>😐</span>
                <span>😢</span>
                <span>😫</span>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
}

export default App;