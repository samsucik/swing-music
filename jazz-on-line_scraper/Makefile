ARTISTS = $(shell cat artists.txt)
DATAFILES = $(patsubst %,data/lists/%.txt,$(ARTISTS))
MP3FOLDERS = $(patsubst %,data/mp3/%,$(ARTISTS))

all: $(MP3FOLDERS)

data/mp3/%: data/lists/%.txt data/mp3
	mkdir -p $@
	cd $@ && ../../../../downloader.sh ../../../$<


data/lists/%.txt: data/lists
	node index.js $(subst .txt,,$(subst data/lists/,,$@))
	mv $(subst data/lists/,,$@) $@

data/mp3: data
	mkdir -p data/mp3

data/lists: data
	mkdir -p data/lists

data:
	mkdir -p data

clean:
	rm -rf data