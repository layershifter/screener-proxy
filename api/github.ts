import { App } from "@octokit/app";
import { request } from "@octokit/request";
import { NowApiHandler } from "@vercel/node";

import { CHECK_NAME, OWNER, REPO } from "../config";
import { getInstallationToken } from "../util";

const github: NowApiHandler = async (req, res) => {
  const accessToken = await getInstallationToken();
  const shouldProceed =
    req.body.action === "opened" || req.body.action === "synchronize";

  if (shouldProceed) {
    const commitSHA = req.body.pull_request.head.sha;

    await request("POST /repos/{owner}/{repo}/check-runs", {
      owner: OWNER,
      repo: REPO,
      name: CHECK_NAME,
      head_sha: commitSHA,
      headers: {
        authorization: `token ${accessToken}`,
      },
      mediaType: {
        previews: ["antiope", "machine-man"],
      },
    });
  }

  res.end();
};

export default github;
