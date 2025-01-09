// document.addEventListener('DOMContentLoaded', () => {

// console.log("This is a popup!")

// const currentNote = document.getElementById('note');
// const copyButton = document.getElementById('button-copy');
// const clearButton = document.getElementById('button-clear');


// currentNote.oninput = function saveNote() {
//     chrome.storage.local.set({ note: currentNote.value });
// }

// chrome.storage.local.get('note', (data) => {
//     if (data.note) {
//         currentNote.value = data.note; 
//     }
// });

// copyButton.addEventListener('click', () => {
//     navigator.clipboard.writeText(currentNote.value);
// });

// clearButton.addEventListener('click', () => {
//     currentNote.value = '';
//     chrome.storage.local.set({ note: ''});
// });

// })
document.getElementById('open-notes-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'open_notes' });
});
  