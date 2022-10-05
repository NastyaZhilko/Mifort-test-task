import {v4 as uuidv4} from 'uuid';
import {OrderSide, ProfitItem} from "./model";
import {DEFAULT_PROFIT_AMOUNT_PROP, DEFAULT_PROFIT_INCREMENT} from "./constants";

export const addProfitItem = (
    currentOrders: ProfitItem[],
    price: number,
): ProfitItem[] => {
    if (!currentOrders.length) {
        return [
            {
                id: uuidv4(),
                profit: DEFAULT_PROFIT_INCREMENT,
                targetPrice: price + price * (DEFAULT_PROFIT_INCREMENT / 100),
                amount: 100,
            },
        ];
    }
    let maxAmount = 0;

    let totalAmount = currentOrders.reduce((acc, order) => {
        maxAmount = order.amount > maxAmount ? order.amount : maxAmount;
        return acc + order.amount;
    }, 0);

    const lastCurrentOrder = currentOrders[currentOrders.length - 1];

    const result = currentOrders.map((order) => {
        if (totalAmount > 100 - DEFAULT_PROFIT_AMOUNT_PROP && order.amount === maxAmount) {
            return {
                ...order,
                amount: order.amount - DEFAULT_PROFIT_AMOUNT_PROP - (totalAmount - 100),
            };
        }
        return order;
    })

    result.push({
        id: uuidv4(),
        profit: lastCurrentOrder.profit + DEFAULT_PROFIT_INCREMENT,
        targetPrice: price + price * ((lastCurrentOrder.profit + DEFAULT_PROFIT_INCREMENT) / 100),
        amount: DEFAULT_PROFIT_AMOUNT_PROP,
    });

    return result;
}

export const calculateProjectedProfit = (
    currentOrders: ProfitItem[],
    activeOrderSide: OrderSide,
    price: number,
) => currentOrders.reduce((acc, order) => {
    return acc + (activeOrderSide === 'buy'
        ? order.amount * (order.targetPrice - price) / 100
        : order.amount * (price - order.targetPrice) / 100);
}, 0)

export const validateTakeProfitItems = (
    currentProfitItems: ProfitItem[],
) => {
    let totalAmount = 0;
    let totalProfit = currentProfitItems.reduce((acc, item) => {
        totalAmount += item.amount;
        return acc + item.profit;
    }, 0);

    return currentProfitItems.map((item, index) => {
        const errorObj: ProfitItem['errors'] = {};
        if (totalProfit > 500) {
            errorObj.profit = 'Maximum profit sum is 500%';
        }
        if (totalAmount > 100) {
            errorObj.amount = `${totalAmount} out of 100% selected. Please decrease by ${(100 - totalAmount) * -1}`;
        }
        if (index && currentProfitItems[index - 1].profit >= item.profit) {
            errorObj.profit = "Each target's profit should be greater than the previous one";
        }
        if (item.profit < 0.01) {
            errorObj.profit = 'Minimum value is 0.01';
        }
        if (item.targetPrice <= 0) {
            errorObj.targetPrice = 'Price must be greater than 0';
        }
        return {
            ...item,
            errors: errorObj,
        };
    })
}

export const recalculateTakeProfit = (
    currentOrders: ProfitItem[],
    price: number,
) => currentOrders.map((order) => ({
    ...order,
    targetPrice: price + price * (order.profit / 100),
}));


export const onTakeProfitItemFieldBlur = (
    currentItems: ProfitItem[],
    choosenItmId: string,
    changedField: keyof Pick<ProfitItem, "profit" | "targetPrice">,
    price: number,
) => currentItems.map((item) => {
    if (item.id !== choosenItmId) {
        return {
            ...item,
            errors: undefined,
        };
    }
    switch (changedField) {
        case 'profit':
            return {
                ...item,
                targetPrice: price + price * (item.profit / 100),
                errors: undefined,
            };
        case 'targetPrice':
            return {
                ...item,
                profit: (item.targetPrice - price) / (price || 1) * 100,
                errors: undefined,
            };
        default:
            return {
                ...item,
                errors: undefined,
            };
    }
})
