var currentImageIndex = 0;

/* In the loop of images to show, rotates by |offset|. */
function rotateImages(offset) {
  currentImageIndex = (currentImageIndex + offset) % kImageNames.length;
  while (currentImageIndex < 0) currentImageIndex += kImageNames.length;
  document.getElementById("img-elem").src = kImageNames[currentImageIndex];
}

/* Populates dir-listing-container. */
function populateDirs() {
  var container = document.getElementById("dir-listing-container");
  for (var i = 0; i < kDirNames.length; ++i) {
    var btn = document.createElement("BUTTON");
    (function(str) {
    btn.onclick = function() { location = str; };
    })(kDirNames[i]);
    var t = document.createTextNode(kDirNames[i]);
    btn.appendChild(t);
    container.appendChild(btn);
  }
}

function init() {
  populateDirs();

  if (kImageNames.length == 0)
    return;
  rotateImages(0);

  var hammertime = new Hammer(document.getElementById("img-elem"));
  hammertime.on('swipe', function(ev) {
    rotateImages((ev.deltaX > 0)?-1:1);
  });

  hammertime.get('tap').set({ enable: false });
  hammertime.get('doubletap').set({ enable: false });
  hammertime.get('press').set({ enable: false });
}

window.onload = init;
