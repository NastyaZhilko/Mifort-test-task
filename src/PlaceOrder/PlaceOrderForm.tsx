import React from "react";
import { observer } from "mobx-react";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

import { NumberInput, Button } from "components";

import { BASE_CURRENCY, QUOTE_CURRENCY } from "./constants";
import { useStore } from "./context";
import { PlaceOrderTypeSwitch } from "./components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "./components/TakeProfit/TakeProfit";

import styles from "./PlaceOrderForm.module.scss";

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
    validateTakeProfits
  } = useStore();

  return (
    <form className={styles.root}>
      <div className={styles.header}>
        Binance: {`${BASE_CURRENCY} / ${QUOTE_CURRENCY}`}
        <IconButton className={styles.closeIcon}>
          <CancelIcon />
        </IconButton>
      </div>
      <div className={styles.content}>
        <div className={styles.typeSwitch}>
          <PlaceOrderTypeSwitch
            activeOrderSide={activeOrderSide}
            onChange={setOrderSide}
          />
        </div>
        <div className={styles.price}>
          <NumberInput
            label="Price, USDT"
            value={price}
            onChange={(value) => setPrice(Number(value))}
          />
        </div>
        <div className={styles.amount}>
          <NumberInput
            value={amount}
            label="Amount, BTC"
            onChange={(value) => setAmount(Number(value))}
          />
        </div>
        <div className={styles.total}>
          <NumberInput
            value={total}
            label="Total, USDT"
            onChange={(value) => setTotal(Number(value))}
          />
        </div>
        <div className={styles.takeProfit}>
          <TakeProfit />
        </div>
        <div className="submit">
          <Button
            color={activeOrderSide === "buy" ? "green" : "red"}
            type="submit"
            fullWidth
            onClick={(event) => {
              event.preventDefault();
              validateTakeProfits();
            }}
          >
            {activeOrderSide === "buy"
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </div>
    </form>
  );
});
