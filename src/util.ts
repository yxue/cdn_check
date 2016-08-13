/// <reference path='../typings/index.d.ts' />

import * as dns from "dns";
import * as fs from "fs";
import * as hostile from 'hostile';
import * as child_process from 'child_process';
import * as path from 'path';
import * as md5file from 'md5-file';

export class Util{
    public static unique(arr:any[]): any[]{
        return arr.filter(function(item, pos){
            return arr.indexOf(item) == pos;
        })
    }

    private static _resolve(domain: string, server: string){
        return new Promise<any>((resolve, reject)=>{
            let dservers = dns.getServers();
            dns.setServers([server]);
            dns.resolve4(domain, (err, add)=>{
                if(err) console.log(err);
                setTimeout(()=>{
                    dns.setServers(dservers);
                    if(err){
                        resolve([]);
                    }else{
                        resolve(add);
                    }    
                })
            });
        });
    }

    public static async resolve(domain: string, servers: string[]){
        let res = [];
        for(let i = 0; i < servers.length; i ++){
            let tmp = await this._resolve(domain, servers[i]);
            console.log(tmp);
            tmp.forEach(e => {
                res.push(e);
            });
        }
        return this.unique(res);
    }

    public static _wget(domain: string, ip: string, types: string[]){
        return new Promise<any>((resolve, reject)=>{
            hostile.set(ip, domain, (err)=>{
                if(err){
                    resolve({
                        error: err,
                        ip: ip,
                        domain: domain
                    })
                }else{
                    let error = "";
                    let cmd = 'wget -m -nd -A '+ types.join(',') + ' -P ./tmp/' + domain + '@' + ip + ' ' + domain;
                    console.log(cmd);
                    child_process.exec(cmd, {timeout: 30000}, (err, stdout, stderr)=>{  
                        hostile.remove(ip, domain, (error)=>{
                            resolve({
                                error: error,
                                ip: ip,
                                domain: domain
                            })
                        });
                    })
                }
            });
        });
    }

    public static async wget(domain: string, ip: string[], types: string[]){
        for(var i = 0; i < ip.length; i ++){
            await this._wget(domain, ip[i], types);
        }
    }
    
    public static dircmp(dir1: string, dir2: string): any[]{
        let res = [];
        if(dir1 == dir2) return res;
        
        let files = fs.readdirSync(dir1);
        let sep = path.sep;

        files.forEach(file=>{
            let name1 = [dir1, file].join(sep);
            let name2 = [dir2, file].join(sep);
            
            let stats = fs.statSync(name1);
            if(stats.isFile()){
                try {
                    if(fs.statSync(name2).isFile()){
                        if(md5file.sync(name1) != md5file.sync(name2)){
                            res.push({
                                host: name1,
                                cdn: name2,
                                reason: 'MD5 Fail'
                            });
                        }
                    }else{
                        res.push({
                            host: name1,
                            cdn: name2,
                            reason: 'Can\'t find file'
                        })
                    }
                } catch (error) {
                    res.push({
                        host: name1,
                        cdn: name2,
                        reason: 'Can\'t find file'
                    })                    
                }
            }else if(stats.isDirectory()){
                try {
                    if(fs.statSync(name2).isDirectory()){
                        let ret = this.dircmp(name1, name2);
                        ret.forEach(e=>res.push(e));
                    }else{
                        res.push({
                            host: name1,
                            cdn: name2,
                            reason: 'Can\'t find directory'
                        })
                    }
                } catch (error) {
                    res.push({
                        host: name1,
                        cdn: name2,
                        reason: 'Can\'t find directory'
                    })
                }
            }
        })
        return res;
    }
}
