import * as XLSX from 'xlsx';

import * as iconv from 'iconv-lite';
import * as Papa from 'papaparse';
import { Transaction } from '@prisma/client';
import DateTime from '~/lib/utils/datetime';

function fileToArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = function (e) {
            resolve(e?.target?.result as ArrayBuffer);
        };

        reader.onerror = function (e) {
            reject(e);
        };
    });
}


export type ParsedTransaction = {
    date: Date;
    amount: number;
    type: 'IN' | 'OUT';
    category: string;
    commentary: string;
};

export default async function parseTransactions(file: File) {
    if (!file || !file.name.endsWith('.csv')) {
        throw new Error('необходим файл в формате csv');
    }

    const buffer = await fileToArrayBuffer(file);

    const decoder = new TextDecoder('windows-1251');  // Пример для ANSI
    const csvData = decoder.decode(buffer);

    const res = await new Promise((resolve, reject) => {
        Papa.parse(csvData, {
            delimiter: ';',  // Указание разделителя
            header: true,    // Если в файле есть заголовки
            skipEmptyLines: true, // Пропуск пустых строк
            encoding: 'windows-1251', // Кодировка файла
            complete: function (results) {
                resolve(results);
            },
            error: function (error) {
                reject(error);
            }
        });
    });

    const parsed: ParsedTransaction[] = [];

    for (let item of res.data) {
        if(item['Статус'] !== "OK") continue;

        const date = DateTime.fromFormat(item['Дата операции'], 'dd.MM.yyyy HH:mm:ss').toJSDate();

        if(!item['Сумма операции']) continue;

        const amount = Math.abs(Number(item['Сумма операции'].replace(',', '.')));
        const type = item['Сумма операции'].startsWith('-') ? 'OUT' : 'IN';
        const category = item['Категория'];
        const commentary = item['Описание'];

        parsed.push({
            date,
            amount,
            type,
            category,
            commentary
        });
    }

    return parsed;



    // Преобразуем строку в UTF-8
    // const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
}