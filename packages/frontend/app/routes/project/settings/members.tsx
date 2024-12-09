import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { Organisation } from "@shared/types/api";
import { useLoaderData } from "react-router";
import ProjectMemberSettingsPage from "~/pages/project/settings/members/page";
import type { Route } from "./+types/members";

export default function _MemberSettings() {
    const orgs = useLoaderData() as Organisation[];

    return <ProjectMemberSettingsPage userOrgs={orgs} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Organisation[]> {
    const orgsRes = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(orgsRes);

    return orgs || [];
}
