let notesOn = false;
let previousTabId = null;

chrome.action.onClicked.addListener(async () => {
  notesOn = true;
  console.log('Extension clicked, notesOn set to:', notesOn);

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
  console.log('notesOn state:', notesOn);

  if (notesOn) {
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
});


function removeNote() {
  const note = document.getElementById('draggable-note');
  if (note) {
    console.log("content removed")
    note.remove();
  }
}
  