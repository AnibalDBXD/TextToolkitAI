import { StreamAIResponseReturn } from "../ai";
export interface MessageInput {
  action: "loading" | "stream" | "error" | "done";
  content?: string;
  selectionText: string;
}

export interface Message extends MessageInput {
  type: "update-input-content";
}

const createSendMessage = async (tabId: number): Promise<(message: MessageInput) => void> => {
  return (message: MessageInput) => chrome.tabs.sendMessage(tabId, {
    ...message,
    type: "update-input-content",
  })
}

interface SendAIResponseToScriptParams {
  tabId: number;
  selectionText: string;
  response: StreamAIResponseReturn;
}

interface SendAIResponseToScriptOptions {
  extend?: boolean;
}

export const sendAIResponseToScript = async ({
  response: { partialObjectStream, object, error },
  selectionText,
  tabId
}: SendAIResponseToScriptParams, options?: SendAIResponseToScriptOptions) => {
  const sendMessage = await createSendMessage(tabId);
  console.log("sendMessage:", sendMessage);
  if (!partialObjectStream || !object && error) {
    return sendMessage({
      action: "error",
      content: (error as Error).message,
      selectionText,
    })
  }
  console.log("grammar:", "start loading");
  sendMessage({
    action: "loading",
    selectionText,
  });
  // if hasValidLanguageSyntax is false, throw an error
  for await (const partialObject of partialObjectStream) {
    if (!partialObject.hasValidLanguageSyntax) {
      console.log("grammar:", "error invalid grammar");
      sendMessage({
        action: "error",
        content: "invalid grammar",
        selectionText,
      });
      break;
    }
    console.log("grammar:", "stream", partialObject.result_text);
    let content = partialObject.result_text || "";
    if(options?.extend) {
      content = `${selectionText} ${content}`
    }
    sendMessage({
      action: "stream",
      content,
      selectionText,
    });
  }

  const resultText = (await object).result_text;
  console.log("grammar:", "done", resultText);
  let content = resultText || "";
  if(options?.extend) {
    content = `${selectionText} ${content}`
  }
  sendMessage({
    action: "done",
    content,
    selectionText,
  });
}