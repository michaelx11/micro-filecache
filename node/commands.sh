deposit () {
  curl -F filedata=@$1 http://m.xvm.mit.edu/upload
}

retrieve () {
  wget --content-disposition http://m.xvm.mit.edu/$1
}
