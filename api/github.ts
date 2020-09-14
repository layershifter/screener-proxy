import { request } from "@octokit/request";
import { NowApiHandler } from "@vercel/node";

import { CHECK_NAME, OWNER, REPO } from "../config";
import { getInstallationToken, pino } from "../util";

const github: NowApiHandler = async (req, res) => {
  const accessToken = await getInstallationToken();
  const body = req.body;

  const shouldProceed =
    body.action === "opened" ||
    body.action === "reopened" ||
    body.action === "synchronize";

  if (shouldProceed) {
    const commitSHA = body.pull_request.head.sha;

    pino.info({ body });

    await request("POST /repos/:owner/:repo/check-runs", {
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
