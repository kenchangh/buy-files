import React, { Component } from "react";
import "./App.css";
import cc from "cryptocompare";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import Modal from "react-modal";

cc.setApiKey(
  "ef3f80fb51f1e51d9cb58e8d7f19dfbaeb04fadc9f54c00cca9c2d87f6eb2c79"
);

const PRICE_OF_FILE = 0.01;

const encryptedFileUrl =
  "https://ipfs.io/ipfs/QmduWJ4dNehsuh3skvFH1wG1LmiQhxHxxSRxz1fYiq5HVu";

const sellerAddress = "0xf70532ecc73d9d76852dd386ff34f27d74b581bd";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

Modal.setAppElement("#root");

class App extends Component {
  constructor(props) {
    super(props);

    this.handleBuy = this.handleBuy.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      modalIsOpen: false,
      ethusdPrice: 240
    };
  }

  openModal(e) {
    e.preventDefault();
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {}

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async handleBuy() {
    const accounts = await this.web3.eth.getAccounts();
    const defaultAccount = accounts[0];

    await this.web3.eth.sendTransaction({
      from: defaultAccount,
      to: sellerAddress,
      value: window.web3.toWei(PRICE_OF_FILE, "ether")
    });
  }

  metamaskConnect() {
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
  }

  decryptFile(data, password) {
    const salt = data.toString(CryptoJS.enc.Hex, 8, 16);
    const enc = data.toString(CryptoJS.enc.Hex, 16, data.length);
    const derivedParams = CryptoJS.kdf.OpenSSL.execute(
      password,
      256 / 32,
      128 / 32,
      CryptoJS.enc.Hex.parse(salt)
    );
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(enc)
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, derivedParams.key, {
      iv: derivedParams.iv
    });
    return decrypted;
  }

  async downloadFile(password) {
    const response = await fetch(encryptedFileUrl);
    if (response.ok) {
      const blob = await response.blob();
      const wordArray = await this.blobToWordArray(blob);
      console.log(wordArray);
      return this.decryptFile(wordArray, password);
    }
  }

  createDownloadableFile(fileName, content) {
    let link = document.createElement("a");
    link.download = fileName;
    link.href = `data:application/octet-stream,${content}`;
    return link;
  }

  async createDecryptedFileLink(password) {
    const decryptedFile = await this.downloadFile(password);
    return this.createDownloadableFile("trust.jpg", decryptedFile);
  }

  async blobToWordArray(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = function() {
          const wordArray = CryptoJS.lib.WordArray.create(reader.result);
          resolve(wordArray);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  async componentWillMount() {
    this.metamaskConnect();
  }

  async componentDidMount() {
    const prices = await cc.price("ETH", ["USD"]);
    const ethusdPrice = prices.USD;
    this.setState({ ethusdPrice });
  }

  render() {
    const { ethusdPrice, modalIsOpen } = this.state;
    const filePrice = (
      Math.round(PRICE_OF_FILE * ethusdPrice * 100) / 100
    ).toFixed(2);

    return (
      <main>
        <section className="hero-banner mb-30px">
          <div className="container">
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Enter the decryption key
              </h2>
              <button
                onClick={this.closeModal}
                type="button"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <form>
                <input />
                <button>Enter</button>
              </form>
            </Modal>
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
                  <p>
                    After paying, ask{" "}
                    <a href="https://twitter.com/juliankoh">@juliankoh</a> for
                    the decryption key.
                  </p>
                  <p>Already have the decryption key?</p>
                  <a onClick={this.openModal} className="button bg" href="#">
                    Decrypt file
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
