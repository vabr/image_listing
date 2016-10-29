#!/usr/bin/env python

# This script expects a single argument (a target directory). It also expects
# to have the HTML support files and template in a html/ directory, and the
# support JS libraries in a third_party directory.
#
# The script copies the support files over to the target directory, and then
# generates the index.html files for all directory in the tree rooted at the
# target directory. To do so, it determines the lists of image files and
# directories in each of those directories.

def main():
  # Check the arguments.
  # Locate the support files.
  # Move the non-template support files to the target directory.
  # Start a breadth-first-search in the target directory:
  # directory_queue = [ (target, 0) ]
  # while directory_queue:
  #   (current_dir, depth) = directory_queue.pop()
  #   Determine the relative path to the root.
  #   Determine the child directories.
  #   directory_queue += list_of_children
  #   Determine the list of images.
  #   Instantiate the template with the three determined lists and copy it
  #     into the current directory.

if __name__ == "__main__":
    main()
