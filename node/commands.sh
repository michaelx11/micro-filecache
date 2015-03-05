# Usage- mstore (path)
mstore () {
  if [[ $# -eq 0 ]] ; then
    echo "Missing filepath"
    return 0;
  fi
  curl -F filedata=@$1 http://m.xvm.mit.edu/upload
}


# Usage- mload (index)
# if no index, loads current
mload () {
  if [[ $# -eq 0 ]] ; then
    echo "trying one"
    wget --content-disposition http://m.xvm.mit.edu/current
    return 0;
  fi
  wget --content-disposition http://m.xvm.mit.edu/$1
}

mlist() {
  curl http://m.xvm.mit.edu/list
}
