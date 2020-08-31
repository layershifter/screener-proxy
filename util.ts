import { App } from "@octokit/app";
import { request } from "@octokit/request";

import { APP_ID, OWNER, PRIVATE_KEY, REPO } from "./config";

export async function getInstallationToken(): Promise<string> {
  const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
  const jwt = app.getSignedJsonWebToken();

  const { data } = await request("GET /repos/:owner/:repo/installation", {
    owner: OWNER,
    repo: REPO,
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    mediaType: {
      previews: ["machine-man"],
    },
  });

  return await app.getInstallationAccessToken({
    installationId: data.id,
  });
}
