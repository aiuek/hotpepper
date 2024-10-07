const combination = [...document.querySelectorAll(
  '#mainContents > ul > li  '
)].map((v) => {
  return { name: v.querySelector("#mainContents > ul > li> div.slnCassetteHeader > h3 > a").innerText, url: v.querySelector("#mainContents > ul > li > div.slnCassetteBody > div > div.slnCoupon > div > a").href}
})

chrome.runtime.sendMessage({ url: combination });

chrome.runtime.onMessage.addListener(({ res: messages }, sender) => {
  let fulfillCupon;

  messages.forEach((message) => {
    const dom = new DOMParser().parseFromString(message.text, 'text/html');
    if (dom) {
      fulfillCupon = [
        ...dom.querySelector('div.mT20').querySelectorAll('p.couponMenuName '),
      ]
        .map((x) => x.innerText)
        .some((word) => {
          return (
            word.includes('イルミナカラー') &&
            word.includes('カット') &&
            (word.includes('トリートメント') ||
              word.includes('TR') ||
              word.includes('Tr') ||
              word.includes('tr'))
          );
        });

      if (fulfillCupon === false) {
        const shop = [
          ...document.querySelectorAll('#mainContents > ul > li  '),
        ].find((shopElement) => {
          return (
            shopElement.querySelector('div.slnCassetteHeader>h3>a')
              .innerText === message.name
          );
        });
        shop.remove();
      }
    }
  });
});
