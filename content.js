console.log("content.js injected!");

chrome.storage.local.get("note", (data) => {
  let container = document.getElementById("note-container");
  let note = document.getElementById("note");
  if (!container) {
    createAndInjectNoteOnPage(data.note);
  } else {
    note.value = data.note;
  }
});

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

function createAndInjectNoteOnPage(noteText) {
  const container = document.createElement("div");
  container.id = "note-container";
  container.style.position = "fixed";
  container.style.zIndex = "999999";
  container.style.width = "320px";
  container.style.borderRadius = "8px";
  container.style.backgroundColor = "black";
  container.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
  container.style.padding = "10px";

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
  headerContainer.style.width = "100%";
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.id = "buttons-container";
  buttonsContainer.style.display = "flex";

  const clearButton = document.createElement("button");
  clearButton.id = "button-clear";
  clearButton.innerText = "Clear";

  const closeButton = document.createElement("button");
  closeButton.id = "button-close";
  closeButton.innerText = "Close";

  const copyButton = document.createElement("button");
  copyButton.id = "button-copy";
  copyButton.innerText = "Copy";

  const title = document.createElement("h1");
  title.innerText = "My Note";
  title.style.fontSize = "18px";
  title.style.margin = "0 0 10px 0";
  title.style.fontWeight = "normal";
  title.style.color = "white";

  const note = document.createElement("textarea");
  note.id = "note";
  note.placeholder = "Write your note...";
  note.style.width = "300px";
  note.style.height = "200px";
  note.style.borderRadius = "8px";
  note.style.padding = "10px";
  note.style.fontSize = "14px";
  note.value = noteText || "";

  buttonsContainer.appendChild(copyButton);
  buttonsContainer.appendChild(clearButton);
  buttonsContainer.appendChild(closeButton);

  headerContainer.appendChild(title);
  headerContainer.appendChild(buttonsContainer);

  container.appendChild(headerContainer);
  container.appendChild(note);
  document.body.appendChild(container);

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
