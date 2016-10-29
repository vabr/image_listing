#!/usr/bin/env python

# This script expects a single argument (a target directory). It also expects
# to have the HTML support files and template in a html/ directory, and the
# support JS libraries in a third_party directory.
#
# The script copies the support files over to the target directory, and then
# generates the index.html files for all directory in the tree rooted at the
# target directory. To do so, it determines the lists of image files and
# directories in each of those directories.

import argparse
import os
import os.path
import shutil
import sys

SUPPORT_FILES = [ "html/gesture_handling.js", "html/style.css", "third_party/hammer_js/hammer.min.js" ]
HTML_TEMPLATE = "html/index-template.html"

# Returns True iff |filename| is a file generated by some version of this
# script. This is used to determine if it is safe to overwrite files in the
# target directory.
def IsGenerated(filename):
  #TODO: Implement the check based on substring stamp put into generated files and on os.path.exists(filename).
  return True;

# Returns True iff |name| is a name of an image file.
def IsImage(name):
  (_, extension) = os.path.splitext(name)
  result = extension.lower() in [ ".jpg", ".jpeg", ".png", ".tif" ]
  if not result:
    #TODO: Remove this once the list of extensions is reasonable.
    print "{} is not an image".format(name)
  return result

# Converts a list |l| of strings into a single string, wrapping each item in
# quotes, and separating them with commas.
def ListToString(l):
  return ",".join(['"' + string + '"' for string in l])

# Takes the template from |src|, replaces all occurences of ${PATH_TO_ROOT},
# ${DIR_NAMES} and ${IMAGE_NAMES} with |root|, |dirs| and |images|, and writes
# the result to |dest|.
def InstantiateTemplate(src, dest, root, dirs, images):
  with open(src, "r") as src_file:
    with open(dest, "w") as dest_file:
      for line in src_file:
        line = line.replace("${PATH_TO_ROOT}", root)
        line = line.replace("${DIR_NAMES}", ListToString(dirs))
        line = line.replace("${IMAGE_NAMES}", ListToString(images))
        dest_file.write(line)

def main():
  # Check the arguments.
  parser = argparse.ArgumentParser(description='Generate image listings.')
  parser.add_argument('target_dir', metavar='target_dir',
                      help='the root directory where to start creating the listing')
  parser.add_argument('-d', '--dry-run', dest='dry_run', action='store_true',
                      help='avoid writing anything, just report')
  parser.add_argument('-f', '--force', dest='force', action='store_true',
                      help='rewrite files with conflicting names in the target tree, even if not generated by this script')

  args = parser.parse_args()

  # Locate the template
  cwd = os.getcwd()
  template_path = os.path.join(cwd, HTML_TEMPLATE)
  if not os.path.isfile(template_path):
    sys.exit("File {} is needed and missing".format(template_path))

  # Locate the non-template support files and move them to the target directory.
  for support_file in SUPPORT_FILES:
    src_file_path = os.path.join(cwd, support_file)
    if not os.path.isfile(src_file_path):
      sys.exit("File {} is needed and missing".format(src_file_path))
    dest_file_path = os.path.join(args.target_dir, os.path.basename(support_file))
    if not (args.force or IsGenerated(dest_file_path)):
      sys.exit("File {} is likely not generated, will not overwrite".format(dest_file_path))
    if args.dry_run:
      print "cp {} {}".format(src_file_path, dest_file_path)
    else:
      shutil.copy(src_file_path, dest_file_path)

  # Start a breadth-first-search in the target directory:
  if not os.path.isdir(args.target_dir):
    sys.exit("The target directory {} is missing".format(args.target_dir))
  directory_queue = os.walk(args.target_dir, topdown=True, followlinks=False)
  # The path from |current_dir| below to |args.target|.
  relative_root = ""
  for (current_dir, dirs, files) in directory_queue:
    # Determine the relative path to the root. Here it is important that the
    # search is breadth-first.
    if os.path.normpath(os.path.join(current_dir, relative_root)) != os.path.normpath(args.target_dir):
      relative_root += "../"
    # Determine the list of images.
    images = []
    for name in files:
      if IsImage(name):
        images.append(name)
    if args.dry_run:
      print "Instantiate template with relative path = {}, dirs = {} and images = {}".format(relative_root, dirs, images)
    else:
      InstantiateTemplate(template_path, os.path.join(current_dir, "index.html"), relative_root, dirs, images)

if __name__ == "__main__":
  main()
