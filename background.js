import loadNoteFromStorage from "./utils.js";

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.scripting.executeScript({
      target: { tabId: activeInfo.tabId },
      function: loadNoteFromStorage
    });
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: loadNoteFromStorage
      });
    }
  });
  