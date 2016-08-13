import {Util} from './util';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

export async function check(ip: string, domain: string, dservers: string[], types: string[]){
    return new Promise<any>(async (resolve, reject)=>{
        let cs = await Util.resolve(domain, dservers);
        cs.push(ip);
        await Util.wget(domain, cs, types);
        let host = ['tmp', domain+'@'+ip].join(path.sep);
        let files = fs.readdirSync('tmp');
        let res = [];
        files.forEach(file=>{
            let cdn = ['tmp', file].join(path.sep);
            let tmp = Util.dircmp(host, cdn);
            tmp.forEach(t=>res.push(t));
        });
        child_process.execSync('rm -r ./tmp');
        resolve(res);
    });
}
