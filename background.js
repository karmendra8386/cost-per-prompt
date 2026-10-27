chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['cppSettings'], (res) => {
    if (!res.cppSettings) chrome.storage.local.set({ cppSettings: { modelByHost: {} } });
  });
});
