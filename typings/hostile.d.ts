

declare module "hostile"{
    export function get(preserveFormatting: boolean, cb: (err: Error, lines: string[])=>void);
    export function set(ip: string, host: string, cb: (err: Error)=>void);
    export function remove(ip: string, host: string, cb: (err: Error)=>void);
    export function writeFile(lines: string[], cb: (err: Error)=>void);
}