import { z } from "zod";
import { orgSlugField } from "..";
import { MAX_ORGANISATION_DESCRIPTION_LENGTH, MAX_ORGANISATION_NAME_LENGTH } from "../../../config/forms";
import { iconFieldSchema } from "../../project/settings/general";

export const orgSettingsFormSchema = z.object({
    icon: iconFieldSchema.or(z.string()).optional(),
    name: z.string().min(2).max(MAX_ORGANISATION_NAME_LENGTH),
    slug: orgSlugField,
    description: z.string().min(1).max(MAX_ORGANISATION_DESCRIPTION_LENGTH),
});