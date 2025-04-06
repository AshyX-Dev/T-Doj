// fetch("https://apilist.tronscanapi.com/api/accountv2?address=TG5wUqBkukAho2E38ca3EZG4zvYp3hUivZ").then((res) => {
//     res.json().then((d) => {
//         console.log(d)
//     })
// })

import { Transit, RealTransaction } from "./interface";
import axios from 'axios';

export class Network {
    async getAccountInfo(hash: string, callback: (resp: Transit) => void = () => {}){
        await axios.get(`https://apilist.tronscanapi.com/api/accountv2?address=${hash}`, {
            headers: {
                "Content-Types": "application/json"
            }
        }).then(async (resp) => {
            const _ = await resp.data;
            const {
                transactions_out,
                transactions_in,
                balance,
                totalTransactionCount,
                name,
                withPriceTokens,
                address,
                date_created,
                activated,
            } = _;
            callback({
                transactions_out: transactions_out,
                transactions_in: transactions_in,
                balance: balance,
                totalTransactionCount: totalTransactionCount,
                name: name,
                withPriceTokens: withPriceTokens,
                address: address,
                date_created: date_created,
                activated: activated
            });
        })
    }

    async getTransactionInfo(hash: string, callback: (resp: RealTransaction) => void = () => {}){
        await axios.get(`https://apilist.tronscanapi.com/api/transaction-info?hash=${hash}`, {
            headers: {
                "Content-Types": "application/json"
            }
        }).then(async (resp) => {
            const _ = await resp.data;
            const {
                contract_map,
                contractType,
                confirmed,
                toAddress,
                ownerAddress,
                block,
                riskTransaction,
                timestamp,
            } = _;

            const urlHash = `https://tronscan.org/#/transaction/${hash}`;
            const balance = _['contractData']?.['amount'] / 1000;
            const resourceValue = _['contractData']?.['resourceValue'];

            callback({
                contracts: contract_map !== undefined ? Object.keys(contract_map) : [],
                contractType: contractType,
                confirmed: confirmed,
                toAddress: toAddress,
                ownerAddress: ownerAddress,
                block: block,
                riskTransaction: riskTransaction,
                resourceValue: resourceValue,
                timestamp: timestamp,
                urlHash: urlHash,
                balance: balance
            });
        })
    }

}