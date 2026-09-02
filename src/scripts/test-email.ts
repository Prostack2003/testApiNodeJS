import emailService from '../services/email.service';

async function main() {
    try {
        await emailService.sendPasswordResetEmail('cool.deds@mail.ru', 'test-token-123');
        console.log('✅ Письмо отправлено!');
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
    }
}

main();