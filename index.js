const request = require('request-promise');
const _ = require('lodash');

// Input
const RUNNER_TOKEN = process.env.RUNNER_TOKEN;      // Personal Access Token with `read_registry` access
const REPO_HOST = process.env.REPO_HOST;            // Repo URL, i.e. `https://git.example.com`
const CI_PROJECT_URL = process.env.CI_PROJECT_URL;  // Project URL, i.e. `https://git.example.com/my-group/my-project`
const SEARCH_TAG = process.argv[2] || process.env.CI_COMMIT_SHA; // SHA Commit Tag

if (!SEARCH_TAG) {
  console.log('Usage#1: ');
  console.log('$ export RUNNER_TOKEN=<Personal Access Token>');
  console.log('$ export REPO_HOST=<Repo URL>');
  console.log('$ export CI_PROJECT_URL=<Project URL>');
  console.log('$ gitlab-get-docker-image-version <SHA Commit Tag>');
  console.log('Usage#2: ');
  console.log('$ export RUNNER_TOKEN=<Personal Access Token>');
  console.log('$ export REPO_HOST=<Repo URL>');
  console.log('$ export CI_PROJECT_URL=<Project URL>');
  console.log('$ export CI_COMMIT_SHA=<SHA Commit Tag>');
  console.log('$ gitlab-get-docker-image-version');
  process.exit(1);
}

const registryInfoOpts = {
  method: 'GET',
  url: `${CI_PROJECT_URL}/container_registry.json`,
  headers: {
    'Private-Token': RUNNER_TOKEN,
  },
  qs: {
    format: 'json',
  },
  json: true,
  resolveWithFullResponse: true,
};

const extractRepoUrl = (res) => res.body[0].tags_path;
const getRepoInfo = (repoUrl, page = 1) => request({
  method: 'GET',
  url: `${REPO_HOST}${repoUrl}`,
  headers: {
    'Private-Token': RUNNER_TOKEN,
  },
  qs: {
    page: page,
  },
  json: true,
  resolveWithFullResponse: true,
});
const getConcatRepoInfos = (repoInfo) => {
  const repoUrl = repoInfo.request.url.pathname;
  const totalPages = repoInfo.headers['x-total-pages'];
  let data = repoInfo.body;

  const promises = [];
  
  for (let i = 2; i <= totalPages; i++) {
    promises.push(getRepoInfo(repoUrl, i));
  }

  return Promise.all(promises).then(repoInfos => {
    repoInfos.forEach(ri => {
      data = _.concat(data, ri.body);
    });
    return data;
  });
};
const searchTag = (repoInfo) => {
  const srcIdx = _.findIndex(repoInfo, (item) => item.name === SEARCH_TAG);
  const revision = repoInfo[srcIdx].revision;
  const tgtIdx = _.findIndex(repoInfo, (item) => {
    return item.revision === revision && item.name.match(/^[0-9]+.[0-9]+.[0-9]+/)
  });
  return repoInfo[tgtIdx].name;
};

request(registryInfoOpts)
  .then(extractRepoUrl)
  .then(getRepoInfo)
  .then(getConcatRepoInfos)
  .then(searchTag)
  .then(console.log);