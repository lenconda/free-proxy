export interface IFreeProxy {
  ip: string;
  port: string;
  country: string;
  countryCode: string;
  protocol: string;
  connect_time: string;
  up_time: string;
  last_update: string;
  speed_download: string;
  url: string;
}

declare class ProxyList {
  get(): Promise<IFreeProxy[]>;
  getByCountryCode(countryCode: string): Promise<IFreeProxy[]>;
  getByProtocol(protocol: string): Promise<IFreeProxy[]>;
  random(): Promise<IFreeProxy | undefined>;
  randomByCountryCode(countryCode: string): Promise<IFreeProxy | undefined>;
  randomByProtocol(protocol: string): Promise<IFreeProxy | undefined>;
  randomFromCache(): Promise<IFreeProxy | undefined>;
}

declare module "free-proxy"{
  export = ProxyList;
}
