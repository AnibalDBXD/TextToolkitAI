const OPTIONS = {
  'grammar': 'Correct the grammar of a text',
  'spelling': 'Correct the spelling of a text',
	'translate': 'Translate a text',
  'summarize': 'Summarize a text',
}

chrome.runtime.onInstalled.addListener(async () => {
  for (const [id, title] of Object.entries(OPTIONS)) {
    chrome.contextMenus.create({
      id,
      title,
      type: 'normal',
      contexts: ['selection'],
    });
  }
});