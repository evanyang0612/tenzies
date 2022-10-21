import { useEffect, useState } from "react";
import Die from "./Die";
import "./style.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);
  const [bestCount, setBestCount] = useState(Infinity);

  useEffect(() => {
    let firsValue = dice[0].value;
    const allDiceHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === firsValue);
    if (allDiceHeld && allSameValue) {
      setTenzies(true);
      handleBestCount();
    }
    //eslint-disable-next-line
  }, [dice]);

  function handleBestCount() {
    if (count < bestCount) {
      setBestCount(count);
    }
  }

  function resetGame() {
    setDice(allNewDice());
    setTenzies(false);
    setCount(0);
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      })
    );
    setCount((prevCount) => prevCount + 1);
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        {tenzies
          ? "Congratulations! Tenzies again?"
          : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={tenzies ? resetGame : rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <h3 className="roll-count">Count: {count}</h3>
      <h3 className="roll-count-best">
        Best record: {bestCount === Infinity ? "0" : bestCount}
      </h3>
    </main>
  );
}
