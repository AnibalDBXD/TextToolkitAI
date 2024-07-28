import { generateAIResponse } from "../ai";
import { HandleClickContextMenuEvent } from "../types";
import { sendAIResponseToScript, startLoading } from "./utils";

export const grammar: HandleClickContextMenuEvent = async ({ selectionText, editable }, tab) => {
  console.log({
    tabId: tab?.id,
    selectionText,
    editable,
  })
  if (!tab?.id || !selectionText || !editable) return;

  startLoading(tab.id, selectionText)
  const response = await generateAIResponse(
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

  startLoading(tab.id, selectionText)
  const response = await generateAIResponse(
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

  startLoading(tab.id, selectionText)
  const response = await generateAIResponse(
    `Translate the following text to ${language}: ${selectionText}`
  );
  await sendAIResponseToScript({
    response,
    selectionText,
    tabId: tab?.id,
  });
}

export const extend: HandleClickContextMenuEvent = async ({ selectionText, editable }, tab) => {
  console.log({
    tabId: tab?.id,
    selectionText,
    editable,
  })
  if (!tab?.id || !selectionText || !editable) return;

  startLoading(tab.id, selectionText)
  const response = await generateAIResponse(
    `Extend the following text: ${selectionText}`
  );
  await sendAIResponseToScript({
    response,
    selectionText,
    tabId: tab?.id,
  }, {
    extend: true
  });
}