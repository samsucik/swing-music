#!/bin/bash

tag_to_change=TIT1
while [ $# -gt 0 ];
do
  case "$1" in
  --song-list=*)
  songs=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  --tag-type*)
  tag_to_change=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  --tag-value=*)
  tag=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  *)  echo "Unknown argument: $1, exiting"; echo -e $usage; exit 1 ;;
  esac
done

while read song; do
	if [[ "$song" == *.mp3 ]]; then
	    extension=""
	else
	    extension=".mp3"
	fi
	song_sanitised=$(sed 's|"|\"|g' <<< $song)
	occurances=$(find . -name "${song_sanitised}${extension}" -type f -printf '.' | wc -c)
	if [ ! $occurances -eq 1 ]; then
		echo "${song_sanitised} ($occurances occurances)"
		continue
	fi
	song_file=$(find . -name "${song_sanitised}${extension}" -type f)
	song_file=$(sed 's|"|\"|g' <<< $song_file)
	
	if [ `mid3v2 -l "${song_file}" | grep "${tag_to_change}" | wc -l` -eq 1 ]; then
		continue
	else
		cmd="mid3v2 --${tag_to_change} \"${tag}\" \"${song_file}\""
		eval $cmd || echo "Tagging ${song_file} failed."
	fi
done < $songs
