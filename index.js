let a = new Audio();

if (localStorage.getItem("previewVol") == null) {
  localStorage.setItem("previewVol", "0.05");
  a.volume = 0.05;
} else {
  a.volume = Number(localStorage.getItem("previewVol"));
}

console.log(localStorage.getItem("previewVol"));

// a.volume = 0.05;

document.addEventListener("keydown", (event) => {
  if (event.key == "-") {
    if (Number(a.volume.toFixed(2)) <= 0.05) return;
    a.volume -= 0.05;
    a.volume = Number(a.volume.toFixed(2));
    localStorage.setItem("previewVol", a.volume.toString());
  }
  if (event.key == "=") {
    if (Number(a.volume.toFixed(2)) >= 1) return;
    a.volume += 0.05;
    a.volume = Number(a.volume.toFixed(2));
    localStorage.setItem("previewVol", a.volume.toString());
  }
});

function copyToclipboard(data) {
  navigator.clipboard.writeText(data);
}

//beatsaver
let bsWs = new WebSocket("wss://ws.beatsaver.com/maps");

bsWs.onopen = function () {
  console.log("connected to the beat saver websocket");
};

fetch("https://api.beatsaver.com/maps/latest?sort=LAST_PUBLISHED")
  .then((res) => res.json())
  .then((data) => {
    let map = data.docs[0];
    document.getElementById("bs-map-title").innerHTML = map.name;
    document.getElementById("bs-map-mapper").innerHTML = map.uploader.name;
    document.getElementById("bs-coverImage").src =
      map.versions[map.versions.length - 1].coverURL;
    document
      .getElementById("bs-copyBsrBtn")
      .setAttribute("onclick", `copyToclipboard("!bsr ${map.id}")`);
    document.getElementById(
      "bs-downloadBtn"
    ).innerHTML = `<a class="link" href="beatsaver://${map.id}">DOWNLOAD</a>`;
    document
      .getElementById("bs-previewBtn")
      .setAttribute(
        "onclick",
        `playSound("${
          map.versions[map.versions.length - 1].previewURL
        }",{songName:"${map.name}",mapAuthor:"${map.uploader.name}",id:"${
          map.id
        }"})`
      );
  });

bsWs.onmessage = function (event) {
  let jsonObj = JSON.parse(event.data);
  let map = jsonObj.msg;
  if (map.name == "") {
    return console.log("map is deleted");
  }

  document.getElementById("bs-map-title").innerHTML = map.name;
  document.getElementById("bs-map-mapper").innerHTML = map.uploader.name;
  document.getElementById("bs-coverImage").src =
    map.versions[map.versions.length - 1].coverURL;
  document
    .getElementById("bs-copyBsrBtn")
    .setAttribute("onclick", `copyToclipboard("!bsr ${map.id}")`);
  document.getElementById(
    "bs-downloadBtn"
  ).innerHTML = `<a class="link" href="beatsaver://${map.id}">DOWNLOAD</a>`;
  document
    .getElementById("bs-previewBtn")
    .setAttribute(
      "onclick",
      `playSound("${
        map.versions[map.versions.length - 1].previewURL
      }",{songName:"${map.name}",mapAuthor:"${map.uploader.name}",id:"${
        map.id
      }"})`
    );
};

//scoresaber

document.getElementById("footer").style.display = "none";
let ws = new WebSocket("wss://scoresaber.com/ws");

function calcRating(upvotes, downvotes, rounding = 1) {
  let totalReviews = upvotes + downvotes;
  let reviewScore = upvotes / totalReviews;
  return Number(
    (
      (reviewScore -
        (reviewScore - 0.5) * Math.pow(2, -Math.log10(totalReviews + 1))) *
      100
    ).toFixed(rounding)
  );
}

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

async function playSound(url, bsmap) {
  if (document.getElementById("progress") != null) {
    document.getElementById("progress").remove();
  }
  if (document.getElementById("footer-stop-image") != null) {
    document.getElementById("footer-stop-image").remove();
  }
  if (document.getElementById("playingInfo") != null) {
    document.getElementById("playingInfo").remove();
  }
  a.pause();
  a.src = url;
  a.play().finally(() => {
    document.getElementById("footer").style.display = "block";
    let progressBar = document.createElement("div");
    progressBar.className = "progress";
    progressBar.id = "progress";
    let stopImage = document.createElement("img");
    stopImage.id = "footer-stop-image";
    stopImage.setAttribute("onclick", "pauseSong()");
    stopImage.setAttribute("src", "assets/pause-button.svg");
    let playingSongInfo = document.createElement("p");
    if (bsmap.authorName) {
      playingSongInfo.innerHTML = `<a class="link" href="beatsaver://${bsmap.id}">${bsmap.authorName} - ${bsmap.songName} [${bsmap.mapAuthor}]</a>`;
    } else if (!bsmap.authorName) {
      playingSongInfo.innerHTML = `<a class="link" href="beatsaver://${bsmap.id}">${bsmap.songName} [${bsmap.mapAuthor}]</a>`;
    }
    playingSongInfo.id = "playingInfo";
    document.getElementById("footer").appendChild(progressBar);
    document.getElementById("footer").appendChild(stopImage);
    document.getElementById("footer").appendChild(playingSongInfo);
    document.getElementById("progress").style.animation =
      "progressbar-opacity 10s linear";
    document.getElementById("footer-stop-image").style.animation =
      "opacity 10s linear";

    document.getElementById("playingInfo").style.animation =
      "opacity 10s linear";
  });
}

