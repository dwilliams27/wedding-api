"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dynamo_1 = require("./utils/dynamo");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const dynamoDb = new dynamo_1.Dynamo_DB();
app.post('/', (req, res) => {
    const body = req.body;
    console.log(dynamoDb.getRSVP(body.rsvp.uid));
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
module.exports = app;
