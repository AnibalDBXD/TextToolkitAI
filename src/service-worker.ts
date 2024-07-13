import { grammar, summarize, translate } from "./commands";
import { HandleClickContextMenuEvent } from "./types";
interface CommandItem {
  id: string;
  title: string;
  onClick?: HandleClickContextMenuEvent;
  children?: CommandItem[]
}

const COMMANDS: CommandItem[] = [
  {
    id: 'grammar',
    title: 'Correct the grammar of a text',
    onClick: grammar,
  },
  {
    id: 'summarize',
    title: 'Summarize a text',
    onClick: summarize,
  },
  {
    id: 'translate',
    title: 'Translate a text to...',
    children: [
      {
        id: 'english',
        title: 'English',
        onClick: translate("English")
      },
      {
        id: 'spanish',
        title: 'Spanish',
        onClick: translate("Spanish")
      },
      {
        id: 'french',
        title: 'French',
        onClick: translate("French")
      },
      {
        id: 'german',
        title: 'German',
        onClick: translate("German")
      }
    ]
  }
];

const addCommand = ({ onClick, ...command}: CommandItem, parentId?: string) => {
  chrome.contextMenus.create({
    ...command,
    type: 'normal',
    parentId,
    contexts: ['selection'],
  });
  chrome.contextMenus.onClicked.addListener((OnClickData, tab) => {
    if (OnClickData.menuItemId !== command.id) return
    if(!onClick) return
    onClick(OnClickData, tab)
  })
}

chrome.runtime.onInstalled.addListener(async () => {
  COMMANDS.forEach(({ children, ...command }) => {
    addCommand(command)
    if (children) {
      children.forEach((childrenCommand) => addCommand(childrenCommand, command.id))
    }
  });
});
