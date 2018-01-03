## Quick Links

- [Getting Started](#getting-started)
- [Example 1 - Cherry Pick](#example-1---cherry-pick)
- [Example 2 - Stashing local changes](#example-2---stashing-local-changes)
- [Example 3 - Resetting your branch](#example-3---resetting-your-branch)
- [Example 4 - Nuking your local environment](#example-4---nuking-your-local-environment)
- [Example 5 - Rebasing from remote](#example-5---rebasing-from-remote)
- [Example 6 - Interactive rebasing](#example-6---interactive-rebasing)
- [Example 7 - New submodules](#example-7---new-submodules)
- [Example 8 - Existing submodules](#example-8---existing-submodules)
- [Example 9 - Reflogs](#example-9---reflogs)

## Getting Started

To start, clone this repo:
```
git clone https://github.com/rozele/git-tutorial
cd git-tutorial
```

It may also be useful to install Visual Studio Code for editing and Node.js so you can run the examples.

### Links

* [Visual Studio Code](https://code.visualstudio.com)
* [Node.js](nodejs.org)

## Example 1 - Cherry Pick

A useful practice for maintaining stable releases is to keep a master branch where new (but stable) code is committed and release branches where versioned stable code lives. [React Native](https://github.com/facebook/react-native) uses this model for managing their releases. If a bug fix or feature is added to the master branch that would be a useful patch for a stable release, that commit(s) is cherry-picked onto the release branch. Cherry-picking is the process of applying changes in the form of 1 or more commits onto a branch (in this case, the release branch), irrespective of their origin.

First, follow the steps in (Getting Started)[#getting-started]. Then, from the local tutorial folder, checkout the `ex1` example branch and look at the git commit history.

```
# checkout the `ex1` branch
git checkout ex1

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 2.0
# 
# Hello at 12:00:00

# look at commit log
git log --format=oneline
# Output:
# b8d8ed003f638e4bd7a07e0880d91779fe56f4fe Use locale time for greeting
# cac6149affd9682b0e06b2e0e4d0f8bbd6c4a0ee Adds date to greeting
# e90e23647398b6aa7c1ca43c18ec1a813d80ade4 Bumps version to 2.0
# 4d388832d64f14ce4c5d358066d73a69923b4e99 Adds hello script
# 758b7b7181efaa1d024eab629513d4e4b19e2a6a Initial commit
```

The current script is on version 2.0, we want to cherry-pick a commit to the `v1.x` branch to add the date to the greeting.

```
# checkout the `v1.x` release branch
git checkout v1.x

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 1.0
# 
# Hello

# cherry-pick the commit from the `ex1` branch
git cherry-pick cac6149a

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 1.0
# 
# Hello at Tue Jan 02 2018 12:00:00 GMT-0500 (Eastern Standard Time)
```

Notice the output is a very long date time string. This is because there were actually multiple commits that added and fixed the time formatting for the greeting. You can either cherry-pick the formatting commit (b8d8ed00) or cherry-pick multiple commits in the first place.

```
# reset the `v1.x` branch to its original state
git reset --hard origin/v1.x

# cherry-pick the commit range from the `ex1` branch
git cherry-pick e90e2364..b8d8ed00

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 1.0
# 
# Hello at 12:00:00
```

### Other applications

Cherry-picking is also useful for splitting up a development branch into logical pull requests.

### Links

* [git-cherry-pick](https://git-scm.com/docs/git-cherry-pick)

## Example 2 - Stashing local changes

Maybe you're working on a feature and you realize you didn't switch back to the main development branch. Or, maybe you want to rebase, but you have some pending changes that are blocking you from performing that operation. Whatever your reasoning may be, stashing can be a useful tool.

```
# checkout the `ex2-wip` example branch
git checkout ex2-wip

# look at commit log
git log -n 2 --format=oneline
# Output:
# 6c6ddd0eade9815fe44cc92b4837e7fbe14003e4 WIP
# b8d8ed003f638e4bd7a07e0880d91779fe56f4fe Use locale time for greeting

# reset the WIP commit (6c6ddd0e) so the changes from that commit are unstaged
git reset HEAD~1

# look at the unstaged changes with your diff tool of choice (e.g., VS Code)

# stash the changes
git stash

# look at the list of stashed changes
git stash list
# Output:
# stash@{0}: WIP on ex2-wip: b8d8ed0 Use locale time for greeting

# checkout the `ex2` branch
git checkout ex2

# pop the changes from the stash
git stash pop
# alternatively, `git stash pop stash@{0}`
# Output: merge conflict

# resolve the merge conflict with your tool of choice
# commit the changes (or reset them)
git commit -m "Irrelevant changes"

# look at the list of stashed changes
git stash list
# Output:
# stash@{0}: WIP on ex2-wip: b8d8ed0 Use locale time for greeting

# stash still contains the changes because of the merge conflict
# since you resolved the merge conflict, its safe to drop the stash ref
git stash drop
# alternatively, `git stash drop stash@{0}`

# look at the list of stashed changes
git stash list
# Output: (empty)
```

### Other notes

Think of stashing as a short-term memory cache. Stashing is not a good place to keep pending features or other work that should go in it's own branch.

For important/non-trivial changes, it's safest to add the changes you'd intended to stash to a new commit on a new branch. This takes a little more effort, but can save you if you end up doing something silly. As long as you don't explicitly run Git's garbage collector (you won't, accidentally), your work will always be recoverable if you've ever encapsulated it within a commit, even if you lose track of it. See Reflog below for details.

### Links

* [git-stash](https://git-scm.com/docs/git-stash)

## Example 3 - Resetting your branch

Sometimes you break stuff, and the learnings you gained whilst breaking stuff make it faster for you to start on your current work from scratch rather than fixing said broken stuff. This is one case where it makes sense to use `git reset`.

```
# checkout the `ex3` branch
git checkout ex3

# confirm that hello.js is broken
node hello.js
# Output: error

# reset the last commit that broke the changes
git reset --soft HEAD~1
# Also experiment with --mixed and --hard

# look at the staged changes with your diff tool of choice (e.g., VS Code)
#  --soft results in staged changes
#  --mixed results in unstaged changes
#  --hard results in changes totally reverted
```

### Other notes

Keep in mind that `git reset` is one of those commands that will "rewrite history". In this case, you'll be discarding commits that once were part of the current branch. If you've yet to publish these commits to a shared repo / branch (i.e. the master branch of a project's repo on GitHub), this is not an issue. However, if you've already pushed them to a shared branch, do not perform a reset, since others may have derived their own changes on top of them.

### Links

* [git-reset](https://git-scm.com/docs/git-reset)

## Example 4 - Nuking your local environment

What if your local environment has a bunch of build output files you want to get rid of? The `git clean` operation is a great way to nuke all those unwanted files.

```
# checkout the `ex4` branch
git checkout ex4

# reset the last commit so you have some unwanted build files unstaged
git reset HEAD~1

# look at the unstaged changes with your diff tool of choice (e.g., VS Code)

# clean
git clean -df

# look at the unstaged changes with your diff tool of choice (e.g., VS Code)
```

### Links

* [git-clean](https://git-scm.com/docs/git-clean)

## Example 5 - Rebasing from remote

Your feature branch has fallen behind the remote branch a bit. You could merge the remote branch into your branch, but, well, gross. You're better off rebasing your commits off the latest from the remote branch.

```
# checkout the `ex5-wip` branch
git checkout ex5-wip

# look at the commit history from the `ex5` branch
git log ex5 -n 3 --oneline
# Output: 
# 34c86a6 Bumps version to 3.0
# b8d8ed0 Use locale time for greeting
# cac6149 Adds date to greeting

# rebase your branch from `ex5`
git rebase ex5
# Output: merge conflict

# resolve the merge comflict with an editor of your choice (reject incoming change)

# resume the rebase with `--continue`
git rebase --continue
# Output: No changes

# skip the current rebase step since the commit is now empty
git rebase --skip

# look at the commit history on the `ex5-wip` branch
git log -n 3 --oneline
92ce269 Removes seconds from greeting
34c86a6 Bumps version to 3.0
b8d8ed0 Use locale time for greeting
```

### Other notes

The `git rebase` command will also rewrite history. Under the hood, it does this by replacing the current branch with a copy of the branch you're rebasing onto, and then cherry-picking your new commits from the original branch onto this replacement branch. As an exercise, note the commit ids of your new commits before and after performing a rebase. You'll see that they're different. This is because they have been moved, and now have a different history from their original counterparts.

### Links

* [git-rebase](https://git-scm.com/docs/git-rebase)

## Example 6 - Interactive rebasing

The maintainers of the OSS repository you contributor are nuts about clean commit histories. They hate merge commits. They're going to squash your changes when you submit a pull request, so you might as well do that for them, and then at least get your commit message the way you like it. Or, maybe you were too in the zone to write a commit message, so you just used "stuff" or "more changes" for a message and now you need to clean it up. Whatever your reasoning, rebasing is an extremely useful option.

```
# checkout the `ex6` branch
git checkout ex6

# look at the commit history on the `ex6` branch
git log -n 4 --oneline
# Output:
# e80d25b Stuff.
# 651a4c8 Some changes.
# 6eb3e0e Adds documentation to Hello class
# 686b957 Removes seconds from greeting

# Start an interactive rebase for the last 3 commits
git rebase -i HEAD~3
# alternatively, `git rebase -i 686b957`

# Using your git configured editor, change `pick` in line 2 to `fixup`
# and `pick` in line 3 to squash. Save the file and quit the editor.
# Play around with other options like `edit`, `reword` or `drop`.

# look at the commit history on the `ex6` branch
git log -n 2 --oneline
# Output:
# f9eb817 Adds documentation to Hello class
# 686b957 Removes seconds from greeting
```

### Links

* [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode)

## Example 7 - New submodules

If you need to take a source code dependency on another project, and its very likely you'll need to make changes or bug fixes to that project, a submodule may be the best option.

```
# checkout the `ex7` branch
git checkout ex7

# confirm hello.js is broken
node hello.js
# Output: error

# add the submodule
git submodule add https://github.com/rozele/git-tutorial-module output

# initialize the submodule
git submodule init

# pull the latest from the submodule
git submodule update

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 3.0
# 
#   Hello at 17:10
```

### Other notes

If you only need to take a source code dependency on another project, consider a simpler solution like package management with NPM.

### Links

* [git-submodule](https://git-scm.com/docs/git-submodule)

## Example 8 - Existing submodules

Sometimes you'll have to contribute to a project with submodules, here's how to get started.

```
# checkout the `ex8` branch
git checkout ex8

# confirm hello.js is broken
node hello.js
# Output: error

# initialize and update the submodules
git submodule update --init --recursive
# alternatively, `git submodule init` then `git submodule update`
# the `--recursive` option is only needed if there are nested submodules

# confirm hello.js works
node hello.js
# Output:
# Thank you for using Hello 3.0
# 
#   Hello at 17:10
```

### Other notes

If you're cloning a repository with submodules, you can just use `git clone --recursive`

### Links

* [git-submodule](https://git-scm.com/docs/git-submodule)

## Example 9 - Reflogs

```
# checkout the `ex9` branch
git checkout ex9

# look at the commit history on the `ex9` branch
git log -n 3 --oneline
# Output:
# ab2c867 Some commit to be squashed.
# f84fc0a Remove junk from README
# b2d8067 Replace console.log with output module

# squash the last commit
git reset --soft HEAD~2
git commit -m "Remove junk from README"
# look at the commit history on the `ex9` branch
git log -n 3 --oneline
# Output:
# 1d30f34 Remove junk from README
# b2d8067 Replace console.log with output module
# c2bfdd2 Adds documentation to Hello class

# look at the reflog
git reflog

# checkout the ref prior to the reset command
git checkout -b ex9-wip HEAD@{2}

# look at the commit history on the `ex9-wip` branch
git log -n 3 --oneline
# Output:
# ab2c867 Some commit to be squashed.
# f84fc0a Remove junk from README
# b2d8067 Replace console.log with output module
```

### Other notes

The `git reflog` command is great for other scenarios where you "lose" changes, including deleting branches, resetting commits, etc.

### Links

* [git-reflog](https://git-scm.com/docs/git-reflog)
