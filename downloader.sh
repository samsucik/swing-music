#!/bin/bash
FILE=$1

URL=""
TITLE=""
YEAR=""
DESC=""

while IFS='' read -r line || [[ -n "$line" ]]; do
    if [[ $line == "URL:"* ]]
    then
    	URL=$(echo "$line" | sed -e 's/URL: //')
    elif [[ $line == "Title:"* ]]
    then
    	TITLE=$(echo "$line" | sed -e 's/Title: //')
    elif [[ $line == "Year:"* ]]
    then
    	YEAR=$(echo "$line" | sed -e 's/Year: //')
    elif [[ $line == "Description:"* ]]
    then
    	DESC=$(echo "$line" | sed -e 's/Description: //')

    	echo "Downloading '${TITLE} (${YEAR})' from '${URL}'"

    	FNAME="${TITLE}.mp3"
    	if [ ! -e "$FNAME" ]; then
		    echo "  File not found (${FNAME})! Downloading..."
			wget_output=$(wget -O "$FNAME" -q "$URL")
			fileExists=0
		else
			echo "  ${FNAME} exists. Not downloading it again..."
			fileExists=1
		fi

		if [[ "$fileExists" == 0 && $? -ne 0 ]]; then
		    echo "  Failed."
		    rm "$FNAME" || true
		else
			if [ ! -s "$FNAME" ]
			then
				echo "  File is corrupt."
			else
				echo "  Succeeded."

				y=$(mp3info -p %y "$FNAME")
				if [ "$y" != "$YEAR" -a ! -z "$YEAR" ]
				then
					echo "  Adding year metadata to the track ($YEAR)"
					mp3info -y "$YEAR" "$FNAME"
				fi

				echo "  Adding description metadata to the track."
				c=$(mp3info -p %c "$FNAME")
				if [ -z "$c" ]
				then
					mp3info -c "$DESC" "$FNAME"
				else
					mp3info -c "${c}. ${DESC}" "$FNAME"
				fi
			fi
		fi
    fi
done < $FILE
