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
    console.log(res);
    return res;
}

export async function test(){
    //var res = await Util.resolve('m.escort.ford.com.cn', ['182.90.252.10', '111.50.74.180', '211.139.73.34']);
    //console.log(res);
    //await Util.wget('m.escort.ford.com.cn', res, ['html','css','js']);
    //let domain = 'm.escort.ford.com.cn';
    //let ip = '111.20.249.7';
    //let host = ['tmp', domain+'@'+ip].join(path.sep);
    //let files = fs.readdirSync('tmp');
    //files.forEach(file=>{
    //    let cdn = ['tmp', file].join(path.sep);
    //    let tmp = Util.dircmp(host, cdn);
    //    console.log(tmp);
    //});
}

//test();
main('139.219.140.69', 'm.escort.ford.com.cn', ['182.90.252.10', '111.50.74.180', '211.139.73.34'], ['html','css','js']);
