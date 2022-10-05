import React from "react";
import {AddCircle} from "@material-ui/icons"
import {Switch, Tooltip, TextButton} from "components"
import {ReactComponent as Info} from './../../../assets/images/info.svg';

import styles from "./TakeProfit.module.scss";
import {observer} from "mobx-react";
import {useStore} from "../../context";
import {MAX_COUNT_PROFIT, QUOTE_CURRENCY} from "../../constants";
import {TakeProfitItem} from "./components/TakeProfitItem";
import {ProfitItem} from "../../model";

const TakeProfit = observer(() => {
    const {
        profitMode,
        setProfitMode,
        profitList,
        addProfitItem,
        projectedProfit,
        changeTakeProfitItem,
        removeProfitItem,
        handleBlurTakeProfitField,
        activeOrderSide
    } = useStore()

    const onFieldChange = React.useCallback((
        id: string,
        changedField: keyof Omit<ProfitItem, "id">,
        newValue: number,
    ) => {
        changeTakeProfitItem(id, changedField, newValue);
    }, [changeTakeProfitItem]);

    const onRemoveProfitItem = React.useCallback((id: string) => {
        removeProfitItem(id);
    }, [removeProfitItem]);

    const onFieldBlur = React.useCallback((
        id: string,
        changedField: keyof Pick<ProfitItem, "profit" | "targetPrice">,
    ) => {
        handleBlurTakeProfitField(id, changedField);
    }, [handleBlurTakeProfitField])

    return <div className={styles.container}>
        <div className={styles.header}>
            <Tooltip message='Click the switch to set profit'>
                <div className={styles.tooltip}>Take Profit <Info/></div>
            </Tooltip>
            <Switch checked={profitMode} onChange={(e) => setProfitMode(e)}/>
        </div>
        {profitMode &&
            < >
                <div className={styles.takeProfitItems}>
                    {profitList.map(item =>
                        <TakeProfitItem
                            key={item.id}
                            id={item.id}
                            profit={item.profit}
                            targetPrice={item.targetPrice}
                            amount={item.amount}
                            errors={item.errors}
                            onFieldChange={onFieldChange}
                            onRemoveProfitItem={onRemoveProfitItem}
                            onFieldBlur={onFieldBlur}
                            activeOrderSide={activeOrderSide}
                        />)}
                </div>
                {profitList.length !== MAX_COUNT_PROFIT &&
                    <div className={styles.addProfit}>
                        <TextButton onClick={addProfitItem}>
                            <AddCircle/>
                            <span>Add profit target {profitList.length} / {MAX_COUNT_PROFIT}</span>
                        </TextButton>
                    </div>
                }
            </>
        }
        <div className={styles.projectedProfit}>
            <span>Projected profit</span>
            <span> <span className={styles.result}>{projectedProfit}</span> {QUOTE_CURRENCY}</span>

        </div>
    </div>;
});

export {TakeProfit};
