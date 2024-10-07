console.log('background runnning');
chrome.runtime.onMessage.addListener((message, sender) => {
  Promise.all(
    message.url.map(async (x) => {
      //Promise.all()はarrayのとき
      await new Promise((resolve) => setTimeout(resolve, 100));
      return fetch(x.url, {
        method: 'POST',
        body: 'couponTypeCd=CT02&typeSearch=submit&mc=MC01&mc=MC02&mc=MC06',
      }).then((response) => {
        return response.text().then((text) => {
          return { name: x.name, url: x.url, text };
        });
      });
    }),
  ).then((res) => {
    console.log(res);
    chrome.tabs.query({ active: true }, (tab) => {
      chrome.tabs.sendMessage(tab[0].id, { res });
    });
  });
});






