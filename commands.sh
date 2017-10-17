# Usage- mstore (path)

mauth () {
  printf "Target server URL: "
  read target_url
  printf "Input secret token: "
  read secret_token
  # Perform check
  curl -sfH "x-auth: $secret_token" $target_url
  if [[ $? -ne 0 ]]; then
    echo "Failed to connect to server"
    exit 1
  fi

  mkdir -p ~/.mstore_creds
  echo $target_url > ~/.mstore_creds/url
  echo $secret_token > ~/.mstore_creds/secret
  echo "Installed credentials."
}

mtemp_auth () {
  target_url=`cat ~/.mstore_creds/url`
  secret_token=`cat ~/.mstore_creds/secret`
  curl -fH "x-auth: $secret_token" ${target_url}/temp_auth
  if [[ $? -ne 0 ]]; then
    echo "Failed to connect"
  fi
}

mstore () {
  if [[ $# -eq 0 ]] ; then
    echo "Missing filepath"
    return 0;
  fi
  target_url=`cat ~/.mstore_creds/url`
  secret_token=`cat ~/.mstore_creds/secret`
  curl -fH "x-auth: $secret_token" -F filedata=@$1 ${target_url}/upload
  if [[ $? -ne 0 ]]; then
    echo "Failed to connect"
  fi
}

# Usage- mload (index)
# if no index, loads current
mload () {
  target_url=`cat ~/.mstore_creds/url`
  secret_token=`cat ~/.mstore_creds/secret`
  if [[ $# -eq 0 ]] ; then
    echo "trying one"
    wget --header="x-auth: $secret_token" --content-disposition ${target_url}/current
    return 0;
  fi
  wget --header="x-auth: $secret_token" --content-disposition ${target_url}/$1
}

mlist() {
  target_url=`cat ~/.mstore_creds/url`
  secret_token=`cat ~/.mstore_creds/secret`
  curl -fH "x-auth: $secret_token" ${target_url}/list
  if [[ $? -ne 0 ]]; then
    echo "Failed to connect"
  fi
}
