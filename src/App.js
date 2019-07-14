import React, { Component } from "react";
import "./App.css";
import cc from "cryptocompare";

cc.setApiKey(
  "ef3f80fb51f1e51d9cb58e8d7f19dfbaeb04fadc9f54c00cca9c2d87f6eb2c79"
);

const PRICE_OF_FILE = 0.01;

const encryptedFileUrl =
  "https://ipfs.io/ipfs/QmduWJ4dNehsuh3skvFH1wG1LmiQhxHxxSRxz1fYiq5HVu";

class App extends Component {
  constructor(props) {
    super(props);

    this.handleBuy = this.handleBuy.bind(this);

    this.state = {
      ethusdPrice: 240
    };
  }

  handleBuy() {}

  async componentDidMount() {
    const prices = await cc.price("ETH", ["USD"]);
    const ethusdPrice = prices.USD;
    this.setState({ ethusdPrice });
  }

  render() {
    const { ethusdPrice } = this.state;
    const filePrice = (
      Math.round(PRICE_OF_FILE * ethusdPrice * 100) / 100
    ).toFixed(2);

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
                  <p>
                    Pay {PRICE_OF_FILE} ETH (US${filePrice})
                  </p>
                  <a onClick={this.handleBuy} className="button bg" href="#">
                    Buy file
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
