"use strict";
// fetch("https://apilist.tronscanapi.com/api/accountv2?address=TG5wUqBkukAho2E38ca3EZG4zvYp3hUivZ").then((res) => {
//     res.json().then((d) => {
//         console.log(d)
//     })
// })
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
var axios_1 = require("axios");
var Network = /** @class */ (function () {
    function Network() {
    }
    Network.prototype.getAccountInfo = function (hash_1) {
        return __awaiter(this, arguments, void 0, function (hash, callback) {
            var _this = this;
            if (callback === void 0) { callback = function () { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://apilist.tronscanapi.com/api/accountv2?address=".concat(hash), {
                            headers: {
                                "Content-Types": "application/json"
                            }
                        }).then(function (resp) { return __awaiter(_this, void 0, void 0, function () {
                            var _, transactions_out, transactions_in, balance, totalTransactionCount, name, withPriceTokens, address, date_created, activated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, resp.data];
                                    case 1:
                                        _ = _a.sent();
                                        transactions_out = _.transactions_out, transactions_in = _.transactions_in, balance = _.balance, totalTransactionCount = _.totalTransactionCount, name = _.name, withPriceTokens = _.withPriceTokens, address = _.address, date_created = _.date_created, activated = _.activated;
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
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype.getTransactionInfo = function (hash_1) {
        return __awaiter(this, arguments, void 0, function (hash, callback) {
            var _this = this;
            if (callback === void 0) { callback = function () { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://apilist.tronscanapi.com/api/transaction-info?hash=".concat(hash), {
                            headers: {
                                "Content-Types": "application/json"
                            }
                        }).then(function (resp) { return __awaiter(_this, void 0, void 0, function () {
                            var _, contract_map, contractType, confirmed, toAddress, ownerAddress, block, riskTransaction, timestamp, urlHash, balance, resourceValue;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, resp.data];
                                    case 1:
                                        _ = _c.sent();
                                        contract_map = _.contract_map, contractType = _.contractType, confirmed = _.confirmed, toAddress = _.toAddress, ownerAddress = _.ownerAddress, block = _.block, riskTransaction = _.riskTransaction, timestamp = _.timestamp;
                                        urlHash = "https://tronscan.org/#/transaction/".concat(hash);
                                        balance = ((_a = _['contractData']) === null || _a === void 0 ? void 0 : _a['amount']) / 1000;
                                        resourceValue = (_b = _['contractData']) === null || _b === void 0 ? void 0 : _b['resourceValue'];
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
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Network;
}());
exports.Network = Network;
