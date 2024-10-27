"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
// Load .env file located in the root of the project
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env') });
