/* Do not remove this comment: image_listing file, can be overwritten by generate.py */

/*
Copyright 2016 Vaclav Brozek

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*
Contains code for handling user gestures for navigation on the listing page.
*/

var currentImageIndex = 0;
var listingVisible = true;

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
  listingVisible = visible;
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

  document.body.onkeydown = function(ev) {
    if (listingVisible)
      return;
    if (ev.which == 37 /* ArrowLeft */)
      rotateImages(-1);
    if (ev.which == 39 /* ArrowRight */)
      rotateImages(1);
  };

  hammertime.get('tap').set({ enable: false });
  hammertime.get('doubletap').set({ enable: false });
  hammertime.get('press').set({ enable: false });
}

window.onload = init;
