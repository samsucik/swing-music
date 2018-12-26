#!/usr/bin/python3

# Takes BPM calculated by using Ellington
# (see https://github.com/AdamHarries/ellington)
# and stored in a library.json file, and adds it
# as an ID3 tag to the track files.

import json
import sys
from pathlib import Path
import subprocess
from shlex import split

def write_tags(lib_address):
    with open(lib_address) as f:
        lib_parsed = json.load(f)
        for track in lib_parsed["tracks"]:
            try:
                filename = track["location"]
                bpm = track["eldata"]["algs"]["ffmpeg-naive"]

                print("Track: {}\t\tBPM: {}".format(filename, bpm))

                bashCommand1 = split('mid3v2 -l ./\"{}\"'.format(filename))                
                process1 = subprocess.Popen(bashCommand1, stdout=subprocess.PIPE)

                bashCommand2 = split('grep "TBPM="')                
                process2 = subprocess.Popen(bashCommand2, stdin=process1.stdout, stdout=subprocess.PIPE)
                
                bashCommand3 = split('sed "s/TBPM=//g"')                
                process3 = subprocess.Popen(bashCommand3, stdin=process2.stdout, stdout=subprocess.PIPE)
                
                output, error = process3.communicate()
                if len(output) > 0:
                    continue

                bashCommand = split('mid3v2 --TBPM {} ./\"{}\"'.format(bpm, filename))                
                process = subprocess.Popen(bashCommand, stdout=subprocess.PIPE)
                output, error = process.communicate()

                if error is not None:
                    print("\tAdding BPM tag failed!")
                    raise Exception("Couldn't add BPM tag.")
                else:
                    print("\tAdding BPM tag succeeded!")

            except Exception as e:
                raise e
    
def check_tools():
    bashCommand = 'mid3v2 -h'
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    
    return error is None

def check_library(library_filename):
    library_file = Path(library_filename)

    return library_file.is_file()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        options = "ellington-library-file"
        print("Usage:\t{} {}".format(sys.argv[0], options))
        exit(0)

    library = sys.argv[1]
    if not check_library(library): 
        raise Exception("The provided library file '{}' does not exist."\
                        .format(library))

    if not check_tools():
        install_command = "sudo apt-get install python-mutagen"
        raise Exception("mid3v2 is not installed. Install it like this '{}'"\
                        .format(install_command))

    write_tags(library)
