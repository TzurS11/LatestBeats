function setRanked(value) {
  localStorage.setItem("rankedOnly", value);
  document.getElementById("switch").checked = value;
}

let a = new Audio();

function setVolume(value) {
  if (value >= 0 && value <= 1) {
    localStorage.setItem("previewVol", value);
    a.volume = value;
  } else {
    throw "Volume can only be from 0 to 1";
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

function checkMobile() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

if (checkMobile()) {
  document.body.innerHTML =
    "<p class='mobileerror'>The website doesn't work on mobile</p>";
} else {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("key") == null) {
    // console.log("no key was set");
  } else {
    window.location.href = `beatsaver://${urlParams.get("key")}`;
  }

  if (localStorage.getItem("previewVol") == null) {
    localStorage.setItem("previewVol", "0.05");
    a.volume = 0.05;
  } else {
    a.volume = Number(localStorage.getItem("previewVol"));
  }

  // console.log(localStorage.getItem("previewVol"));

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

  // bsWs.onopen = function () {
  //   console.log("connected to the beat saver websocket");
  // };

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
    if (
      event.target.classList[1] &&
      event.target.classList[1] == "rankedOnly"
    ) {
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
        document.getElementById("button-sperator").style.display =
          "inline-block";
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
}
