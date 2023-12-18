"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamo_DB = void 0;
const AWS = __importStar(require("aws-sdk"));
class Dynamo_DB {
    constructor() {
        AWS.config.update({ region: 'us-east-1' });
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }
    get(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: table,
                Key: key
            };
            try {
                const data = yield this.dynamoDb.get(params).promise();
                return data.Item;
            }
            catch (error) {
                console.error("Error fetching from DynamoDB:", error);
                throw error;
            }
        });
    }
    put(table, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: table,
                Item: item
            };
            try {
                yield this.dynamoDb.put(params).promise();
            }
            catch (error) {
                console.error("Error writing to DynamoDB:", error);
                throw error;
            }
        });
    }
    mapRSVP(data) {
        return {
            uid: data.Item.uid.S,
            id: data.Item.id.S,
            idFromQRCode: data.Item.idFromQRCode ? data.Item.idFromQRCode.S : undefined,
            guests: data.Item.guests.L.map((guest) => {
                return {
                    attending: guest.M.attending.BOOL,
                    name: guest.M.name.S,
                    foodPreference: guest.M.foodPreference.S,
                    allergies: guest.M.allergies.SS,
                    additionalNotes: guest.M.additionalNotes ? guest.M.additionalNotes.S : undefined
                };
            })
        };
    }
    getRSVP(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mapRSVP(yield this.get('rsvp', { uid }));
        });
    }
    putRSVP(rsvp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.put('rsvp', rsvp);
        });
    }
}
exports.Dynamo_DB = Dynamo_DB;
