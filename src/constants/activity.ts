const DEFAULT_ACTIVITY_LEVEL = 1;

const ACTIVITY_MULTIPLIERS: Record<number, number> = {
    1: 1.2,    // Сидячий
    2: 1.375,  // Лёгкая активность (1-3 тренировки в неделю)
    3: 1.55,   // Умеренная (3-5 тренировок)
    4: 1.725,  // Высокая (6-7 тренировок)
    5: 1.9,    // Очень высокая (тяжёлая работа + тренировки)
};

export { DEFAULT_ACTIVITY_LEVEL, ACTIVITY_MULTIPLIERS };