<h1 align="center">
  unrepo
</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/unrepo"><img src="https://badgen.net/npm/v/unrepo" alt="npm"></a>
  <a href="https://unpkg.com/unrepo/dist/index.js"><img src="https://badgen.net/badgesize/gzip/https://unpkg.com/unrepo/dist/index.js" alt="gzip size"></a>
  <a href="https://unpkg.com/unrepo/dist/index.js"><img src="https://badgen.net/badgesize/brotli/https://unpkg.com/unrepo/dist/index.js" alt="brotli size"></a>
  <a href="https://packagephobia.now.sh/result?p=unrepo"><img src="https://badgen.net/packagephobia/install/unrepo" alt="install size"></a>
</p>

`unrepo` is a template repository scaffolding tool that creates copies of git repositories **with support for private repos**. It taps into the compressed tarball of a repository to quickly pull down a copy without all that extra git cruft.

A fork of [rdmurphy/create-clone](https://github.com/rdmurphy/create-clone)

## Key features

- 🎏 Supports GitHub repos, GitHub gists, GitLab and Bitbucket
- 💡 Understands GitHub shorthand (`user/my-cool-template`) for referring to repositories
- 🔐 With proper credentials in place **can clone private repositories on GitHub, GitLab and Bitbucket**

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Usage](#usage)
  - [GitHub](#github)
  - [GitLab](#gitlab)
  - [Bitbucket](#bitbucket)
  - [Gist](#gist)
- [Private repos](#private-repos)
  - [GitHub](#github-1)
  - [GitLab](#gitlab-1)
  - [Bitbucket](#bitbucket-1)
- [What makes this different from `degit`?](#what-makes-this-different-from-degit)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

`unrepo` requires at least Node 10 to run.

This library expects to be used in a global context and makes the most sense when installed globally.

```sh
npm install --global unrepo
# or
yarn global add unrepo
```

This also means it works great when paired with `npx`.

```sh
npx unrepo <repository> <dest>
```

**However!** `unrepo`'s unique name gives it another super power &mdash; you can use a special feature of `npm init` and `yarn create`.

```sh
npm init clone <repository> <dest>
# or
yarn create clone <repository> <dest>
```

This is most of the reason this library exists. 😶

## Usage

`unrepo` works any git host URLs that [`hosted-git-info`](https://github.com/npm/hosted-git-info) supports. By default the copy of the repository is output into your **current working directory**. A path to a different directory can be provided as the second parameter and will be created if necessary.

```sh
# The contents of the repository will be copied into the current directory
unrepo user/repository

# The contents of the repository will be copied into provided directory (and created if necessary)
unrepo user/repository my-new-project
```

By default `unrepo` will stop and not touch a target directory that already contains files, but this can be overriden with `--force`.

```sh
# I already have something in the "my-old-project" directory, but I don't care
unrepo user/repository my-old-project --force
```

### GitHub

```sh
# shortcuts only available to GitHub
unrepo user/repository
unrepo user/repository#branch

unrepo github:user/repository
unrepo github:user/repository.git
unrepo github:user/repository#branch
unrepo github:user/repository.git#branch

# github.com and www.github.com are both supported
unrepo https://github.com/user/repository
unrepo https://github.com/user/repository.git
unrepo https://github.com/user/repository#branch
unrepo https://github.com/user/repository.git#branch
unrepo git@github.com:user/repository
unrepo git@github.com:user/repository.git
unrepo git@github.com:user/repository#branch
unrepo git@github.com:user/repository.git#branch
```

### GitLab

```sh
unrepo gitlab:user/repository
unrepo gitlab:user/repository.git
unrepo gitlab:user/repository#branch
unrepo gitlab:user/repository.git#branch

# gitlab.com and www.gitlab.com are both supported
unrepo https://gitlab.com/user/repository
unrepo https://gitlab.com/user/repository.git
unrepo https://gitlab.com/user/repository#branch
unrepo https://gitlab.com/user/repository.git#branch
unrepo git@gitlab.com:user/repository
unrepo git@gitlab.com:user/repository.git
unrepo git@gitlab.com:user/repository#branch
unrepo git@gitlab.com:user/repository.git#branch
```

### Bitbucket

```sh
unrepo bitbucket:user/repository
unrepo bitbucket:user/repository.git
unrepo bitbucket:user/repository#branch
unrepo bitbucket:user/repository.git#branch

# bitbucket.org and www.bitbucket.org are both supported
unrepo https://bitbucket.org/user/repository
unrepo https://bitbucket.org/user/repository.git
unrepo https://bitbucket.org/user/repository#branch
unrepo https://bitbucket.org/user/repository.git#branch
unrepo git@bitbucket.org:user/repository
unrepo git@bitbucket.org:user/repository.git
unrepo git@bitbucket.org:user/repository#branch
unrepo git@bitbucket.org:user/repository.git#branch
```

### Gist

```sh
unrepo gist:user/hash
unrepo gist:user/hash.git
unrepo gist:user/hash#branch
unrepo gist:user/hash.git#branch

unrepo git@gist.github.com:hash.git
unrepo git+https://gist.github.com:hash.git
unrepo git+https://gist.github.com:hash.git
unrepo https://gist.github.com/user/hash
unrepo https://gist.github.com/user/hash.git
unrepo https://gist.github.com/user/hash#branch
unrepo https://gist.github.com/user/hash.git#branch
unrepo git@gist.github.com:user/hash
unrepo git@gist.github.com:user/hash.git
unrepo git@gist.github.com:user/hash#branch
unrepo git@gist.github.com:user/hash.git#branch
```

## Private repos

GitHub, GitLab and Bitbucket all have varying methods for authenticating against their services, so each one needs slightly different permissions and keys.

> Fun fact &mdash; Private GitHub gists are already supported without any additional authentication because they're only "private" as long as no one else has the URL. [This is a documented feature](https://help.github.com/en/articles/creating-gists#about-gists)!

### GitHub

`unrepo` requires a [GitHub personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with read access for repositories and/or gists. Once you have this token, it needs to be available in your environment at `GITHUB_TOKEN`.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export GITHUB_TOKEN=<personal-access-token>
```

`unrepo` will check for this environment variable when attempting to clone a GitHub repository or gist and [include it as an authorization header](https://developer.github.com/v3/#authentication) in the request. `unrepo` will be able to clone any private GitHub repo your account can access.

### GitLab

GitLab also has [personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), but because access to the archive of a private repository is only available [via the GitLab API](https://docs.gitlab.com/ee/api/repositories.html#get-file-archive), your token needs to be [given the scope of `api` access](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#limiting-scopes-of-a-personal-access-token), _not_ `read_repository`. Once you have this token, it needs to be available in your environment at `GITLAB_TOKEN`.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export GITLAB_TOKEN=<personal-access-token>
```

`unrepo` will check for this environment variable when attempting to clone a GitLab repository and [include it as an authorization header](https://docs.gitlab.com/ee/api/README.html#personal-access-tokens) in the request. `unrepo` will be able to clone any private GitLab repo your account can access.

### Bitbucket

This is the funky one. Bitbucket does not have the equivalent of a personal access token, so we need to use what it calls an [app password](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html). The _only_ permission your app password needs is `Repositories -> Read`. However, because we are using what's essentially a single-purpose password, we also need to include your Bitbucket username as part of the request. To accomplish this, we need to set up **two** environmental variables: `BITBUCKET_USER` for your username, and `BITBUCKET_TOKEN` for your app password.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export BITBUCKET_USER=<your-bitbucket-username>
export BITBUCKET_TOKEN=<app-password>
```

`unrepo` will check for this environment variable when attempting to clone a Bitbucket repository and include it as the [user and password](https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication#app-pw) of the request. `unrepo` will be able to clone any private Bitbucket repo your account can access.

## What makes this different from [`degit`](https://github.com/Rich-Harris/degit)?

Honestly? Not a whole lot. This was mostly me wanting to be able to do something cool like `npm init clone <repo>`/`yarn create clone <repo>`.

The most notable difference is `unrepo` **does not** have a caching layer like `degit` does. In practice I've not found that to be a major issue, but it may be a big deal for some folks! `degit` also has a [cool actions framework layered on top](https://github.com/Rich-Harris/degit#actions).

## License

MIT
