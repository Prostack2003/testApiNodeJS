class AppError extends Error {
    public statusCode: number
    public userMessage: string

    constructor(message: string, statusCode: number, userMessage: string) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.userMessage = userMessage;
    }
}

export { AppError };