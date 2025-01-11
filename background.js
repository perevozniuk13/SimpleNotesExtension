let previousTabId = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ notesOn: false });
});

// listen for when the extension icon is clicked, toggle the notesOn status and injecting the note script
chrome.action.onClicked.addListener(async () => {
  chrome.storage.local.set({ notesOn: true });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    });
  });
});

// when switching to a new tab, inject the note to that tab
chrome.tabs.onActivated.addListener((activeInfo) => {

  chrome.storage.local.get('notesOn', (data) => {
    if (data.notesOn) {

    // remove note code from the previous tab when switching to a new one
    if (previousTabId !== null) {
      chrome.scripting.executeScript({
        target: { tabId: previousTabId },
        func: removeNote, 
      });
    }


    chrome.scripting.executeScript({
      target: { tabId: activeInfo.tabId },
      files: ['content.js'],
    });

    previousTabId = activeInfo.tabId;
  }
})
});

// when tab is rephreshed, inject the note again
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {

  chrome.storage.local.get('notesOn', (data) => {

    if (data.notesOn && changeInfo.status === 'complete') {

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js'],
    });

  }})
});


function removeNote() {
  const container = document.getElementById('note-container');
  const style = document.getElementById('simpleNotesStyles');
  if (style) {
      style.remove();
  }
  if (container) {
    container.remove();
  }
}
  