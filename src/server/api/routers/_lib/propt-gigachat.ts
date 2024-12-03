import axios from "axios";
import { th } from "date-fns/locale";
import qs from "qs"
import * as uuid from "uuid";
import https from "https"

// Ваш API-ключ
const API_KEY = 'NzlmNDI0YWYtYjVkOS00NmNlLThjZjMtNTUzOTc3NDczOTM5OjViNzAwNjVjLTE5MjYtNGFhZC1iN2JlLTAyNTc1YzAyYzQxZA==';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Отключает проверку сертификатов
});

async function getToken() {
    const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

    const authorizationKey = API_KEY;

    const response = await axios.post(
        url,
        'scope=GIGACHAT_API_PERS', // Тело запроса
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'RqUID': uuid.v4(), // Генерация уникального идентификатора запроса
                'Authorization': `Basic ${authorizationKey}` // Авторизация
            },
            httpsAgent
        }
    );

    return response.data.access_token;

}

export async function promptGigachat(prompt: string) {
    const token = await getToken();

    const chatResponse = await axios.post(
        'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        {
            "model": "GigaChat-Max",
            messages: [{ role: 'user', content: prompt }],
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            httpsAgent
        }
    );


    return chatResponse.data;
}

// // Пример использования
// const prompt = 'Расскажи что-нибудь интересное о космосе.';
// sendRequestToGigaChat(prompt);