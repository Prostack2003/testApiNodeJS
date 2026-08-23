function errorHandler(err, req, res, next) {
    // Битый JSON от express.json()
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Невалидный JSON' });
    }

    // Ошибки сервиса
    if (err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    if (err.message === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Продукт не найден' });
    }
    if (err.message === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: 'weight_grams должен быть > 0' });
    }
    if (err.message === 'NOTHING_TO_UPDATE') {
        return res.status(400).json({ error: 'Нечего обновлять' });
    }
    if (err.message === 'MEAL_NOT_FOUND') {
        return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Неизвестная ошибка
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;


