import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import cc from "cryptocompare";

class App extends Component {
  constructor() {
    super(this);

    this.state = {
      price: 240
    };
  }

  componentDidMount() {}

  render() {
    return (
      <main>
        <section className="hero-banner mb-30px">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="hero-banner__img">
                  <img
                    className="img-fluid"
                    src="img/banner/hero-banner.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="col-lg-5 pt-5">
                <div className="hero-banner__content">
                  <h1>Buy Julian's distributed systems course notes</h1>
                  <p>Pay 0.01 ETH ()</p>
                  <a className="button bg" href="#">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default App;
