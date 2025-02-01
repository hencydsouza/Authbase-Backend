"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_config_1 = require("./config/app.config");
const app = (0, express_1.default)();
// const BASE_PATH = config.BASE_PATH;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: app_config_1.config.APP_ORIGIN,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    });
});
app.listen(app_config_1.config.PORT, () => {
    console.log(`Server is running on port ${app_config_1.config.PORT}`);
});
