import {Util} from './util';
import * as fs from 'fs';
import * as path from 'path';

export async function main(ip: string, domain: string, dservers: string[], types: string[]){
    let cservers = await Util.resolve(domain, dservers);
    cservers.push(ip);
    await Util.wget(domain, cservers, types);
    let host = ['tmp', domain+'@'+ip].join(path.sep);
    let files = fs.readdirSync('tmp');
    let res = [];
    files.forEach(file=>{
        let cdn = ['tmp', file].join(path.sep);
        let tmp = Util.dircmp(host, cdn);
        console.log(tmp);
        tmp.forEach(t=>res.push(t));
    });
    return res;
}
