import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Row, Col, Input } from "antd";

import styles from "./PinModal.css";

class PinModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: ""
    };
  }

  handlePinDigit = digit => {
    let { pin } = this.state;
    if (digit === "") {
      pin = pin.slice(0, -1);
    } else {
      pin += digit.toString();
    }

    this.setState({ pin });
  };

  render() {
    const { visible, onOk } = this.props;

    return (
      <Modal title="Enter PIN" visible={visible} onOk={onOk} closable={false}>
        <p>
          Use the PIN layout shown on your device to find the location to press
          on this PIN pad.
        </p>
        <Row justify="space-around">
          <Col span={12} push={6}>
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(7)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(8)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(9)}
            >
              &#x25CF;
            </Button>
            <br />
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(4)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(5)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(6)}
            >
              &#x25CF;
            </Button>
            <br />
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(1)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(2)}
            >
              &#x25CF;
            </Button>
            &nbsp;
            <Button
              className={styles.keypad}
              onClick={() => this.handlePinDigit(3)}
            >
              &#x25CF;
            </Button>
            <Input.Search
              type="password"
              size="large"
              value={this.state.pin}
              enterButton={
                <Button onClick={() => this.handlePinDigit("")} icon="left" />
              }
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

PinModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired
};

export default PinModal;
