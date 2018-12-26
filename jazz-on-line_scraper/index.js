const rp = require('request-promise');
const cheerio = require('cheerio');
var fs = require('fs');

var artist = "Fats_Waller"

function writeToFile(txt) {
  fs.appendFile(artist + ".txt", txt, function (err) {
    if (err) throw err;
  });
}
const options = {
  uri: "http://www.jazz-on-line.com/artists/" + artist + ".htm",
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    $('table tr td font a').each(function(i, elem) {
      var link = $(this).attr("href");
      if (link.indexOf(".mp3") !== -1) {
        var fullDescription = $(this).parent().text();
        var title = $(this).text();
        i = fullDescription.indexOf(title);
        var description = fullDescription.substring(i + title.length).trim();
        var yearMatch = /\([0-9]+\)/g.exec(description);
        var year = "";
        if (yearMatch) {
          year = yearMatch[0].slice(1, -1);
          if (year.length > 4) {
            year = year.slice(-4);
          }
          description = description.substring(yearMatch.index + yearMatch[0].length)
                                   .trim();
        }
        var textToWrite = "URL: " + link + 
                      "\nTitle: " + title +
                      "\nYear: " + year +
                      "\nDescription: " + description + "\n\n";
        writeToFile(textToWrite);
      } else {
        // Skip
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
