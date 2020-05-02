#!/bin/bash

ratings_file="ratings.csv"
location_prefix_to_remove="../Music/swing/"


while read line; do
	rating=$(echo "$line" | sed 's/.*#//g')
	song=$(echo "$line" | sed 's/#.*//g')

	if [ $location_prefix_to_remove != "" ]; then
		song=$(echo "$song" | sed "s|$location_prefix_to_remove||g")
	fi
	echo "$rating $song"

	current_rating=$(mid3v2 -l "$song" | grep "POPM")

	if [ "$current_rating" != "" ]; then
		echo "Old rating: $current_rating"
	fi

	cmd="mid3v2 --POPM \"XXX:${rating}:10\" \"${song}\""
	eval $cmd || echo "Tagging ${song} failed."
	new_rating=$(mid3v2 -l "$song" | grep "POPM")
	echo "New rating: $new_rating"

done < $ratings_file
