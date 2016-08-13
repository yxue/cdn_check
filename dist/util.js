/// <reference path='../typings/index.d.ts' />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const dns = require("dns");
const fs = require("fs");
const hostile = require('hostile');
const child_process = require('child_process');
const path = require('path');
const md5file = require('md5-file');
class Util {
    static unique(arr) {
        return arr.filter(function (item, pos) {
            return arr.indexOf(item) == pos;
        });
    }
    static _resolve(domain, server) {
        return new Promise((resolve, reject) => {
            let dservers = dns.getServers();
            dns.setServers([server]);
            dns.resolve4(domain, (err, add) => {
                if (err)
                    console.log(err);
                setTimeout(() => {
                    dns.setServers(dservers);
                    if (err) {
                        resolve([]);
                    }
                    else {
                        resolve(add);
                    }
                });
            });
        });
    }
    static resolve(domain, servers) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            for (let i = 0; i < servers.length; i++) {
                let tmp = yield this._resolve(domain, servers[i]);
                console.log(tmp);
                tmp.forEach(e => {
                    res.push(e);
                });
            }
            return this.unique(res);
        });
    }
    static _wget(domain, ip, types) {
        return new Promise((resolve, reject) => {
            hostile.set(ip, domain, (err) => {
                if (err) {
                    resolve({
                        error: err,
                        ip: ip,
                        domain: domain
                    });
                }
                else {
                    let error = "";
                    let cmd = 'wget -m -nd -A ' + types.join(',') + ' -P ./tmp/' + domain + '@' + ip + ' ' + domain;
                    console.log(cmd);
                    child_process.exec(cmd, { timeout: 30000 }, (err, stdout, stderr) => {
                        hostile.remove(ip, domain, (error) => {
                            resolve({
                                error: error,
                                ip: ip,
                                domain: domain
                            });
                        });
                    });
                }
            });
        });
    }
    static wget(domain, ip, types) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var i = 0; i < ip.length; i++) {
                yield this._wget(domain, ip[i], types);
            }
        });
    }
    static dircmp(dir1, dir2) {
        let res = [];
        if (dir1 == dir2)
            return res;
        let files = fs.readdirSync(dir1);
        let sep = path.sep;
        files.forEach(file => {
            let name1 = [dir1, file].join(sep);
            let name2 = [dir2, file].join(sep);
            let stats = fs.statSync(name1);
            if (stats.isFile()) {
                try {
                    if (fs.statSync(name2).isFile()) {
                        if (md5file.sync(name1) != md5file.sync(name2)) {
                            res.push({
                                host: name1,
                                cdn: name2,
                                reason: 'MD5 Fail'
                            });
                        }
                    }
                    else {
                        res.push({
                            host: name1,
                            cdn: name2,
                            reason: 'Can\'t find file'
                        });
                    }
                }
                catch (error) {
                    res.push({
                        host: name1,
                        cdn: name2,
                        reason: 'Can\'t find file'
                    });
                }
            }
            else if (stats.isDirectory()) {
                try {
                    if (fs.statSync(name2).isDirectory()) {
                        let ret = this.dircmp(name1, name2);
                        ret.forEach(e => res.push(e));
                    }
                    else {
                        res.push({
                            host: name1,
                            cdn: name2,
                            reason: 'Can\'t find directory'
                        });
                    }
                }
                catch (error) {
                    res.push({
                        host: name1,
                        cdn: name2,
                        reason: 'Can\'t find directory'
                    });
                }
            }
        });
        return res;
    }
}
exports.Util = Util;
