// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;



const fm = FileManager.iCloud();
const DIRECTORIES = [
    fm.documentsDirectory() + '/DailyMoney/'
];
const FILES = [
    {
        source: 'https://raw.githubusercontent.com/rafaelgandi/Scriptable-DailyMoneyApp/main/DailyMoney.js.scriptable-20230125.js',
        path: fm.documentsDirectory() + '/DailyMoney.js'
    },
    {
        source: 'https://raw.githubusercontent.com/rafaelgandi/Scriptable-DailyMoneyApp/main/index.html',
        path: fm.documentsDirectory() + '/DailyMoney/index.html'
    },
    {
        path: fm.documentsDirectory() + '/DailyMoney/db.json'
    }
];

const SHORTCUT = 'https://www.icloud.com/shortcuts/8e665af5c27542238c2e4946c66b470b';


// Installer starts here //

async function createFiles(details) {
    let sourceCode = '';
    if (typeof details.source !== 'undefined') {
        const req = new Request(details.source);
        req.method = "get";
        sourceCode = await req.loadString();
    }
    if (!fm.fileExists(details.path)) {
        fm.writeString(details.path, sourceCode);
    }
    console.log(`File ${details.path} created. ✨`);
}

function createDir(dir) {
    console.log(`Directory ${dir} created. ⚡️`);
    return fm.createDirectory(dir, true)
}


DIRECTORIES.map((d) => createDir(d));
FILES.map(async (f) => await createFiles(f));
if (SHORTCUT.trim() !== '') {
    await QuickLook.present('Installation Done!✨ You can optionally download this app\'s companion shortcut.');
    Safari.openInApp(SHORTCUT);
}
else {
    await QuickLook.present('Installation Done!✨ You may close and delete this script and enjoy the app.');
}
