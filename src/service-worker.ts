import { extend, grammar, summarize, translate } from "./commands";
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
    id: 'extend',
    title: 'Extend a text',
    onClick: extend,
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

const addCommand = ({
  id,
  title,
}: CommandItem, parentId?: string) => {
  chrome.contextMenus.create({
    id,
    title,
    type: 'normal',
    parentId,
    contexts: ['selection'],
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled");
  COMMANDS.forEach(({ children, ...command }) => {
    addCommand(command)
    if (children) {
      children.forEach((childrenCommand) => addCommand(childrenCommand, command.id))
    }
  });
});

chrome.contextMenus.onClicked.addListener((OnClickData, tab) => {
  console.log("onClicked", OnClickData);
  const { onClick } = COMMANDS.find(({ id }) => id === OnClickData.menuItemId) || {};
  if (!onClick) return
  onClick(OnClickData, tab)
})