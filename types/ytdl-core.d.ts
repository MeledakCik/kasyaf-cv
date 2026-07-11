// types/ytdl-core.d.ts
declare module 'ytdl-core' {
  export function validateURL(url: string): boolean;
  export function getInfo(url: string): Promise<any>;
  export function filterFormats(formats: any[], filter: string): any[];
  export function chooseFormat(formats: any[], options: any): any;
  const ytdl: {
    validateURL: typeof validateURL;
    getInfo: typeof getInfo;
    filterFormats: typeof filterFormats;
    chooseFormat: typeof chooseFormat;
  };
  export default ytdl;
}