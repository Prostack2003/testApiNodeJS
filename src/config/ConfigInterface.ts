interface ConfigInterface {
    port: number;
    db : {
        user: string,
        password: string,
        host: string,
        port: number,
        database: string,
    };
    redis: {
        host: string,
        port: number,
    }
    jwt: {
        secret: string,
        expiresIn: string,
    },
    smtp: {
        host: string,
        port: number,
        user: string,
        pass: string,
        from: string,
    },
    frontendUrl: string
}

export default ConfigInterface;