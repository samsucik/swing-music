# Downloading from online-jazz-archive
1. Go to jazz-on-line.com/artists, choose an artist and copy artist's name from the URL
1. Paste the name into `jazz-on-line-scraper/index.js`
1. Run `node jazz-on-line-scraper/index.js` (creates list of URLs with the artist's songs)
1. Run `./downloader.sh jazz-on-line-scraper/list-name` (replace `list-name` with actual list). This downloads the mp3 files where found
1. Create master directory for all songs of the artist
1. Run `./sorter.sh masterdir` and all downloaded mp3 files will be organised in subdirectories of `masterdir`

# Organising with Google Music
1. Like songs that you're interested in
1. Go the the 'Thumbs-up' playlist and use `export_google_music.js` ([kudos to Jeremie Miserez](https://gist.githubusercontent.com/jmiserez/c9a9a0f41e867e5ebb75/raw/2195aa4ec75c12fb1539ec727faa555643107ec5/export_google_music.js)) in developer console to get a list of the songs
1. Save the list of songs and regexp away everything except the songs' names (careful with Roy Eldridge's songs from archive.org!)
1. Run `tagger.sh` to tag all the songs from the list as, let's say, Lindy songs
1. Open Mixxx and the tag should appear! If not, select songs and click right > Metadata > Import from file tags

# BPM
1. Although Mixxx can calculate BPM, it very often fails on swing music. Use Adam Harries's [Ellington](https://github.com/AdamHarries/ellington) instead:

```bash
# Crawl the music library (or a part of it)
ellington init library.json -d ~/Directory-to-scan/

# Calculate BPM
ellington bpm library.json 

# Write BPM as TBPM ID3v2 tag (instead of using Ellington like: ellington write library.json)
./bpm_writer.py library.json
```
1. In Mixxx, the BPM info doesn't load nicely. Workaround: select the songs, right click > Clear > BPM and Beatgrid. Then right click > Metadata > Import From File Tags.

# Using Mixxx
## Organising music
Use the `grouping` tag (TIT1) to categorise music as Lindy, Blues, bad, etc. Also, BPM, bitrate, duration... :-)

## BPM Analysis
Go to `Analyze` tab, select songs and start analysis (adds BPM info). Double-check because Mixxx generally does a poor job analysing BPM in swing music: Right click > `Properties` > `BPM` and check the BPM manually.

## DJ-ing
1. Start Mixxx
1. Ensure HW is channelled properly (Options > Preferences). Generally, use laptop's jack for headphones and external sound card (usb) for speakers
1. Ensure equaliser is set all the way to the left
1. Ensure fading time is set to 0 seconds (or **to a negative value**)
1. Check that Auto DJ contains enough songs (if not, can import entire playlist to Auto DJ)
1. Hit `Enable Auto DJ` and watch the magic happen
1. Preview songs in the Preview deck (enable if hidden), check the beginning, end, middle, duration, tempo, etc
1. To add songs to Auto DJ, right click and either `Add to Auto DJ Queue`, or `Load to Deck` (to play it as the next song)

# Lessons learnt as a DJ
- Mix old and new tracks, beware of playing only historical (low-quality) tracks!
- Know which songs are the floor-fillers *in the particular community*.
- Play it safe (at least from the beginning), don't go for fast songs first.
- Don't play fasts songs (or songs otherwise discouraging) if people don't know them, or risk having an empty dancefloor (there must be something positive about the song that will keep people dancing even at crazier tempos).
- Use the equaliser, in particular to make the rhythm section more audible in older recordings, or to eliminate to unpleasant, low-quality high-pitched tones.


# Useful resources
- [Ellington for BPM analysis](https://github.com/AdamHarries/ellington)
- [mid3v2 for working with ID3v2 tags](https://mutagen.readthedocs.io/en/latest/man/mid3v2.html)
- [mappings between various tag systems](https://picard.musicbrainz.org/docs/mappings/)
- [jazz-on-line for tonnes of free music](http://www.jazz-on-line.com/artists/)
- [archive.org for even more free music, though often wildly structured and with poor metadata](https://archive.org/details/audio?and%5B%5D=swing&sin=&and%5B%5D=mediatype%3A%22audio%22&sort=&page=2)
