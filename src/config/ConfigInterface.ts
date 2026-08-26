interface ConfigInterface {
    port: number;
    db : {
        user: string,
        password: string,
        host: string,
        port: number,
        database: string,
    }
}

export default ConfigInterface;