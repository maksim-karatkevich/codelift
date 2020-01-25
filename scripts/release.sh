# See: https://intuit.github.io/auto/pages/getting-started.html#enabling-skip-release-label
export PATH=$(npm bin):$PATH

VERSION=`auto version`

if [ ! -z "$VERSION" ]; then
  auto changelog
  lerna publish --yes $VERSION -m '%v [skip ci]'
  auto release
fi
