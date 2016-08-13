"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util_1 = require('./util');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
function check(ip, domain, dservers, types, saveFile) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let cs = yield util_1.Util.resolve(domain, dservers);
            cs.push(ip);
            yield util_1.Util.wget(domain, cs, types);
            let host = ['tmp', domain + '@' + ip].join(path.sep);
            let files = fs.readdirSync('tmp');
            let res = [];
            files.forEach(file => {
                let cdn = ['tmp', file].join(path.sep);
                let tmp = util_1.Util.dircmp(host, cdn);
                tmp.forEach(t => res.push(t));
            });
            if (!saveFile)
                child_process.execSync('rm -r ./tmp');
            resolve(res);
        }));
    });
}
exports.check = check;
