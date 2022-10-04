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

export const validateTakeProfitOrders = (
    currentOrders: ProfitItem[],
) => {
    let totalAmount = 0;
    let totalProfit = currentOrders.reduce((acc, order) => {
        totalAmount += order.amount;
        return acc + order.profit;
    }, 0);

    return currentOrders.map((order, index) => {
        const errorObj: ProfitItem['errors'] = {};
        if (totalProfit > 500) {
            errorObj.profit = 'Maximum profit sum is 500%';
        }
        if (totalAmount > 100) {
            errorObj.amount = `${totalAmount} out of 100% selected. Please decrease by ${(100 - totalAmount) * -1}`;
        }
        if (index && currentOrders[index - 1].profit >= order.profit) {
            errorObj.profit = "Each target's profit should be greater than the previous one";
        }
        if (order.profit < 0.01) {
            errorObj.profit = 'Minimum value is 0.01';
        }
        if (order.targetPrice <= 0) {
            errorObj.targetPrice = 'Price must be greater than 0';
        }
        return {
            ...order,
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


export const onTakeProfitOrderFieldBlur = (
    currentOrders: ProfitItem[],
    choosenOrderId: string,
    changedField: keyof Pick<ProfitItem, "profit" | "targetPrice">,
    price: number,
) => currentOrders.map((order) => {
    if (order.id !== choosenOrderId) {
        return {
            ...order,
            errors: undefined,
        };
    }
    switch (changedField) {
        case 'profit':
            return {
                ...order,
                targetPrice: price + price * (order.profit / 100),
                errors: undefined,
            };
        case 'targetPrice':
            return {
                ...order,
                profit: (order.targetPrice - price) / (price || 1) * 100,
                errors: undefined,
            };
        default:
            return {
                ...order,
                errors: undefined,
            };
    }
})
