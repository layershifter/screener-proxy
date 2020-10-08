import { request } from "@octokit/request";
import { NowApiHandler } from "@vercel/node";

import { CHECK_NAME, OWNER, REPO } from "../config";
import { getInstallationToken, pino } from "../util";

type GithubRequestBody = {
  action: string;
  pull_request?: {
    base: {
      label: string;
      ref: string;
    };
    head: {
      sha: string;
    };
    number: number;
    title: string;
  };
};

const ALLOWED_BASES: string[] = ["master"];

const github: NowApiHandler = async (req, res) => {
  const accessToken = await getInstallationToken();
  const body: GithubRequestBody = req.body;

  const commitSHA = body.pull_request?.head.sha;
  const targetBranch = body.pull_request?.base.ref;

  const shouldProceedByActionType =
    body.action === "opened" ||
    body.action === "reopened" ||
    body.action === "synchronize";
  const shouldProceedByTargetBranch =
    targetBranch && ALLOWED_BASES.includes(targetBranch);

  if (shouldProceedByActionType && shouldProceedByTargetBranch) {
    pino.info({ body });

    await request("POST /repos/:owner/:repo/check-runs", {
      owner: OWNER,
      repo: REPO,
      name: CHECK_NAME,
      head_sha: commitSHA as string,
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
