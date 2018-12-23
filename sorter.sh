#!/bin/bash

# Music sorter for files from jazz-on-line.com
# Creates directories for different interprets,
# renames track files to real song names and puts
# them into the respective directories.

usage="Usage: "`basename $0`" [DIR]\n
\tDIR:\tMaster directory in which the tracks will be put into subdirectories\n
\t\t\tbased on artist names. Defaults to current directory.\n"

if [ $# -lt 1 ]; then
  echo -e $usage;
  echo "Master directory defaulting to current directory..."
  DIR='.'
else
  echo "All tracks sorted in the master directory '$1'..."
  DIR=$1
fi

for f in ./*.mp3
do
  if [[ -s $f ]]
  then
  	a=$(ffprobe -loglevel error -show_entries format_tags=artist -of default=noprint_wrappers=1:nokey=1 "$f")
  	t=$(ffprobe -loglevel error -show_entries format_tags=title -of default=noprint_wrappers=1:nokey=1 "$f")
  	echo "Track '${t}' by ${a}"
  	mkdir -p "${DIR}/${a}"
  	mv -n "$f" "${DIR}/${a}/${t}.mp3"
  fi
  rm "$f" || true > /dev/null
done
