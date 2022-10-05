import React from "react";
import {Cancel} from "@material-ui/icons"
import {NumberInput} from "components"

import styles from "./TakeProfitItem.module.scss";
import {QUOTE_CURRENCY, PERCENT} from "../../../constants";
import IconButton from "@material-ui/core/IconButton";
import {ProfitItem} from "../../../model";

type Props = ProfitItem & {
    onFieldChange: (
        id: string,
        changedField: keyof Omit<ProfitItem, "id">,
        newValue: number,
    ) => void;
    onRemoveProfitItem: (id: string) => void;
    onFieldBlur: (
        id: string,
        changedField: keyof Pick<ProfitItem, "profit" | "targetPrice">,
    ) => void,
    activeOrderSide: string
}
const TakeProfitItem = React.memo<Props>(({
                                              id,
                                              profit,
                                              targetPrice,
                                              amount,
                                              errors,
                                              onFieldChange,
                                              onRemoveProfitItem,
                                              onFieldBlur,
                                              activeOrderSide
                                          }: Props) => {

    const handleFieldChange = (fieldName: keyof Omit<ProfitItem, "id">) => (newValue: number | null) => {
        onFieldChange(id, fieldName, newValue ?? 0);
    };

    const labelInputAmount = activeOrderSide === "buy" ? "Amount to sell" : "Amount to buy"

    return <div className={styles.container}>
        <div className={styles.profitInput}>
                <NumberInput
                    label="Profit"
                    variant="underlined"
                    value={profit}
                    onChange={handleFieldChange("profit")}
                    onBlur={() => onFieldBlur(id, "profit")}
                    decimalScale={2}
                    InputProps={{endAdornment: PERCENT}}
                    error={errors?.profit}
                />
        </div>
        <div className={styles.targetPriceInput}>
            <NumberInput
                label="Target price"
                variant="underlined"
                value={targetPrice}
                onChange={handleFieldChange("targetPrice")}
                onBlur={() => onFieldBlur(id, "targetPrice")}
                decimalScale={2}
                InputProps={{endAdornment: QUOTE_CURRENCY}}
                error={errors?.targetPrice}

            />
        </div>
        <div className={styles.amountInput}>
            <NumberInput
                label={labelInputAmount}
                variant="underlined"
                value={amount}
                onChange={handleFieldChange("amount")}
                decimalScale={2}
                InputProps={{endAdornment: PERCENT}}
                error={errors?.amount}
            />
        </div>
        <IconButton className={styles.removeProfitItem} onClick={() => onRemoveProfitItem(id)}>
            <Cancel/>
        </IconButton>
    </div>;
});

export {TakeProfitItem};