# Usage- mstore (path)
mstore () {
  if [[ $# -eq 0 ]] ; then
    echo "Missing filepath"
    return 0;
  fi
  curl -F filedata=@$1 http://store.haus/upload
}


# Usage- mload (index)
# if no index, loads current
mload () {
  if [[ $# -eq 0 ]] ; then
    echo "trying one"
    wget --content-disposition http://store.haus/current
    return 0;
  fi
  wget --content-disposition http://store.haus/$1
}

mlist() {
  curl http://store.haus/list
}
