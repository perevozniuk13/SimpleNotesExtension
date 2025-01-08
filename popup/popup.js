document.addEventListener('DOMContentLoaded', () => {

console.log("This is a popup!")

const currentNote = document.getElementById('note');
console.log(currentNote)


currentNote.oninput = function saveNote() {
    chrome.storage.local.set({ note: currentNote.value });
}

chrome.storage.local.get('note', (data) => {
    if (data.note) {
        currentNote.value = data.note; 
    }
});

})



  