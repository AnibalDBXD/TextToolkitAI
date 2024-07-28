import { generateAIResponseReturn } from "../ai";
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
  response: generateAIResponseReturn;
}

interface SendAIResponseToScriptOptions {
  extend?: boolean;
}

export const sendAIResponseToScript = async ({
  response: { object, error },
  selectionText,
  tabId
}: SendAIResponseToScriptParams, options?: SendAIResponseToScriptOptions) => {
  const sendMessage = await createSendMessage(tabId);
  if (!object && error) {
    return sendMessage({
      action: "error",
      content: (error as Error).message,
      selectionText,
    })
  }

  const resultText = object!.result_text;
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

export const startLoading = async (tabId: number, selectionText: string) => {
  const sendMessage = await createSendMessage(tabId);
  console.log("grammar:", "start loading");
  sendMessage({
    action: "loading",
    selectionText,
  });
}