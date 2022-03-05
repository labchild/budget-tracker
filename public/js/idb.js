let db;
const request = indexedDB.open('budget-tracker', 1);

// event to emit if db version changes
request.onupgradeneeded = function (e) {
    // save reference to db and create obj store
    const db = e.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

// upon a successful request to open idb
request.onsuccess = function (e) {
    // save db reference to global var
    db = e.target.result;

    if (navigator.onLine) {
        // send any idb data to server
        uploadBudget();
    }
};

// upon failed request/error to open idb
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

// save post requests to obj store in idb if no internet connection
function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    budgetObjectStore.add(record);
};

// handle reconnect to internet: collect obj store data and send to db
function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        // if idb has DataTransfer, grab post to server db
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type':'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // clear old data from idb on successful post request
                    const transaction = db.transaction(['new_budget'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('new_budget');
                    budgetObjectStore.clear();

                    alert('Stored budget transactions have been saved');
                })
                .catch(err => console.log(err));
        }
    }
};

// anytime client comes back online, upload idb data
window.addEventListener('online', uploadBudget);