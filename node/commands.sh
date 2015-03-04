mstore () {
  curl -F filedata=@$1 http://m.xvm.mit.edu/upload
}

mload () {
  wget --content-disposition http://m.xvm.mit.edu/$1
}

mlist() {
  curl http://m.xvm.mit.edu/list
}
