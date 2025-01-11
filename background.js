let previousTabId = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ notesOn: false });
});

chrome.action.onClicked.addListener(async () => {
  chrome.storage.local.set({ notesOn: true });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('Injecting note script in tab:', tabs[0].id);
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    });
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo);

  chrome.storage.local.get('notesOn', (data) => {
    if (data.notesOn) {

    if (previousTabId !== null) {
      console.log('Removing note from previous tab:', previousTabId);
      chrome.scripting.executeScript({
        target: { tabId: previousTabId },
        func: removeNote, 
      });
    }


    console.log('Injecting note script into tab:', activeInfo.tabId);
    chrome.scripting.executeScript({
      target: { tabId: activeInfo.tabId },
      files: ['content.js'],
    });

    previousTabId = activeInfo.tabId;
  }
})
});

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
    console.log("content removed")
    container.remove();
  }
}
  