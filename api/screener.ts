import { request } from "@octokit/request";
import { NowApiHandler } from "@vercel/node";

import { APP_ID, CHECK_NAME, OWNER, REPO } from "../config";
import { getInstallationToken } from "../util";

type ScreenerRequestBody = {
  id: string;
  project: string;
  environment: string;
  build: string;
  status: "error" | "failure" | "success";
  url: string;
  description: string;
  repo: string;
  commit: string;
};

const screener: NowApiHandler = async (req, res) => {
  const accessToken = await getInstallationToken();
  const body: ScreenerRequestBody = req.body;

  const checkForCommit = await request(
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    {
      owner: OWNER,
      repo: REPO,
      ref: body.commit,
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
    conclusion: body.status === "success" ? "success" : "failure",
    details_url: body.url,
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
