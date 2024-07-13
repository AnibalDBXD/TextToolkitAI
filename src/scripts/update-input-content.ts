import { Message } from "../commands/utils";

const searchInputFromValue = (value: string) => {
  const inputs = document.querySelectorAll("input[type='text']") as NodeListOf<HTMLInputElement>;
  const textareas = document.querySelectorAll("textarea") as NodeListOf<HTMLTextAreaElement>;
  let inputWithValue: HTMLInputElement | HTMLTextAreaElement | null = null
  inputs.forEach((input: HTMLInputElement) => {
    if (input.value.includes(value)) {
      inputWithValue = input;
    }
  });
  textareas.forEach((textarea: HTMLTextAreaElement) => {
    if (textarea.value.includes(value)) {
      inputWithValue = textarea;
    }
  });
  return inputWithValue as HTMLInputElement | null;
}

const setInputLoadingState = (input: HTMLInputElement | null, loading: boolean) => {
  if(!input) return;
  // set disabled attribute, and remove it when done
  // animation opacity 0.5 -> 1 infinite, and then remove attribute
  if (loading) {
    input.setAttribute("disabled", "disabled");
    input.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 1000, iterations: Infinity, direction: "alternate" });
  } else {
    input.removeAttribute("disabled");
    input.getAnimations().forEach((animation: Animation) => {
      animation.cancel();
    });
    input.style.opacity = "1";
  }
}

chrome.runtime.onMessage.addListener(async (message: Message, _, sendResponse) => {
  if (message.type === "update-input-content") {
    if (message.action === "done") {
      const doneInput = searchInputFromValue(message.content || "");
      if (!doneInput) return console.error("Done: No input found with value", message.selectionText);
      setInputLoadingState(doneInput, false);
      console.log("Done", message.content);
      return sendResponse({ success: true });
    }
    if (message.action === "error") {
      console.error("Error", message.content);
      const contentInput = searchInputFromValue(message.content || "");
      const selectionInput = searchInputFromValue(message.selectionText);

      setInputLoadingState(contentInput || selectionInput, false);

      return sendResponse({ success: false });
    }
    const input = searchInputFromValue(message.selectionText);
    if (!input) return console.error("No input found with value", message.selectionText);
    if (message.action === "loading") {
      setInputLoadingState(input, true);
    }
    if (message.action === "stream") {
      if (!message.content) return;
      input.value = message.content;
    }
  }
  sendResponse({ success: true });
});