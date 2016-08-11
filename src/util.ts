/// <reference path='../typings/index.d.ts' />

import * as dns from "dns";
import * as fs from "fs";

export class Util{
    public static resolve(domain: string, server: string){
        return new Promise<any>((resolve, reject)=>{
            var dservers = dns.getServers();
            dns.setServers([server]);
            dns.resolve4(domain, (err, add)=>{
                setTimeout(()=>{dns.setServers(dservers)})
                if(err){
                    reject(err)
                }else{
                    resolve(add);
                }
            });
        });
    }
}