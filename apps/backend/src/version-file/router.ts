import type { ProjectVersionData } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { HashAlgorithms } from "~/types";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { versionFileUrl } from "~/utils/urls";
import {
    GetLatestProjectVersionFromHash,
    GetLatestProjectVersionsFromHashes,
    GetVersionFromFileHash,
    GetVersionsFromFileHashes,
} from "./controllers/file";

const versionFileRouter = new Hono();
versionFileRouter.use(invalidAuthAttemptLimiter);
versionFileRouter.use(AuthenticationMiddleware);

versionFileRouter.get("/:fileHash", getReqRateLimiter, (ctx) => versionFromHash_get(ctx, false));
versionFileRouter.get("/:fileHash/download", getReqRateLimiter, (ctx) => versionFromHash_get(ctx, true));
versionFileRouter.post("/:fileHash/update", strictGetReqRateLimiter, versionFromHashUpdate_get);

async function versionFromHash_get(ctx: Context, download = false) {
    try {
        const hash = ctx.req.param("fileHash");
        if (!hash) return invalidReqestResponse(ctx);

        let hashAlgorithm = HashAlgorithms.SHA512;
        if (ctx.req.query("algorithm") === HashAlgorithms.SHA1) {
            hashAlgorithm = HashAlgorithms.SHA1;
        }

        const res = await GetVersionFromFileHash(hash, hashAlgorithm);
        if (download) {
            const version = res.data as ProjectVersionData;
            return ctx.redirect(
                versionFileUrl(version.projectId as string, version.id, version.primaryFile?.name as string) as string,
                HTTP_STATUS.TEMPORARY_REDIRECT,
            );
        }

        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function versionFromHashUpdate_get(ctx: Context) {
    try {
        const hash = ctx.req.param("fileHash");
        if (!hash) return invalidReqestResponse(ctx);

        let body = ctx.get(REQ_BODY_NAMESPACE);
        if (!body) body = {};

        let hashAlgorithm = HashAlgorithms.SHA512;
        if (body?.algorithm === HashAlgorithms.SHA1) {
            hashAlgorithm = HashAlgorithms.SHA1;
        }

        let gameVersions = body?.gameVersions;
        if (!gameVersions || !Array.isArray(gameVersions)) {
            gameVersions = [];
        }
        for (const version of gameVersions) {
            if (typeof version !== "string") return invalidReqestResponse(ctx, "Invalid game version");
        }

        let loader = body?.loader;
        if (!loader || !loader.length || typeof loader !== "string") {
            loader = undefined;
        }

        let releaseChannel = body.releaseChannel;
        if (!releaseChannel || !releaseChannel.length || typeof releaseChannel !== "string") {
            releaseChannel = GetReleaseChannelFilter();
        }

        const res = await GetLatestProjectVersionFromHash(hash, hashAlgorithm, {
            gameVersions: gameVersions,
            loader: loader,
            releaseChannel: releaseChannel,
        });
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

const versionFiles_Router = new Hono();
versionFiles_Router.use(invalidAuthAttemptLimiter);
versionFiles_Router.use(AuthenticationMiddleware);

versionFiles_Router.post("/", strictGetReqRateLimiter, versionFiles_post);
versionFiles_Router.post("/update", strictGetReqRateLimiter, versionUpdatesFromHashes_post);

async function versionFiles_post(ctx: Context) {
    try {
        const body = ctx.get(REQ_BODY_NAMESPACE);
        if (!body) return invalidReqestResponse(ctx, "Input body not provided!");

        const hashes = body?.hashes || [];
        if (!hashes.length) return invalidReqestResponse(ctx, "Empty hash list provided");

        let hashAlgorithm = HashAlgorithms.SHA512;
        if (body?.algorithm === HashAlgorithms.SHA1) {
            hashAlgorithm = HashAlgorithms.SHA1;
        }

        const res = await GetVersionsFromFileHashes(hashes, hashAlgorithm);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function versionUpdatesFromHashes_post(ctx: Context) {
    try {
        const body = ctx.get(REQ_BODY_NAMESPACE);
        if (!body) return invalidReqestResponse(ctx, "Input body not provided!");

        const hashes = body?.hashes || [];
        if (!hashes.length) return invalidReqestResponse(ctx, "Empty hash list provided");

        let hashAlgorithm = HashAlgorithms.SHA512;
        if (body?.algorithm === HashAlgorithms.SHA1) {
            hashAlgorithm = HashAlgorithms.SHA1;
        }

        let gameVersions = body?.gameVersions;
        if (!gameVersions || !Array.isArray(gameVersions)) {
            gameVersions = [];
        }
        for (const version of gameVersions) {
            if (typeof version !== "string") return invalidReqestResponse(ctx, "Invalid game version");
        }

        let loader = body?.loader;
        if (!loader || !loader.length || typeof loader !== "string") {
            loader = undefined;
        }

        let releaseChannel = body.releaseChannel;
        if (!releaseChannel || !releaseChannel.length || typeof releaseChannel !== "string") {
            releaseChannel = GetReleaseChannelFilter();
        }

        const res = await GetLatestProjectVersionsFromHashes(hashes, hashAlgorithm, {
            gameVersions: gameVersions,
            loader: loader,
            releaseChannel: releaseChannel,
        });
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export { versionFileRouter, versionFiles_Router };