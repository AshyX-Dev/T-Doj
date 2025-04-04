export interface PriceTokens {
    amount?: string | undefined;
    tokenPriceInTrx?: number | undefined;
    tokenId?: string | undefined;
    balance?: string | undefined;
    tokenName?: string | undefined;
    tokenDecimal?: number | undefined;
    tokenAbbr?: string | undefined;
    tokenCanShow?: number | undefined;
    tokenType?: string | undefined;
    vip?: boolean | undefined;
    tokenLogo?: string | undefined;
    nrOfTokenHolders?: number | undefined;
    transferCount?: number | undefined;
}

export interface Transit {
    transactions_out?: number | undefined;
    transactions_in?: number | undefined;
    balance?: number | undefined;
    totalTransactionCount?: number | undefined;
    name?: string | undefined;
    withPriceTokens?: PriceTokens[] | [] | undefined;
    address?: string | undefined;
    date_created?: number | undefined;
    activated?: boolean | undefined;
}

export interface RealTransaction {
    contracts?: string[] | [] | undefined;
    contractType?: number | undefined;
    confirmed?: boolean | undefined;
    toAddress?: string | undefined;
    ownerAddress?: string | undefined;
    block?: number | undefined;
    riskTransaction?: boolean | undefined;
    timestamp?: number | undefined;
    urlHash?: string | undefined; // https://tronscan.org/#/transaction/ADDRESS
    balance?: number | undefined; // contractData.balance
    resourceValue?: number | undefined; // contractData.resourceValue
}