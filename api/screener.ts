import { request } from "@octokit/request";
import { NowApiHandler } from "@vercel/node";

import { APP_ID, CHECK_NAME, OWNER, REPO } from "../config";
import { getInstallationToken } from "../util";

const screener: NowApiHandler = async (req, res) => {
  const accessToken = await getInstallationToken();

  const checkForCommit = await request(
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    {
      owner: OWNER,
      repo: REPO,
      ref: req.body.commit,
      headers: {
        authorization: `token ${accessToken}`,
      },
      mediaType: {
        previews: ["antiope", "machine-man"],
      },
    }
  );
  const screenerCheck = checkForCommit.data.check_runs.find(
    (checkRun: any) => checkRun.app.id === APP_ID
  );

  await request("PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
    owner: OWNER,
    repo: REPO,
    check_run_id: screenerCheck.id,
    conclusion: req.body.status === "success" ? "success" : "failure",
    details_url: req.body.url,
    name: CHECK_NAME,
    headers: {
      authorization: `token ${accessToken}`,
    },
    mediaType: {
      previews: ["antiope", "machine-man"],
    },
  });

  res.end();
};

export default screener;
