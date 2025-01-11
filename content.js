// get the note from chrome.storage and either create a new note or update the existing one
chrome.storage.local.get("note", (data) => {
  let container = document.getElementById("note-container");
  let note = document.getElementById("note");
  if (!container) {
    createAndInjectNoteOnPage(data.note);
  } else {
    note.value = data.note;
  }
});

// listen for changes in the stored note and update the note on the page if it changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.note) {
    let container = document.getElementById("note-container");
    let note = document.getElementById("note");
    if (container) {
      note.value = changes.note.newValue;
      container.style.top = data.notePosition.top || '20px';
      container.style.left = data.notePosition.left || `${window.innerWidth-380}px`;
    }
  }
});

// create and inject all html elements
function createAndInjectNoteOnPage(noteText) {
  injectCSS(); // inject CSS from styles.css

  const container = document.createElement("div");
  container.id = "note-container";

  // get note position from storage and apply it to the container's position
  chrome.storage.local.get('notePosition', (data) => {
    if (data.notePosition) {
      container.style.top = data.notePosition.top || '20px';
      container.style.left = data.notePosition.left || `${window.innerWidth-380}px`;
    } else {
      container.style.top = '20px';
      container.style.left = `${window.innerWidth-380}px`;
    }
  });

  const headerContainer = document.createElement("div");
  headerContainer.id = "header-container";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.id = "buttons-container";

  const clearButton = document.createElement("button");
  clearButton.id = "button-clear";
  clearButton.title = "Clear";
  
  const closeButton = document.createElement("button");
  closeButton.id = "button-close";
  closeButton.title = "Close";
  
  const copyButton = document.createElement("button");
  copyButton.id = "button-copy";
  copyButton.title = "Copy";
  

  const title = document.createElement("h1");
  title.id = "note-title"
  title.innerText = "Simple Notes";

  const note = document.createElement("textarea");
  note.id = "note";
  note.placeholder = "Write your note...";
  note.value = noteText || "";

  buttonsContainer.appendChild(copyButton);
  buttonsContainer.appendChild(clearButton);
  buttonsContainer.appendChild(closeButton);

  headerContainer.appendChild(title);
  headerContainer.appendChild(buttonsContainer);

  container.appendChild(headerContainer);
  container.appendChild(note);
  document.body.appendChild(container);
  injectCSS();


  makeDraggable(container);

  note.oninput = function () {
    chrome.storage.local.set({ note: note.value });
  };

  copyButton.onclick = function () {
    navigator.clipboard.writeText(note.value);
  };

  clearButton.onclick = function () {
    chrome.storage.local.set({ note: "" });
  };

  closeButton.onclick = function () {
    chrome.storage.local.set({ notesOn: false });
    chrome.storage.local.set({
      notePosition: {
        top: '20px',
        left: `${window.innerWidth-380}px`,
      },
    });
    container.remove();
  };
}

// 
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.addEventListener("mousemove", dragElement);
    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.removeEventListener("mousemove", dragElement);

      chrome.storage.local.set({
        notePosition: {
          top: element.style.top,
          left: element.style.left,
        },
      });
    });
  });

  function dragElement(e) {
    if (isDragging) {
      let newTop = e.clientY - offsetY;
      let newLeft = e.clientX - offsetX;

      // prevent dragging out of the viewport
      if (newTop < 0) {
        newTop = 0;
      } else if (newTop > (window.innerHeight - 240)) {
        newTop = window.innerHeight - 240;
      }

      if (newLeft < 0) {
        newLeft = 0;
      } else if (newLeft > (window.innerWidth - 330)) {
        newLeft = window.innerWidth - 330;
      }
    
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }
  }
}

function injectCSS() {
  if (!document.getElementById('simpleNotesStyles')) {
      const link = document.createElement('link');
      link.id = 'simpleNotesStyles';
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('styles.css');
      document.head.appendChild(link);
  }
}
