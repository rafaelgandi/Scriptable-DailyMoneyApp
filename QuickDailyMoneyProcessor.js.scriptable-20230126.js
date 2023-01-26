// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: money-bill-wave;

const TODAY = new Date();
const TODAY_KEY = formatDate(TODAY.getTime());

const fm = FileManager.iCloud();
const dbSourcePath = fm.documentsDirectory() + `/DailyMoney/db.json`;
if (!fm.fileExists(dbSourcePath)) { 
    fm.writeString(dbSourcePath, '{}');
}
await fm.downloadFileFromiCloud(dbSourcePath);

let rawDbData = fm.readString(dbSourcePath);
if (rawDbData.trim() === '') {
    rawDbData = '{}';
}

let APP_DATA = JSON.parse(rawDbData);
if (!('days' in APP_DATA)) {
    APP_DATA['days'] = {};
}

function saveData(appData) {
    fm.writeString(dbSourcePath, appData);
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    let date = d.getDate();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    if (date < 10) {
        date = '0' + date;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${date}`;
}

function pfloat(v) {
    if (typeof v === 'string' && v.trim() === '') { return 0; }
    let num = parseFloat(v);
    if (num < 0) { return 0; }
    return parseFloat(num.toFixed(2));
}

function makeTodayIfNotExists() {
    if (!APP_DATA.days?.[TODAY_KEY]) {
        APP_DATA.days[TODAY_KEY] = [];
    }  
}

function sortDataByTime() {
    Object.keys(APP_DATA.days).forEach((key) => {
        APP_DATA.days[key].sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            return 0;
        });
    });
    sortDataByDate();
}

function sortDataByDate() {
    let copy = {};
    let dates = Object.keys(APP_DATA.days);
    dates.sort((a, b) => {
        let aTimestamp = (new Date(a)).getTime();
        let bTimestamp = (new Date(b)).getTime();
        if (aTimestamp < bTimestamp) {
            return 1;
        }
        if (aTimestamp > bTimestamp) {
            return -1;
        }
        return 0;
    });
    dates.forEach((date) => {
        copy[date] = (APP_DATA.days[date]);
    });
    //console.log(copy);
    APP_DATA.days = copy;
}

function addItemForToday(value, isExpense = 1) {
    makeTodayIfNotExists();
    APP_DATA.days[TODAY_KEY].push({
        timestamp: (new Date()).getTime(),
        value: pfloat(value),
        isExpense
    });
    sortDataByTime();
    saveData(JSON.stringify(APP_DATA));
}


const valFromUser = (args.shortcutParameter) 
    ? Number(args.shortcutParameter) 
    : 0;

if (isNaN(valFromUser) || valFromUser === 0) {
    Script.complete();    
    return;
}

let positiveValue = (valFromUser < 0) ? (valFromUser * -1) : valFromUser;

// Add to current db json file for DailyMoney app.
addItemForToday(positiveValue, 1);

Script.setShortcutOutput(valFromUser);

