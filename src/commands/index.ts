import { streamAIResponse } from "../ai";
import { HandleClickContextMenuEvent } from "../types";
import { sendAIResponseToScript } from "./utils";

export const grammar: HandleClickContextMenuEvent = async ({ selectionText, editable }, tab) => {
  console.log({
    tabId: tab?.id,
    selectionText,
    editable,
  })
  if (!tab?.id || !selectionText || !editable) return;

  const response = await streamAIResponse(
    `Fix the grammar of the following text: ${selectionText}`
  );
  await sendAIResponseToScript({
    response,
    selectionText,
    tabId: tab?.id,
  });
}

export const summarize: HandleClickContextMenuEvent = async ({ selectionText, editable }, tab) => {
  console.log({
    tabId: tab?.id,
    selectionText,
    editable,
  })
  if (!tab?.id || !selectionText || !editable) return;

  const response = await streamAIResponse(
    `Summarize the following text: ${selectionText}`
  );
  await sendAIResponseToScript({
    response,
    selectionText,
    tabId: tab?.id,
  });
}

export const translate = (language: string): HandleClickContextMenuEvent => async ({ selectionText, editable }, tab) => {
  console.log({
    tabId: tab?.id,
    selectionText,
    editable,
  })
  if (!tab?.id || !selectionText || !editable) return;

  const response = await streamAIResponse(
    `Translate the following text to ${language}: ${selectionText}`
  );
  await sendAIResponseToScript({
    response,
    selectionText,
    tabId: tab?.id,
  });
}