interface ISslData {
    readonly ca: string;
    readonly key: string;
    readonly cert: string;
}

export interface IPostgresConfig {
    readonly host: string;
    readonly port: number;
    readonly database: string;
    readonly username: string;
    readonly password: string;
    readonly synchronize: boolean;
    readonly sslOn?: boolean;
    readonly ssl?: ISslData;
}
