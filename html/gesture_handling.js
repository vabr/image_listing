var currentImageIndex = 0;

function rotateImages(offset) {
  currentImageIndex = (currentImageIndex + offset) % kImageNames.length;
  while (currentImageIndex < 0) currentImageIndex += kImageNames.length;
  document.getElementById("img-elem").src = kImageNames[currentImageIndex];
}

function init() {
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
