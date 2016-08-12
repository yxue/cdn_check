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
function main(ip, domain, dservers, types) {
    return __awaiter(this, void 0, void 0, function* () {
        let cservers = yield util_1.Util.resolve(domain, dservers);
        cservers.push(ip);
        yield util_1.Util.wget(domain, cservers, types);
        let host = ['tmp', domain + '@' + ip].join(path.sep);
        let files = fs.readdirSync('tmp');
        let res = [];
        files.forEach(file => {
            let cdn = ['tmp', file].join(path.sep);
            let tmp = util_1.Util.dircmp(host, cdn);
            console.log(tmp);
            tmp.forEach(t => res.push(t));
        });
        return res;
    });
}
exports.main = main;
