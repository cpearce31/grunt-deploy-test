'use strict'

const ghPagesList = [
  'index.html',
  'favicon.ico',
  'public'
].join(' ')

module.exports = {
  'check-gitignore': {
    command: '([ ! -f .gitignore ] || (git ls-files | grep -q node_modules))' +
             '&& printf "\n\nWARNING: Your repo is missing .gitignore or you"' +
             'have committed node_modules. Please ask an instructor for' +
             'assistance!\n\n && false'
  },
  'git-is-clean': {
    // `$(git status --porcelain)` will evaluate to the empty string if the
    // working directory is clean.
    // `test -z` will exit 0 (true) if its argument is an empty string.
    // If it doesn't exit true, `(git status && false)` will show why the
    // repository isn't clean and exit false causing the grunt tasks to end.
    command: 'test -z "$(git status --porcelain)"  || (git status && false)'
  },
  'git-push-master': {
    // if the push to master fails, we want to delete any files that were created
    // by the build process and exit all remaining build steps
    command: 'git push origin master || (git clean -xdf && false)'
  },
  'git-checkout-master': {
    command: 'git checkout master'
  },
  'deploy-prepare': {
    command: [
      'git branch -D gh-pages || echo "so not removed"',
      'git checkout --orphan gh-pages',
      'git rm --cached \'*\' && echo "rm cached workd"'
    ].join(' && ')
  },
  'deploy-publish': {
    command: [
      'touch .nojekyll',
      `git add --force .nojekyll ${ghPagesList}`,
      'git commit -m "deploy task"',
      'git push origin gh-pages --force',
      'git clean -x -d --force --exclude=node_modules',
      'git checkout master'
    ].join(' && ')
  }
}
