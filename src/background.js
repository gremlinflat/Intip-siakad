chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const siakad_itera_url = "http://siakad.itera.ac.id/mahasiswa/kelas/lihat";

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(siakad_itera_url)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
    if (nextState === "ON") {
      // run script.js
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        function reveal_nilai() {
          //TODO: INEFFICIENT DOM QUERY, refactor later
          var tableRows = document.querySelectorAll("table tr");
          var nilaiColumn = [];
          tableRows.forEach((row) => {
            let child = row.childNodes;
            let comment = [];
            for (let i = 0; i < child.length; i++) {
              if (child[i].nodeType === 8) {
                comment.push(child[i]);
              }
            }
            nilaiColumn.push(comment);
          });
          if (nilaiColumn.length === 0) {
            return;
          }
          nilaiColumn.forEach((column) => {
            column.forEach((comment) => {
              let data = comment.data.split(" ");
              var regex = /(<\/?[^>]+>)/g;
              var result = data[1].split(regex);
              console.log(result);
              if (result[2] === "NILAI") {
                let th = document.createElement("th");
                let text = document.createTextNode(result[2]);
                th.appendChild(text);
                comment.replaceWith(th);
              } else {
                let td = document.createElement("td");
                let text = document.createTextNode(result[2]);
                td.appendChild(text);
                comment.replaceWith(td);
              }
            });
          });
        }

        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            func: reveal_nilai,
          })
          .then(() => console.log("Injected a function!"));
      });
    } else if (nextState === "OFF") {
      chrome.tabs.reload(tab.id);
    }
  }
});
