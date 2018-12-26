#!/bin/bash

tag_to_change=TIT1
remove=false

while [ $# -gt 0 ];
do
  case "$1" in
  --song-list=*)
  songs=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  --tag-type*)
  tag_to_change=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  --tag-value=*)
  tag=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  --delete-selected=*)
  remove=`expr "X$1" : '[^=]*=\(.*\)'`; shift ;;
  *)  echo "Unknown argument: $1, exiting"; echo -e $usage; exit 1 ;;
  esac
done

while read line; do
	song=$(echo "$line" | sed 's/.*| //g')
	album=$(echo "$line" | sed 's/ |.*//g')

	# echo "$song ($album)"

	if [[ "$song" == *.mp3 ]]; then
	    extension=""
	else
	    extension=".mp3"
	fi
	
	song_sanitised=$(sed 's|"|\"|g' <<< $song)
	song_sanitised=$(sed 's|\[|\\[|g' <<< $song_sanitised)
	song_sanitised=$(sed 's|\]|\\]|g' <<< $song_sanitised)

	occurances=$(find . -name "${song_sanitised}${extension}" -type f -printf '.' | wc -c)

	if [ $occurances -lt 1 ]; then
		echo "No occurances of $song found"
		continue
	fi
	if [ ! $occurances -eq 1 ]; then
		echo "$occurances occurances of $song, looking at album metadata..."
		find . -name "${song_sanitised}${extension}" -type f > tmp
		rm -f occurances.list
		# echo "removed"
		while read f; do
			alb=$(mid3v2 -l "$f" | grep "TALB" | sed 's|TALB=||g')
			# echo "$alb (looking for $album)"
			if [ "$alb" == "$album" ]; then
				echo "$f" >> occurances.list
			fi
		done < tmp
		# cat occurances.list
		if [ ! `cat occurances.list | wc -l` -eq 1 ]; then
			echo "${song_sanitised} ($occurances occurances)"
			continue
		fi
	else
		find . -name "${song_sanitised}${extension}" -type f > occurances.list
	fi
	# song_file=$(find . -name "${song_sanitised}${extension}" -type f)
	# song_file=$(sed 's|"|\"|g' <<< $song_file)
	song_file=$(head -1 occurances.list)
	# echo "have unique song_file: $song_file"

	if [ $remove = true ]; then
		rm -f "$song_file"
		continue
	fi
	
	if [ `mid3v2 -l "${song_file}" | grep "${tag_to_change}" | wc -l` -eq 1 ]; then
		continue
	else
		cmd="mid3v2 --${tag_to_change} \"${tag}\" \"${song_file}\""
		eval $cmd || echo "Tagging ${song_file} failed."
	fi
done < $songs
