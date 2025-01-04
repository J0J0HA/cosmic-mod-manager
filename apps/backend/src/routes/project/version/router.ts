import { newVersionFormSchema, updateVersionFormSchema } from "@app/utils/schemas/project/version";
import { parseValueToSchema } from "@app/utils/schemas/utils";
import type { ProjectVersionData } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import { LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { critModifyReqRateLimiter, modifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "~/routes/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, notFoundResponse, serverErrorResponse } from "~/utils/http";
import { getAllProjectVersions, getLatestVersion, getProjectVersionData } from "./controllers";
import { createNewVersion } from "./controllers/new-version";
import { deleteProjectVersion, updateVersionData } from "./controllers/update";

const versionRouter = new Hono();

versionRouter.get("/", getReqRateLimiter, versions_get);

// latest is a special version id, it accepts optional query params: releaseChannel, gameVersion and loader
// It returns the latest version which matches all the provided filters
// eg: /version/latest?releaseChannel=release&gameVersion=0.3.1&loader=quilt
// Can be helpful to simplify the implementation of auto updating mods
versionRouter.get("/:versionId", getReqRateLimiter, async (ctx) => version_get(ctx));
versionRouter.get("/:versionId/primary-file", getReqRateLimiter, async (ctx) => version_get(ctx, true));
versionRouter.get("/:versionId/:fileName", getReqRateLimiter, async (ctx) => version_get(ctx, true));

versionRouter.post("/", critModifyReqRateLimiter, LoginProtectedRoute, version_post);
versionRouter.patch("/:versionId", modifyReqRateLimiter, LoginProtectedRoute, version_patch);
versionRouter.delete("/:versionId", critModifyReqRateLimiter, LoginProtectedRoute, version_delete);

async function versions_get(ctx: Context) {
    try {
        const projectSlug = ctx.req.param("projectSlug");
        if (!projectSlug) return invalidReqestResponse(ctx);
        const userSession = getUserFromCtx(ctx);
        const featuredOnly = ctx.req.query("featured") === "true";

        const res = await getAllProjectVersions(projectSlug, userSession, featuredOnly);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function version_get(ctx: Context, download = false) {
    try {
        const projectSlug = ctx.req.param("projectSlug");
        if (!projectSlug) return invalidReqestResponse(ctx);
        let versionId = ctx.req.param("versionId");
        if (!versionId?.length) versionId = "latest";

        const userSession = getUserFromCtx(ctx);
        const releaseChannel = ctx.req.query("releaseChannel");
        const gameVersion = ctx.req.query("gameVersion");
        const loader = ctx.req.query("loader");

        const res =
            versionId === "latest"
                ? await getLatestVersion(projectSlug, userSession, {
                      releaseChannel: releaseChannel,
                      gameVersion: gameVersion,
                      loader: loader,
                  })
                : await getProjectVersionData(projectSlug, versionId, userSession);

        if (download !== true) return ctx.json(res.data, res.status);

        const fileName = ctx.req.param("fileName");
        // @ts-ignore
        const version = res.data.data as ProjectVersionData;

        // If the fileName was specified redirect to that file
        if (fileName?.length) {
            const file = version.files.find((f) => f.name === fileName || f.id === fileName);
            if (!file?.id) return notFoundResponse(ctx, "File not found!");
            return ctx.redirect(file.url);
        }
        // Redirect to the primary file by default
        if (version.primaryFile) return ctx.redirect(version.primaryFile.url);

        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function version_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const projectSlug = ctx.req.param("projectSlug");
        if (!userSession || !projectSlug) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        if (!formData) {
            return ctx.json({ success: false, message: "No form data found" }, HTTP_STATUS.BAD_REQUEST);
        }

        const dependencies = formData.get("dependencies");
        const loaders = formData.get("loaders");
        const gameVersions = formData.get("gameVersions");

        const schemaObj = {
            title: formData.get("title"),
            changelog: formData.get("changelog"),
            featured: formData.get("featured") === "true",
            releaseChannel: formData.get("releaseChannel"),
            versionNumber: formData.get("versionNumber"),
            loaders: JSON.parse(loaders ? loaders.toString() : "[]"),
            gameVersions: JSON.parse(gameVersions ? gameVersions.toString() : "[]"),
            dependencies: JSON.parse(dependencies ? dependencies.toString() : "[]"),
            primaryFile: formData.get("primaryFile"),
            additionalFiles: (formData.getAll("additionalFiles") || []).filter((file: unknown) => {
                if (file instanceof File) return file;
            }),
        };

        const { data, error } = await parseValueToSchema(newVersionFormSchema, schemaObj);
        if (error || !data) {
            // @ts-ignore
            const name = error?.issues?.[0]?.path?.[0];
            // @ts-ignore
            const errMsg = error?.issues?.[0]?.message;
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, HTTP_STATUS.BAD_REQUEST);
        }

        const res = await createNewVersion(ctx, userSession, projectSlug, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

async function version_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionId } = ctx.req.param();
        if (!userSession || !projectSlug || !versionId) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const dependencies = formData.get("dependencies");
        const loaders = formData.get("loaders");
        const gameVersions = formData.get("gameVersions");
        const additionalFiles = formData.getAll("additionalFiles").map((file: File | string) => {
            if (file instanceof File) return file;
            return JSON.parse(file);
        });

        const schemaObj = {
            title: formData.get("title"),
            changelog: formData.get("changelog"),
            featured: formData.get("featured") === "true",
            releaseChannel: formData.get("releaseChannel"),
            versionNumber: formData.get("versionNumber"),
            dependencies: dependencies ? JSON.parse(dependencies) : [],
            loaders: loaders ? JSON.parse(loaders) : [],
            gameVersions: gameVersions ? JSON.parse(gameVersions) : [],
            additionalFiles: additionalFiles,
        };

        const { data, error } = await parseValueToSchema(updateVersionFormSchema, schemaObj);
        if (error || !data) {
            // @ts-ignore
            const name = error?.issues?.[0]?.path?.[0];
            // @ts-ignore
            const errMsg = error?.issues?.[0]?.message;
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, HTTP_STATUS.BAD_REQUEST);
        }

        const res = await updateVersionData(ctx, projectSlug, versionId, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

async function version_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionId } = ctx.req.param();
        if (!userSession || !projectSlug || !versionId) return invalidReqestResponse(ctx);

        const res = await deleteProjectVersion(ctx, projectSlug, versionId, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

export default versionRouter;