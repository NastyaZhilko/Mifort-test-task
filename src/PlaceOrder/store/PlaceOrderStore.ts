import {observable, computed, action} from "mobx";

import {OrderSide, ProfitItem} from "../model";
import {
    addProfitItem,
    calculateProjectedProfit,
    onTakeProfitOrderFieldBlur,
    recalculateTakeProfit,
    validateTakeProfitOrders
} from "../utils";


export class PlaceOrderStore {
    @observable activeOrderSide: OrderSide = "buy";
    @observable price: number = 0;
    @observable amount: number = 0;
    @observable profitMode: boolean = false;
    @observable profitList: ProfitItem[] = [];

    @computed get total(): number {
        return this.price * this.amount;
    }

    @computed get projectedProfit(): number {
        return calculateProjectedProfit(
            this.profitList,
            this.activeOrderSide,
            this.price,
        );
    }

    @action.bound
    public setOrderSide(side: OrderSide) {
        this.activeOrderSide = side;
    }

    @action.bound
    public setPrice(price: number) {
        this.price = price;
        this.profitList = recalculateTakeProfit(this.profitList, this.price);
    }

    @action.bound
    public setAmount(amount: number) {
        this.amount = amount;
    }

    @action.bound
    public setTotal(total: number) {
        this.amount = this.price > 0 ? total / this.price : 0;
    }

    @action.bound
    public setProfitMode(profitMode: boolean) {
        this.profitMode = profitMode
        this.profitList = profitMode ? addProfitItem([], this.price) : []
    }

    @action.bound
    public addProfitItem() {
        this.profitList = addProfitItem(this.profitList, this.price);
    }

    @action.bound
    public removeProfitItem(id: string) {
        this.profitList = this.profitList.filter(item => item.id !== id)
        if (!this.profitList.length) {
            this.profitMode = false
        }
    }

    @action.bound
    public validateTakeProfits() {
        this.profitList = validateTakeProfitOrders(this.profitList);
    }

    @action.bound
    public handleBlurTakeProfitField(
        choosenOrderId: string,
        changedField: keyof Pick<ProfitItem, "profit" | "targetPrice">,
    ) {
        this.profitList = onTakeProfitOrderFieldBlur(
            this.profitList,
            choosenOrderId,
            changedField,
            this.price,
        );
    }

    @action.bound
    public changeTakeProfitItem(
        id: string,
        changedField: keyof Omit<ProfitItem, "id">,
        newValue: number,
    ) {
        this.profitList = this.profitList.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    [changedField]: newValue,
                }
            }
            return item;
        });
    }

}
