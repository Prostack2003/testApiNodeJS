class AppError extends Error {
    public statusCode: number
    public userMessage: string

    constructor(message: string, statusCode: number, userMessage: string) {
        super(message);
        this.statusCode = statusCode;
        this.userMessage = message;
    }
}

export { AppError };