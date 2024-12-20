import type { GlobalUserRole } from "@app/utils/types";
import type { UserProfileData } from "@app/utils/types/api/user";
import prisma from "~/services/prisma";
import type { RouteHandlerResponse } from "~/types/http";
import { HTTP_STATUS } from "~/utils/http";
import { userIconUrl } from "~/utils/urls";

export async function getManyUsers(ids: string[]): Promise<RouteHandlerResponse> {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    const usersList: UserProfileData[] = [];
    for (const user of users) {
        usersList.push({
            id: user.id,
            name: user.name,
            userName: user.userName,
            dateJoined: user.dateJoined,
            role: user.role as GlobalUserRole,
            bio: user.bio,
            avatar: userIconUrl(user.id, user.avatar),
        });
    }

    return { data: usersList, status: HTTP_STATUS.OK };
}