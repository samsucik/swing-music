// Copyright 2016 Jeremie Miserez <jeremie@miserez.org>
//
// MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// A little bit of Javascript to let you export your Google Music library, playlists, and album track lists :)
//
// I posted this as an answer here: http://webapps.stackexchange.com/questions/50311/print-playlist-from-google-play-music
//
// 1. Go to: https://play.google.com/music/listen#/all (or your playlist)
//
// 2. Open a developer console (F12 for Chrome). Paste 
//    code below into the console.
//
// 3. All scraped songs are stored in the `allsongs` object
//    and a text version of the list is copied to the clipboard. I recommend running
//    `songsToText("all",true)` afterwards to get the full CSV information.
//
// 4. If you would like the output in a text format, can call
//    the songsToText() function. You can select a style, choose 
//    the format, and if only liked/thumbed up songs should be exported. 
//    The resulting list will then be pasted into the clipboard. 
//    Styles are ` all`, `artist`, `artistalbum`, `artistsong`, 
//    `artistalbumsong`. 
//    CSV will result in a CSV file and can be left out (defaults to false).
//    Likedonly can be left out (defaults to 
//    false) or set to true, and will filter all songs with 
//    ratings greater or equal to 5. 
//    E.g: 
//    - `songsToText("all",true,false)` will export all songs in csv format.
//    - `songsToText("all",true,true)` will export only liked songs in csv format.
//    - `songsToText("artistsong",false,false)` will export all songs as text.
//
// 5. You can then paste the data anywhere you like, for 
//    example http://www.ivyishere.org/ if you want to add the
//    songs or albums to your Spotify account. To make Ivy 
//    recognize full albums, use the "artistalbum" style. For 
//    songs, use the "artistsong" style.

// see my answer here for questions: http://webapps.stackexchange.com/a/73792/77056

