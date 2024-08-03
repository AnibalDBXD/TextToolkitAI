import { Message } from "../commands/utils";

const searchInputFromValue = (value: string) => {
  const inputs = document.querySelectorAll("input[type='text']") as NodeListOf<HTMLInputElement>;
  const textareas = document.querySelectorAll("textarea") as NodeListOf<HTMLTextAreaElement>;
  const inputWithValue: (HTMLInputElement | HTMLTextAreaElement)[] = []
  inputs.forEach((input: HTMLInputElement) => {
    if (input.value.includes(value)) {
      inputWithValue.push(input);
    }
  });
  textareas.forEach((textarea: HTMLTextAreaElement) => {
    if (textarea.value.includes(value)) {
      inputWithValue.push(textarea);
    }
  });
  return inputWithValue as HTMLInputElement[];
}

const setInputLoadingState = (inputs: HTMLInputElement[], loading: boolean) => {
  if(!inputs?.length) return console.error("setInputLoadingState: No input found", inputs);
  // set disabled attribute, and remove it when done
  // animation opacity 0.5 -> 1 infinite, and then remove attribute
  inputs.forEach((input: HTMLInputElement) => {
    const removeAnimations = () => {
      input.removeAttribute("disabled");
      input.getAnimations().forEach((animation: Animation) => {
        animation.cancel();
      });
      input.style.opacity = "1";
    }
    if (loading) {
      console.log("setInputLoadingState: loading", input.value);
      input.setAttribute("disabled", "disabled");
      input.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 1000, iterations: Infinity, direction: "alternate" });
      console.log("setInputLoadingState false: timeout");
      setTimeout(removeAnimations, 2000);
    } else {
      console.log("setInputLoadingState: false", input.value);
      removeAnimations()
    }
  })
}

const ERRORS_MESSAGES = {
  "Invalid API Key": "Invalid API key. You can configure your API key in the extension settings.",
} as Record<string, string>;

chrome.runtime.onMessage.addListener(async (message: Message, _, sendResponse) => {
  if (message.type === "update-input-content") {
    if (message.action === "done") {
      const contentInputs = searchInputFromValue(message.content || "");
      const selectionInputs = searchInputFromValue(message.selectionText);
      const doneInputs = [...contentInputs, ...selectionInputs];

      if (!doneInputs.length) {
        alert(`No input found, we copy the result to the clipboard`);
        navigator.clipboard.writeText(message.content || "");
        console.error("Done: No input found", message.selectionText);
        return
      }
      setInputLoadingState(doneInputs, false);
      console.log("Done", message.content);
      doneInputs.forEach((input: HTMLInputElement) => {
        input.value = message.content || "";
      })
      return sendResponse({ success: true });
    }
    if (message.action === "error") {
      console.error("Error", message.content);
      const contentInputs = searchInputFromValue(message.content || "");
      const selectionInputs = searchInputFromValue(message.selectionText);

      setInputLoadingState([...contentInputs, ...selectionInputs], false);
      console.log("error:", message.content);
      if (message.content !== "invalid grammar") {
        alert(ERRORS_MESSAGES[message.content as string] || message.content);
      }
      return sendResponse({ success: false });
    }
    const contentInputs = searchInputFromValue(message.content || "");
    const selectionInputs = searchInputFromValue(message.selectionText);
    const inputs = [...contentInputs, ...selectionInputs];
    if (!inputs.length) return console.error("No input found with value", message.selectionText);
    if (message.action === "loading") {
      setInputLoadingState(inputs, true);
    }
    if (message.action === "stream") {
      if (!message.content) return;
      inputs.forEach((input: HTMLInputElement) => {
        input.value = message.content || "";
      })
    }
  }
  sendResponse({ success: true });
});

chrome.runtime.sendMessage({ type: "script-loaded" });