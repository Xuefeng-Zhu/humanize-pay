import React from "react";
import { connect } from "dva";
import { Card, Button, message } from "antd";
import { Keyring, bip32ToAddressNList } from "@shapeshiftoss/hdwallet-core";
import { WebUSBKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-webusb";
import { PortisAdapter } from "@shapeshiftoss/hdwallet-portis";
import Web3 from "web3";

import Form from "../components/form";
import styles from "./IndexPage.css";

const portisAppId = "cbc2b8a9-9381-4e62-9202-002dd1290727";
const ETH = "ETH";
const BTC = "BTC";
const BCH = "BCH";
const LTC = "LTC";
const DOGE = "DOGE";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/b24ba38418084f5c974b3af71bd63117"
  )
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {};

    const keyring = new Keyring();
    this.portisAdapter = PortisAdapter.useKeyring(keyring, { portisAppId });
    this.portisAdapter.initialize();

    this.snapId = new URL("package.json", "http://localhost:8086").toString();

    window.ethereum.send({
      method: "wallet_enable",
      params: [
        {
          wallet_plugin: { [this.snapId]: {} }
        }
      ]
    });
  }

  handlePair = () => {
    this.portisAdapter.pairDevice().then(wallet => {
      this.wallet = wallet;
      debugger;
    });
  };

  handlePay = () => {
    this.form.current.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { receiver, currency, value } = values;
      window.ethereum
        .send({
          method: "wallet_invokePlugin",
          params: [
            this.snapId,
            {
              method: "resolve",
              params: [receiver, currency]
            }
          ]
        })
        .then(address => {
          if (!address) {
            message.error(`${receiver} cannot be resolved for ${currency}`);
            return;
          }

          switch (currency) {
            case ETH:
              return this.wallet
                .ethSignTx({
                  addressNList: bip32ToAddressNList("m/44'/60'/0'/0/0"),
                  nonce: "0x0",
                  gasPrice: "0x5FB9ACA00",
                  gasLimit: "0x186A0",
                  value: web3.utils.toWei(value, "ether"),
                  to: address,
                  chainId: 1
                })
                .then(tx => {
                  web3.eth.sendSignedTransaction(tx.serialized);
                });
            case BTC:
            case LTC:
            case DOGE:
            case BCH:
              message.success(
                `Send ${value}${this.state.currency} to ${address}`
              );
              return;
            default:
              alert("unsupported currency");
          }
        });
    });
  };

  handleValueChange = changedValue => this.setState(changedValue);

  render() {
    const currencyOptions = [
      [ETH, ETH],
      [BTC, BTC],
      [BCH, BCH],
      [LTC, LTC],
      [DOGE, DOGE]
    ];

    const formItems = [
      {
        name: "receiver",
        fieldOptions: {
          placeholder: "Receiver"
        }
      },
      {
        name: "currency",
        field: "select",
        fieldOptions: {
          options: currencyOptions,
          placeholder: "Currency to send"
        },
        rules: [
          {
            message: "Please enter a currency!",
            required: true
          }
        ]
      },
      {
        name: "value",
        fieldOptions: {
          suffix: this.state.currency || "",
          placeholder: "Amount of currency to send"
        },
        rules: [
          {
            message: "Please enter a value!",
            required: true
          }
        ]
      }
    ];

    return (
      <Card title="Humanize Pay">
        <Button onClick={this.handlePair}>Pair Wallet</Button>
        <Form
          ref={this.form}
          items={formItems}
          onValuesChange={this.handleValueChange}
        />
        <Button className={styles.payBtn} onClick={this.handlePay}>
          Pay
        </Button>
      </Card>
    );
  }
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
