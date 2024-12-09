import Config from "@root/utils/config";
import { serverFetch } from "@root/utils/server-fetch";
import type { Route } from "./+types/sitemap";

export async function loader(props: Route.LoaderArgs) {
    const sitemapName = props.params.sitemap;
    const res = await serverFetch(props.request, `${Config.BACKEND_URL}/cdn/sitemap/${sitemapName}.xml`);

    if (!res.ok) return new Response("File not found", { status: res.status });

    return new Response(await res.blob(), {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    });
}