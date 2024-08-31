import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { addToDownloadsQueue } from "@/services/queues/downloads-increment";
import { getFileFromStorage, getProjectStoragePath } from "@/services/storage";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import type { Context } from "hono";
import { type ContextUserSession, FILE_STORAGE_SERVICES } from "../../../types";
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
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.status(httpCode("not_found"));
    }

    if (
        !isProjectAccessibleToCurrSession(projectData.visibility, projectData.status, userSession?.id, [
            ...projectData.team.members,
            ...(projectData.organisation?.team?.members || []),
        ])
    ) {
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
        return ctx.json({}, httpCode("not_found"));
    }

    const file = await getFileFromStorage(versionFile.storageService, versionFile.url);

    if (!file) return ctx.text("File not found", httpCode("not_found"));

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

    return new Response(file, { status: httpCode("ok") });
};

export const serveProjectIconFile = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
    });

    if (!project?.icon) return ctx.json({}, httpCode("not_found"));

    const iconFile = await getFileFromStorage(FILE_STORAGE_SERVICES.LOCAL, `${getProjectStoragePath(project.id)}/${project.icon}`);
    if (!iconFile) return ctx.json({}, httpCode("not_found"));

    return new Response(iconFile);
};

export const serveProjectGalleryImage = async (ctx: Context, slug: string, image: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            gallery: {
                where: {
                    image: image,
                },
            },
        },
    });

    if (!project?.gallery?.[0]?.id) return ctx.json({}, httpCode("not_found"));

    const imageFile = await getFileFromStorage(
        FILE_STORAGE_SERVICES.LOCAL,
        `${getProjectStoragePath(project.id)}/gallery/${project.gallery[0].image}`,
    );
    if (!imageFile) return ctx.json({}, httpCode("not_found"));

    return new Response(imageFile);
};
