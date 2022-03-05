let db;
const request = indexedDB.open('budget-tracker', 1);

// event to emit if db version changes
request.onupgradeneeded = function (e) {
    // save reference to db and create obj store
    const db = e.target.result;
    db.createObjectStore('spend_entry', { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function (e) {
    // save db reference to global var
    db = e.target.result;

    if (navigator.onLine) {
        // send any idb data to server
        // uploadSpend();
    }
}