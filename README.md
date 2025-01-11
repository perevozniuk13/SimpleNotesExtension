# Simple Notes Chrome Extension

## Overview

The **Simple Notes** Chrome extension allows users to create, manage, and display sticky notes directly in their browser. It provides a draggable note container where users can type and save their notes. The notes are saved using Chrome's local storage, ensuring they persist across browser sessions. The extension also allows users to copy, clear, or close notes with intuitive buttons.

## How It Works

- **Injecting Notes:** Upon clicking the extension's icon, the note container is injected into the current active tab. If the page is refreshed, the note is re-injected, ensuring the note remains visible even after a page reload.
- **Saving Notes:** As users type in the note, the content is automatically saved in Chrome's local storage, ensuring the note is preserved even after a browser refresh or tab switch.
- **Switching Tabs:** When switching between tabs, the extension removes the note container and associated CSS from the previous tab. Then, it injects the note into the new active tab, maintaining consistency across tabs.
- **Draggable Note Container:** The note container is draggable, and its position is saved to local storage. This allows the note's position to persist even when switching tabs or refreshing the page, ensuring that it appears in the correct position on any tab.
- **Interaction:** Users can clear the note, copy the note content to the clipboard, or close the note.