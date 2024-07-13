import { grammar } from "./commands/grammar";
import { HandleClickContextMenuEvent } from "./types";
interface CommandItem {
  id: string;
  title: string;
  onClick: HandleClickContextMenuEvent;
}

const COMMANDS: CommandItem[] = [
  {
    id: 'grammar',
    title: 'Correct the grammar of a text',
    onClick: grammar,
  },
  {
    id: 'spelling',
    title: 'Correct the spelling of a text',
    onClick: () => { }
  },
  {
    id: 'translate',
    title: 'Translate a text',
    onClick: () => { }
  },
  {
    id: 'summarize',
    title: 'Summarize a text',
    onClick: () => { }
  }
];

chrome.runtime.onInstalled.addListener(async () => {
  COMMANDS.forEach(({ onClick, ...option }) => {
    chrome.contextMenus.create({
      ...option,
      type: 'normal',
      contexts: ['selection'],
    });
    chrome.contextMenus.onClicked.addListener((OnClickData, tab) => {
      if (OnClickData.menuItemId !== option.id) return
      onClick(OnClickData, tab)
    })
  });
});
