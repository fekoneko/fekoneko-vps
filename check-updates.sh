#!/usr/bin/env bash

# Usage: fetch_tags <registry> <namespace> <repository> [<token>]
fetch_tags() {
  local auth_header=''
  [[ -n $4 ]] && auth_header="Authorization: Bearer $4"

  curl -sL "https://$1/v2//namespaces/$2/repositories/$3/tags?page_size=100" \
    -H 'Content-Type: application/json' \
    -H "$auth_header" \
    | jq -r '.results[].name'
}

# Usage: fetch_tags_dockerhub <namespace> <repository>
fetch_tags_dockerhub() {
  fetch_tags 'hub.docker.com' "$1" "$2"
}

# Usage: semvers_with_latest_segment <segment_index> <<< <semvers>
semvers_with_latest_segment() {
  local segment_index="$1"
  local cut_args=() semver segment latest_segment='' semvers=''

  (( segment_index > 1 )) && cut_args+=(-s)

  while read -r semver; do
    semvers+="$semver"$'\n'
    segment="$(cut "${cut_args[@]}" -d'.' -f"$segment_index" <<< "$semver")" || return 1
    segment="${segment%%-*}"
    [[ -z $segment ]] && continue
    if [[ -z $latest_segment ]] || (( segment > latest_segment )); then
      latest_segment=$(( segment )) || return 1
    fi
  done

  [[ -z $latest_segment ]] && return 2

  while read -r semver; do
    segment="$(cut "${cut_args[@]}" -d'.' -f"$segment_index" <<< "$semver")" || return 1
    segment="${segment%%-*}"
    [[ -z $segment ]] && continue
    if (( segment == latest_segment )); then
      echo "$semver"
    fi
  done <<< "$semvers"
}

# Usage: latest_semver <<< <semvers>
latest_semver() {
  local prev_semvers semvers segment_index=1
  prev_semvers="$(cat | tr -d ' ' | uniq)"
  while true; do
    semvers="$(semvers_with_latest_segment "$segment_index" <<< "$prev_semvers")"
    case $? in
      1) return 1;;
      2) break;;
    esac
    prev_semvers="$semvers"
    (( segment_index++ ))
  done
  echo "$prev_semvers"
}

# Usage: print_tag <label> <<< <semvers>
print_tag() {
  echo "  $1"
  is_first_line=true
  while read -r semver; do
    if [[ $is_first_line == true ]]
      then echo "   └╴ $semver"; is_first_line=false
      else echo "      $semver"
    fi
  done < <(latest_semver) || return 1
}

# Usage: run
run() {
  echo '# Latest tags for docker-compose.yaml files'

  # anki
  fetch_tags_dockerhub 'jeankhawand' 'anki-sync-server' \
    | grep '^[0-9.]*$' \
    | print_tag 'anki (jeankhawand/anki-sync-server)' \
    || exit 1

  # drawpile
  fetch_tags_dockerhub 'drawpile' 'drawpile-srv' \
    | grep '^[0-9.]*$' \
    | print_tag 'drawpile (drawpile/drawpile-srv)' \
    || exit 1

  # nextcloud
  fetch_tags_dockerhub 'library' 'nextcloud' \
    | grep '^[0-9.]*-apache$' \
    | print_tag 'nextcloud (nextcloud)' \
    || exit 1

  # postgres
  fetch_tags_dockerhub 'library' 'postgres' \
    | grep '^[0-9.]*$' \
    | print_tag 'postgres (postgres)' \
    || exit 1

  # searxng
  fetch_tags_dockerhub 'searxng' 'searxng' \
    | grep '^[0-9.]*-[a-z0-9]*$' \
    | print_tag 'searxng (searxng/searxng)' \
    || exit 1

  # traefik
  fetch_tags_dockerhub 'library' 'traefik' \
    | grep '^[0-9.]*$' \
    | print_tag 'traefik (traefik)' \
    || exit 1

  # vaultwarden
  fetch_tags_dockerhub 'vaultwarden' 'server' \
    | grep '^[0-9.]*$' \
    | print_tag 'vaultwarden (vaultwarden/server)' \
    || exit 1

  # wireguard
  curl -s 'https://github.com/wg-easy/wg-easy/pkgs/container/wg-easy/versions?filters\[version_type\]=tagged' \
    | sed -nr 's|<a [^>]* href="/orgs/wg-easy/packages/container/wg-easy/.*\?[^"]*tag=[^"]*"[^>]*>([0-9.]*)</ *a>|\1|p' \
    | print_tag 'wireguard (ghcr.io/wg-easy/wg-easy)' \
    || exit 1
  # If we try to use Google Cloud Registry API instead, we get:
  # Artifact Registry API has not been used in project 550187917631 before or it is disabled

  echo $'\n# Latest tags for Dockerfiles'

  # landing (bun)
  fetch_tags_dockerhub 'oven' 'bun' \
    | grep '^[0-9.]*$' \
    | print_tag 'landing (oven/bun)' \
    || exit 1

  # wstunnel (ubuntu)
  fetch_tags_dockerhub 'library' 'ubuntu' \
    | grep '^[0-9.]*$' \
    | print_tag 'wstunnel (ubuntu)' \
    || exit 1

  # wstunnel (wstunnel)
  curl -sL 'https://api.github.com/repos/erebe/wstunnel/releases/latest' \
    -H 'Accept: application/json' \
    -H 'X-GitHub-Api-Version: 2022-11-28' \
    | jq -r '.tag_name' \
    | tr -d 'v' \
    | print_tag 'wstunnel (erebe/wstunnel)' \
    || exit 1
}

run
