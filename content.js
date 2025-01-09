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
    }
  }
});

function createAndInjectNoteOnPage(noteText) {
  const container = document.createElement("div");
  container.id = "note-container";
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.left = "20px";
  container.style.zIndex = "9999";
  container.style.width = "320px";
  container.style.borderRadius = "8px";
  container.style.backgroundColor = "black";
  container.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
  container.style.padding = "10px";

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
  note.style.zIndex = "9999";
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
    });
  });

  function dragElement(e) {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  }
}
