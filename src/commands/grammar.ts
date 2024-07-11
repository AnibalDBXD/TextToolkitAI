import { HandleClickContextMenuEvent } from "../types";

export const grammar: HandleClickContextMenuEvent = ({ selectionText }) => {
  console.log(selectionText);
}
