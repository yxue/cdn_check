

declare module "md5-file" {
    export function sync(filename: string): string;
    export function md5File(filename: string, cb: (err: Error, data: string)=>void):void;
}
