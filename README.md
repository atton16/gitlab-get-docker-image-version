# gitlab-get-docker-image-version

Get version tag of docker image from provided commit tag. It is designed to be used with gitlab runner for determining docker image version in deploy stage.

## Usage

```bash
export RUNNER_TOKEN=<Personal Access Token>
export REPO_HOST=<Repo URL>
export CI_PROJECT_URL=<Project URL>
$ gitlab-get-docker-image-version <SHA Commit Tag>
```

or

```bash
export RUNNER_TOKEN=<Personal Access Token>
export REPO_HOST=<Repo URL>
export CI_PROJECT_URL=<Project URL>
export CI_COMMIT_SHA=<SHA Commit Tag>
$ gitlab-get-docker-image-version
```

## Environment variables

| Env Name       | Description                                                     | Required |
|----------------|-----------------------------------------------------------------|----------|
| RUNNER_TOKEN   | Personal Access Token with `read_registry` access               | Required |
| REPO_HOST      | Repo URL, i.e. `https://git.example.com`                        | Required |
| CI_PROJECT_URL | Project URL, i.e. `https://git.example.com/my-group/my-project` | Required |
| CI_COMMIT_SHA  | SHA Commit Tag                                                  | Optional |

## Example

Assumptions

1. Registry: `docker.example.com`
2. Image name: `my-group/my-project`
3. Available tags

   | Tag name          | Tag ID |
   |-------------------|--------|
   | 1.0.0             | aaaaaa |
   | some-sha-commit-a | aaaaaa |
   | 1.0.1             | bbbbbb |
   | some-sha-commit-b | bbbbbb |
   | latest            | bbbbbb |

```bash
export RUNNER_TOKEN=1234
export REPO_HOST=https://git.example.com
export CI_PROJECT_URL=https://git.example.com/my-group/my-project
export CI_COMMIT_SHA=some-sha-commit-a
$ gitlab-get-docker-image-version
1.0.0
$ gitlab-get-docker-image-version some-sha-commit-b
1.0.1
```

## MIT License

Copyright 2018 Attawit Kittikrairit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
