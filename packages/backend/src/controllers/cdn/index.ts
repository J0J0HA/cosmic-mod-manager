import type { ContextUserSession, FILE_STORAGE_SERVICE } from "@/../types";
import { addToUsedApiRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { addToDownloadsQueue } from "@/services/queues/downloads-queue";
import { getFile } from "@/services/storage";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import type { Context } from "hono";
import { getUserIpAddress } from "../auth/commons";

export const serveVersionFile = async (
    ctx: Context,
    projectSlug: string,
    versionSlug: string,
    fileName: string,
    userSession: ContextUserSession | undefined,
) => {
    const projectData = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            visibility: true,
            status: true,
            versions: {
                where: {
                    slug: versionSlug,
                },
                select: {
                    id: true,
                    files: true,
                },
            },
            team: {
                select: {
                    members: {
                        select: {
                            userId: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: true,
                        },
                    },
                },
            },
        },
    });

    const targetVersion = projectData?.versions?.[0];
    if (!projectData?.id || !targetVersion?.files?.[0]?.fileId) {
        await addToUsedApiRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.status(httpCode("not_found"));
    }

    if (!isProjectAccessibleToCurrSession(projectData.visibility, projectData.status, userSession?.id, projectData.team.members)) {
        return ctx.json({}, httpCode("not_found"));
    }

    const versionFile = await prisma.file.findFirst({
        where: {
            id: {
                in: targetVersion.files.map((file) => file.fileId),
            },
            name: fileName,
        },
    });

    if (!versionFile?.id) {
        return ctx.json({ message: "File not found" }, httpCode("not_found"));
    }

    const file = await getFile(versionFile.storageService as FILE_STORAGE_SERVICE, versionFile.url);
    if (!file) return ctx.json({ message: "File not found" }, httpCode("not_found"));

    // Get corresponding file from version
    const targetVersionFile = targetVersion.files.find((file) => file.fileId === versionFile.id);

    if (targetVersionFile?.isPrimary === true) {
        // add download count
        await addToDownloadsQueue({
            ipAddress: getUserIpAddress(ctx) || "",
            userId: userSession?.id || ctx.get("guest-session"),
            projectId: projectData.id,
            versionId: targetVersion.id,
        });
    }

    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file, { status: httpCode("ok") });
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    response.headers.set("Content-Type", file.type);
    return response;
};

export const serveProjectIconFile = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
    });
    if (!project?.iconFileId) return ctx.json({}, httpCode("not_found"));

    const iconFileData = await prisma.file.findUnique({
        where: {
            id: project.iconFileId,
        },
    });
    if (!iconFileData?.id) return ctx.json({}, httpCode("not_found"));

    const iconFile = await getFile(iconFileData.storageService as FILE_STORAGE_SERVICE, iconFileData.url);

    // Respond accordingly
    if (typeof iconFile === "string") return ctx.redirect(iconFile);
    const response = new Response(iconFile);
    response.headers.set("Cache-Control", "public, max-age=360");
    return response;
};

export const serveProjectGalleryImage = async (ctx: Context, slug: string, image: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            gallery: true,
        },
    });
    if (!project?.gallery?.[0]?.id) return ctx.json({}, httpCode("not_found"));

    const dbFile = await prisma.file.findFirst({
        where: {
            id: {
                in: project.gallery.map((galleryItem) => galleryItem.imageFileId),
            },
            name: image,
        },
    });

    if (!dbFile) return ctx.json({}, httpCode("not_found"));

    const imageFile = await getFile(dbFile.storageService as FILE_STORAGE_SERVICE, dbFile.name);
    if (!imageFile) return ctx.json({}, httpCode("not_found"));

    if (typeof imageFile === "string") return ctx.redirect(imageFile);

    const response = new Response(imageFile);
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable"); // 1 year
    return response;
};
