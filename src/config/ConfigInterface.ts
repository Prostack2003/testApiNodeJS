interface ConfigInterface {
    port: number;
    db : {
        user: string,
        password: string,
        host: string,
        port: number,
        database: string,
    };
    jwt: {
        secret: string,
        expiresIn: string,
    }
}

export default ConfigInterface;