a.onpause = function () {
  if (document.getElementById("progress") != null) {
    document.getElementById("progress").remove();
  }
  if (document.getElementById("footer-stop-image") != null) {
    document.getElementById("footer-stop-image").remove();
  }
  if (document.getElementById("playingInfo") != null) {
    document.getElementById("playingInfo").remove();
  }
  document.getElementById("footer").style.display = "none";
};

function pauseSong() {
  a.pause();
}

let rankedOnlyOption = false;

if (localStorage.getItem("rankedOnly") == "true") rankedOnlyOption = true;

if (localStorage.getItem("rankedOnly") == null)
  localStorage.setItem("rankedOnly", false);

document.getElementById("switch").checked = rankedOnlyOption;

document.addEventListener("change", (event) => {
  if (event.target.classList[1] && event.target.classList[1] == "rankedOnly") {
    if (event.target.checked) {
      console.log("Enabled ranked only");
      localStorage.setItem("rankedOnly", true);
    } else {
      console.log("Disabled ranked only");
      localStorage.setItem("rankedOnly", false);
    }
  }
});

// console.log(localStorage.getItem("rankedOnly"));

ws.onmessage = function (event) {
  // location.reload();
  if (event.data == "Connected to the ScoreSaber WSS") return;
  let map = JSON.parse(event.data);

  if (document.getElementById("switch").checked == true) {
    if (map.commandData.leaderboard.ranked == false) return;
  }
  document.getElementById("map-stats-seperator-ratio").style.display = "none";
  document.getElementById("ss-map-ratio").style.display = "none";
  document.getElementById("button-sperator").style.display = "none";

  document.getElementById("header-sep-2").style.display = "block";

  document.getElementById("ss-map-title").innerHTML =
    map.commandData.leaderboard.songAuthorName.toUpperCase() +
    " - " +
    map.commandData.leaderboard.songName.toUpperCase();
  document.getElementById("ss-map-mapper").innerHTML =
    map.commandData.leaderboard.levelAuthorName;
  document.getElementById("ss-coverImage").src =
    map.commandData.leaderboard.coverImage;
  document.getElementById("ss-score-submittor").innerHTML =
    map.commandData.score.leaderboardPlayerInfo.name;
  // console.log(map.commandData);
  let leaderboard = map.commandData.leaderboard;
  let diff = "";
  let color = "black";
  switch (leaderboard.difficulty.difficulty) {
    case 1:
      diff = "Easy";
      color = "#3CB371";
      break;
    case 3:
      diff = "Normal";
      color = "#59B0F4";
      break;
    case 5:
      diff = "Hard";
      color = "#FF6347";
      break;
    case 7:
      diff = "Expert";
      color = "#BF2A42";
      break;
    case 9:
      diff = "Expert+";
      color = "#8F48DB";
      break;
  }
  let line = "";

  if (leaderboard.ranked) {
    line = `${leaderboard.stars}☆`;
  } else {
    line = `Unranked`;
  }
  document.getElementById("ss-diffType").innerHTML = diff;
  document.getElementById("ss-diffType").style.backgroundColor = color;
  document.getElementById("ss-map-ranked").innerHTML = line;
  fetch(
    `https://api.beatsaver.com/maps/hash/${map.commandData.leaderboard.songHash}`
  )
    .then((res) => res.json())
    .then((bsmap) => {
      if (bsmap.error) {
        return;
      }
      document.getElementById("map-stats-seperator-ratio").style.display =
        "inline-block";
      document.getElementById("ss-map-ratio").style.display = "inline-block";
      document.getElementById("ss-map-ratio").innerHTML =
        calcRating(bsmap.stats.upvotes, bsmap.stats.downvotes, 1) + "%";
      document
        .getElementById("ss-copyBsrBtn")
        .setAttribute("onclick", `copyToclipboard("!bsr ${bsmap.id}")`);
      document.getElementById("button-sperator").style.display = "inline-block";
      document.getElementById(
        "ss-downloadBtn"
      ).innerHTML = `<a class="link" href="beatsaver://${bsmap.id}">DOWNLOAD</a>`;
      document
        .getElementById("ss-previewBtn")
        .setAttribute(
          "onclick",
          `playSound("${
            bsmap.versions[bsmap.versions.length - 1].previewURL
          }",{authorName:"${
            map.commandData.leaderboard.songAuthorName
          }",songName:"${map.commandData.leaderboard.songName}",mapAuthor:"${
            map.commandData.leaderboard.levelAuthorName
          }",id:"${bsmap.id}"})`
        );
    });
};
