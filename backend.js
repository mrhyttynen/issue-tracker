"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
// TODO: move this to src folder
var sqlite3_1 = require("sqlite3");
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());
var jsonParser = bodyParser.json();
var backendPort = 8080;
var frontEndPort = 3000;
var IssueStatus;
(function (IssueStatus) {
    IssueStatus[IssueStatus["OPEN"] = 0] = "OPEN";
    IssueStatus[IssueStatus["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    IssueStatus[IssueStatus["RESOLVED"] = 2] = "RESOLVED";
    IssueStatus[IssueStatus["CLOSED"] = 3] = "CLOSED";
})(IssueStatus || (IssueStatus = {}));
var execute = function (db, sql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.exec(sql, function (err) {
                    if (err)
                        reject(err);
                    resolve();
                });
            })];
    });
}); };
// default OPEN_CREATE
var db = new sqlite3_1.Database("issues.db");
var createTablesAndAddUsersIfNotExist = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, execute(db, "\n      PRAGMA foreign_keys = ON;\n      CREATE TABLE IF NOT EXISTS users (\n        email TEXT PRIMARY KEY,\n        name TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS issues (\n        id TEXT PRIMARY KEY,\n        title TEXT NOT NULL,\n        status TEXT NOT NULL,\n        description TEXT,\n        assigneeEmail TEXT NOT NULL,\n        startDate DATE NOT NULL,\n        FOREIGN KEY (assigneeEmail) REFERENCES users(email)\n      );\n\n      INSERT OR IGNORE INTO users (email, name) VALUES \n        ('a@user.com', 'userA'),\n        ('b@user.com', 'userB'),\n        ('c@user.com', 'userC');\n      ")];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var fetchAll = function (db, sql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.all(sql, function (err, rows) {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
            })];
    });
}); };
createTablesAndAddUsersIfNotExist().then(function () {
    console.log("Database setup complete");
});
// DEFINE ROUTES:
// POST /issues     Create new issue
app.post('/issues', jsonParser, cors({ origin: "http://localhost:".concat(frontEndPort) }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newIssue, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("calling POST /issues");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                newIssue = {
                    id: crypto.randomUUID(),
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    assigneeEmail: req.body.assigneeEmail,
                    startDate: new Date()
                };
                return [4 /*yield*/, execute(db, "INSERT INTO issues (id, title, status, assigneeEmail, startDate, description) VALUES (\n        '".concat(newIssue.id, "', '").concat(newIssue.title, "', '").concat(newIssue.status, "', '").concat(newIssue.assigneeEmail, "', '").concat(newIssue.startDate, "', '").concat(newIssue.description, "'\n      );"))];
            case 2:
                _a.sent();
                res.status(201).json(newIssue);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(400).json(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /issues      Retrieve all issues
app.get('/issues', cors({ origin: "http://localhost:".concat(frontEndPort) }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allIssues, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('calling GET /issues');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchAll(db, "SELECT * FROM issues;")];
            case 2:
                allIssues = _a.sent();
                res.status(200).json(allIssues);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(400).json(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /issues/:assigneeEmail       Retrieve my issues
app.get('/issues/:assigneeEmail', cors({ origin: "http://localhost:".concat(frontEndPort) }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assigneeIssues, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('calling GET /issues with');
                console.log(req.params.assigneeEmail);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchAll(db, "SELECT * FROM issues WHERE assigneeEmail='".concat(req.params.assigneeEmail, "';"))];
            case 2:
                assigneeIssues = _a.sent();
                res.status(200).json(assigneeIssues);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.log(error_4);
                res.status(400).json(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// DELETE /issues/:id       Delete issue
app["delete"]('/issues/:id', cors({ origin: "http://localhost:".concat(frontEndPort) }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("calling DELETE with");
                console.log(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, execute(db, "DELETE FROM issues WHERE id='".concat(req.params.id, "';"))];
            case 2:
                _a.sent();
                res.status(204);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(400).json(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Start the server
app.listen(backendPort, function () {
    console.log("Backend running on Port ".concat(backendPort));
});
