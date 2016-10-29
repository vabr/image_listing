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

function SetListingsVisibility(visible) {
  document.getElementById("listing-container").hidden = !visible;
  document.getElementById("img-container").hidden = visible;
}

/* Populates thumbnails-container. */
function populateThumbnails() {
  var container = document.getElementById("thumbnails-container");
  for (var i = 0; i < kImageNames.length; ++i) {
    var btn = document.createElement("BUTTON");
    btn.classList.add("thumbnail");
    (function(idx) {
    btn.onclick = function() {
      currentImageIndex = idx;
      rotateImages(0); 
      SetListingsVisibility(false);
    };
    })(i);
    var img = document.createElement("IMG");
    img.src = kImageNames[i];
    btn.appendChild(img);
    container.appendChild(btn);
  }
}

function init() {
  populateDirs();

  if (kImageNames.length == 0)
    return;

  populateThumbnails();

  rotateImages(0);

  var image = document.getElementById("img-elem");
  var hammertime = new Hammer(image);
  hammertime.on('swipe', function(ev) {
    rotateImages((ev.deltaX > 0)?-1:1);
  });

  image.onclick = function(ev) {
    SetListingsVisibility(true);
    return true;
  };

  hammertime.get('tap').set({ enable: false });
  hammertime.get('doubletap').set({ enable: false });
  hammertime.get('press').set({ enable: false });
}

window.onload = init;
