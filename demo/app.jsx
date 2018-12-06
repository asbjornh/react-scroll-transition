import React, { Component } from "react";
import Easing from "easing-functions";

require("./style.css");

import Scroll from "../src";

class App extends Component {
  state = {};

  render() {
    const cards = ["red", "blue", "yellow"];

    return (
      <div className="page">
        <h1>ScrollTransition</h1>

        {cards.map(card => (
          <Scroll easing={Easing.Back.Out} key={card}>
            {progress => (
              <div
                className={`card ${card}`}
                style={{
                  opacity: progress,
                  transform: `translateX(${(1 - progress) * 100}%)`
                }}
              />
            )}
          </Scroll>
        ))}

        <div style={{ position: "relative" }}>
          {cards.map(card => (
            <Scroll easing={t => t * (2 - t)} key={card}>
              {progress => (
                <div
                  className={`card ${card}`}
                  style={{
                    opacity: progress,
                    transform: `translateX(${(1 - progress) * 100}%)`
                  }}
                />
              )}
            </Scroll>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
