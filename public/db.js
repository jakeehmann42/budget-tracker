let db;
const request = indexedDB.open("budgetTracker", 1);
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (navigator.online) {
        checkDatabase();
    }
};






request.onerror = function(event) {
    console.log("Errrr! " + event.target.errorCode);
};



function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
}





function checkdatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    const getAll =store.getAll();



    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch ("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json" 
                }
            })



            .then (response => response.json())
            .then (() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store =transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

window.addEventListener("online", checkDatabase);