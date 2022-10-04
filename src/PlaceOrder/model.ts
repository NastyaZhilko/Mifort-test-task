export type OrderSide = "buy" | "sell";
export type ProfitItem = {
    id: string,
    profit: number,
    targetPrice: number,
    amount: number,
    errors?: Partial<Record<keyof Omit<ProfitItem, "id" | "error">, string | null>>;
}
