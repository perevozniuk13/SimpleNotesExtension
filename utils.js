export function createAndInjectNoteOnPage(noteText) {
    const note = document.createElement('textarea');
    note.id = 'draggable-note';
    note.placeholder = 'Write your note...';
    note.style.position = 'fixed';
    note.style.top = '20px';
    note.style.left = '20px';
    note.style.width = '300px';
    note.style.height = '200px';
    note.style.zIndex = '9999';
    note.style.borderRadius = '8px';
    note.style.padding = '10px';
    note.style.fontSize = '14px';
    note.value = noteText || '';
    document.body.appendChild(note);
  
    makeDraggable(note);
  
    note.oninput = function () {
      chrome.storage.local.set({ note: note.value });
    };
  }
  
 function makeDraggable(note) {
    let isDragging = false;
    let offsetX, offsetY;
  
    note.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - note.getBoundingClientRect().left;
      offsetY = e.clientY - note.getBoundingClientRect().top;
      document.addEventListener('mousemove', dragNote);
      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.removeEventListener('mousemove', dragNote);
      });
    });
  
    function dragNote(e) {
      if (isDragging) {
        note.style.left = `${e.clientX - offsetX}px`;
        note.style.top = `${e.clientY - offsetY}px`;
      }
    }
  }
  
  export default function loadNoteFromStorage() {
    chrome.storage.local.get('note', (data) => {
      if (data.note) {
        let note = document.getElementById('draggable-note');
        if (note) {
          note.value = data.note;
        } else {
          createAndInjectNoteOnPage(data.note);
        }
      }
    });
  }
  