var allsongs = []
var outText = "";
var songsToText = function(style, csv, likedonly){
  if (style === undefined){
    console.log("style is undefined.");
    return;
  }
  var csv = csv || false; // defaults to false
  var likedonly = likedonly || false; // defaults to false
  if (likedonly) {
    console.log("Only selecting liked songs");
  }
  if (style == "all" && !csv){
    console.log("Duration, ratings, and playcount will only be exported with the CSV flag");
  }
  outText = "";
  if (csv) {
    if (style == "all") {
      //extra line
      outText = "artist,album,title,duration,playcount,rating,rating_interpretation" + "\n";
    } else if (style == "artist") {
    } else if (style == "artistsong") {
    } else if (style == "artistalbum") {
    } else if (style == "artistalbumsong") {
    } else {
      console.log("style not defined");
    }
  }
  var numEntries = 0;
  var seen = {};
  for (var i = 0; i < allsongs.length; i++) {
    var curr = "";
    var properTitle = allsongs[i].title.replace(/[\n\r]/g, '').trim();
    if (!likedonly || (likedonly && allsongs[i].rating >= 5)){
      if (csv) {
        if (style == "all") {
          //extra line
          curr += '"' + allsongs[i].artist.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].album.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + properTitle.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].duration.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].playcount.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].rating.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].rating_interpretation.replace(/"/g, '""').trim() + '"';
        } else if (style == "artist") {
          curr += '"' + allsongs[i].artist.replace(/"/g, '""').trim() + '"';
        } else if (style == "artistsong") {
          curr += '"' + allsongs[i].artist.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + properTitle.replace(/"/g, '""').trim() + '"';
        } else if (style == "artistalbum") {
          curr += '"' + allsongs[i].artist.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].album.replace(/"/g, '""').trim() + '"';
        } else if (style == "artistalbumsong") {
          curr += '"' + allsongs[i].artist.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + allsongs[i].album.replace(/"/g, '""').trim() + '"' + ",";
          curr += '"' + properTitle.replace(/"/g, '""').trim() + '"';
        } else {
          console.log("style not defined");
        }
      } else {
        if (style == "all"){
          curr = allsongs[i].artist + " | " + allsongs[i].album + " | " + properTitle + " [[playcount: " + allsongs[i].playcount + ", rating: " + allsongs[i].rating_interpretation + "]]" ;
        } else if (style == "artist"){
          curr = allsongs[i].artist;
        } else if (style == "artistalbum"){
          curr = allsongs[i].artist + " | " + allsongs[i].album;
        } else if (style == "artistsong"){
          curr = allsongs[i].artist + " | " + properTitle;
        } else if (style == "artistalbumsong"){
          curr = allsongs[i].artist + " | " + allsongs[i].album + " | " + properTitle;
        } else {
          console.log("style not defined");
        }
      }
      if (!seen.hasOwnProperty(curr)){ // hashset
        outText = outText + curr + "\n";
        numEntries++;
        seen[curr] = true;
      } else {
        //console.log("Skipping (duplicate) " + curr);
      }
    }
  }
  console.log("=============================================================");
  console.log(outText);
  console.log("=============================================================");
  try {
    copy(outText);
    console.log("copy(outText) to clipboard succeeded.");
  } catch (e) {
    console.log(e);
    console.log("copy(outText) to clipboard failed, please type copy(outText) on the console or copy the log output above.");
  }
  console.log("Done! " + numEntries + " lines in output. Used " + numEntries + " unique entries out of " + allsongs.length + ".");
};
var scrapeSongs = function(){
  var intervalms = 1; //in ms
  var timeoutms = 3000; //in ms
  var retries = timeoutms / intervalms;
  var total = [];
  var seen = {};
  var topId = "";
  document.querySelector("#mainContainer").scrollTop = 0; //scroll to top
  var interval = setInterval(function(){
    var songs = document.querySelectorAll("table.song-table tbody tr.song-row");
    if (songs.length > 0) {
      // detect order
      var colNames = {
        index: -1,
        title: -1,
        duration: -1,
        artist: -1,
        album: -1,
        playcount: -1,
        rating: -1
        };
      for (var i = 0; i < songs[0].childNodes.length; i++) {
        colNames.index = songs[0].childNodes[i].getAttribute("data-col") == "index" ? i : colNames.index;
        colNames.title = songs[0].childNodes[i].getAttribute("data-col") == "title" ? i : colNames.title;
        colNames.duration = songs[0].childNodes[i].getAttribute("data-col") == "duration" ? i : colNames.duration;
        colNames.artist = songs[0].childNodes[i].getAttribute("data-col") == "artist" ? i : colNames.artist;
        colNames.album = songs[0].childNodes[i].getAttribute("data-col") == "album" ? i : colNames.album;
        colNames.playcount = songs[0].childNodes[i].getAttribute("data-col") == "play-count" ? i : colNames.playcount;
        colNames.rating = songs[0].childNodes[i].getAttribute("data-col") == "rating" ? i : colNames.rating;
      }
      // check if page has updated/scrolled
      var currId = songs[0].getAttribute("data-id");
      if (currId == topId){ // page has not yet changed
        retries--;
        scrollDiv = document.querySelector("#mainContainer");
        isAtBottom = scrollDiv.scrollTop == (scrollDiv.scrollHeight - scrollDiv.offsetHeight)
        if (isAtBottom || retries <= 0) {
          clearInterval(interval); //done
          allsongs = total;
          console.log("Got " + total.length + " songs and stored them in the allsongs variable.");
          console.log("Calling songsToText with style all, csv flag true, likedonly false: songsToText(\"all\", false).");
          songsToText("artistalbumsong", false, false);
        }
      } else {
        retries = timeoutms / intervalms;
        topId = currId;
        // read page
        for (var i = 0; i < songs.length; i++) {
          var curr = {
            dataid: songs[i].getAttribute("data-id"),
            index: (colNames.index != -1 ? songs[i].childNodes[colNames.index].textContent : ""),
            title: (colNames.title != -1 ? songs[i].childNodes[colNames.title].textContent : ""),
            duration: (colNames.duration != -1 ? songs[i].childNodes[colNames.duration].textContent : ""),
            artist: (colNames.artist != -1 ? songs[i].childNodes[colNames.artist].textContent : ""),
            album: (colNames.album != -1 ? songs[i].childNodes[colNames.album].textContent : ""),
            playcount: (colNames.playcount != -1 ? songs[i].childNodes[colNames.playcount].textContent : ""),
            rating: (colNames.rating != -1 ? songs[i].childNodes[colNames.rating].getAttribute("data-rating") : ""),
            rating_interpretation: "",
            }
          if(curr.rating == "undefined") {
            curr.rating_interpretation = "never-rated"
          }
          if(curr.rating == "0") {
            curr.rating_interpretation = "not-rated"
          }
          if(curr.rating == "1") {
            curr.rating_interpretation = "thumbs-down"
          }
          if(curr.rating == "5") {
            curr.rating_interpretation = "thumbs-up"
          }
          if (!seen.hasOwnProperty(curr.dataid)){ // hashset
            total.push(curr);
            seen[curr.dataid] = true;
          }
        }
        songs[songs.length-1].scrollIntoView(true); // go to next page
      }
    }
  }, intervalms);
};
scrapeSongs();
// for the full CSV version you can now call songsToText("all", true);