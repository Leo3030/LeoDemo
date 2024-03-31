const dom = {
  audio: document.querySelector("audio"),
  container: document.querySelector(".container"),
  listWrapper: document.querySelector(".list"),
};

const data = formatData(lrc);
initList();
const itemHeight = dom.listWrapper.children[0].clientHeight;
const containerHeight = dom.container.clientHeight;
const ulHeight = dom.listWrapper.clientHeight;

function formatTime(time) {
  const splitTime = time.split(":");
  return (+splitTime[0] * 60 + +splitTime[1]).toFixed(2);
}

function initList() {
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.words;

    fragment.appendChild(li);
  });

  dom.listWrapper.appendChild(fragment);
}

/**
 *
 * @param {string} lrc
 *
 * @returns {object[]}
 */
function formatData(lrc) {
  const list = lrc.split("\n");
  const res = list.map((item) => {
    const data = item.split("]");
    return {
      words: data[1],
      time: formatTime(data[0].replace("[", "")),
    };
  });

  return res;
}

function getCurrentIndex() {
  const currentTime = dom.audio.currentTime;

  for (let i = 0; i < data.length; i++) {
    if (data[i].time > currentTime) {
      return i - 1;
    }
  }
}

function getOffset() {
  const index = getCurrentIndex();
  const currentHeight = itemHeight * index + itemHeight / 2;
  let offset = currentHeight - containerHeight / 2;
  if (offset < 0) {
    offset = 0;
  }
  if (offset > ulHeight - containerHeight) {
    offset = ulHeight - containerHeight;
  }
  dom.listWrapper.style.transform = `translateY(-${offset}px)`;
  const active = dom.listWrapper.querySelector(".active");
  if (active) {
    active.classList.remove("active");
  }

  const li = dom.listWrapper.children[index];
  if (li) {
    li.classList.add("active");
  }
}

dom.audio.addEventListener("timeupdate", getOffset);
