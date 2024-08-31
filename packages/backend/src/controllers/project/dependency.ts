import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { inferProjectType, isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { projectIconUrl } from "@/utils/urls";
import type { Dependency } from "@prisma/client";
import type { ProjectPermissions } from "@shared/types";
import type { Context } from "hono";

export const getProjectDependencies = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            visibility: true,
            status: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession?.id || "" },
                        select: {
                            id: true,
                            userId: true,
                            permissions: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: { userId: userSession?.id || "" },
                                select: {
                                    id: true,
                                    userId: true,
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
            versions: {
                select: {
                    id: true,
                    dependencies: true,
                },
            },
        },
    });

    if (!project) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // CHECK PERMISSIONS
    const members = (project.team.members || []).map((member) => ({
        id: member.id,
        userId: member.userId,
        permissions: member.permissions as ProjectPermissions[],
    }));

    if (project?.organisation?.team?.members) {
        for (const member of project.organisation.team.members) {
            members.push({
                id: member.id,
                userId: member.userId,
                permissions: member.permissions as ProjectPermissions[],
            });
        }
    }

    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, members)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // Aggregate all dependencies
    const dependencies: Dependency[] = [];
    for (const version of project.versions) {
        if (version.dependencies) {
            for (const dependency of version.dependencies) {
                dependencies.push(dependency);
            }
        }
    }

    // Separate dependencies into project-level and version-level
    const projectDependencies: string[] = [];
    const versionDependencies: string[] = [];

    for (const dependency of dependencies) {
        projectDependencies.push(dependency.projectId);

        if (dependency.versionId) {
            versionDependencies.push(dependency.versionId);
        }
    }

    const dependencyProjects = await prisma.project.findMany({
        where: {
            id: {
                in: projectDependencies,
            },
        },
    });

    const dependencyVersions = await prisma.version.findMany({
        where: {
            id: {
                in: versionDependencies,
            },
        },
    });

    return ctx.json(
        {
            projects: dependencyProjects.map((project) => ({
                ...project,
                icon: projectIconUrl(project.slug, project.icon || ""),
                type: inferProjectType(project.loaders),
            })),
            versions: dependencyVersions,
        },
        httpCode("ok"),
    );
};
