import pool from "../db/pool.ts";
import {User} from "../interfaces/domain.interfaces";
import {ACTIVITY_MULTIPLIERS} from "../constants/activity.ts";

async function getUserById (userId: number) {
    const getUserQuery = `
        SELECT 
            id, 
            name, 
            email, 
            age::INT as age, 
            weight::FLOAT as weight, 
            height::INT as height, 
            gender, 
            activity_level::FLOAT as "activityLevel"  
        FROM users 
        WHERE id = $1
        `
    const getResult = await pool.query<User>(getUserQuery, [userId]);

    if (getResult.rows.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const dbUser = getResult.rows[0];

    return {
        ...dbUser,
        tdee: await calculateTDEE(dbUser)
    };
}

async function calculateTDEE (user: User): Promise<number> {
    let BMR = 0;
    if (user.gender === "M") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else if (user.gender === "F") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    const multiplier = ACTIVITY_MULTIPLIERS[user.activityLevel]

    const result = BMR * multiplier;

    return Math.round(result * 10) / 10;
}

export { getUserById, calculateTDEE };