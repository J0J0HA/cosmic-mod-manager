import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { RejectedStatuses, ShowEnvSupportSettingsForType } from "@app/utils/config/project";
import { isCurrLinkActive } from "@app/utils/string";
import { EnvironmentSupport, ProjectPublishingStatus } from "@app/utils/types";
import { AsteriskIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, LightbulbIcon, ScaleIcon, SendIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import Link from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import { ProjectPagePath, usePathname } from "~/utils/urls";

export function PublishingChecklist() {
    const ctx = useProjectData();
    const project = ctx.projectData;
    const pathname = usePathname();

    const { t } = useTranslation();
    const pubChecklist = t.project.publishingChecklist;
    const [dropdownOpen, setDropdownOpen] = useState(true);
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    async function submitForReview() {}

    let hideEnvSettingsCard = true;
    for (const type of project.type) {
        if (ShowEnvSupportSettingsForType.includes(type)) {
            hideEnvSettingsCard = false;
            break;
        }
    }

    const RequiredIcon = <AsteriskIcon className="inline w-4 h-4 text-[#cb2245] dark:text-[#ff496e]" />;
    const SuggestionIcon = <LightbulbIcon className="inline w-4 h-4 text-purple-600 dark:text-purple-400" />;
    const SubmitIcon = <ScaleIcon className="inline w-[1.1rem] h-[1.1rem] text-[#e08325] dark:text-[#ffa347]" />;
    const TickIcon = <CheckIcon className="inline w-4 h-4 text-muted-foreground" />;

    function StatusIcon({ status }: { status: string }) {
        let icon = null;
        switch (status) {
            case "required":
                icon = RequiredIcon;
                break;

            case "suggestion":
                icon = SuggestionIcon;
                break;

            case "review":
                icon = SubmitIcon;
                break;
        }

        return icon;
    }

    const steps = [
        {
            condition: ctx.allProjectVersions.length < 1,
            id: "upload-version",
            title: pubChecklist.uploadVersion,
            description: pubChecklist.uploadVersionDesc,
            status: "required",
            link: {
                path: "versions",
                title: pubChecklist.visit.versionsPage,
            },
        },
        {
            condition: !project.description,
            id: "add-description",
            title: pubChecklist.addDescription,
            description: pubChecklist.addDescriptionDesc,
            status: "required",
            link: {
                path: "settings/description",
                title: pubChecklist.visit.descriptionSettings,
            },
        },
        {
            condition: !project.icon,
            id: "add-icon",
            title: pubChecklist.addIcon,
            description: pubChecklist.addIconDesc,
            status: "suggestion",
            link: {
                path: "settings",
                title: pubChecklist.visit.generalSettings,
            },
        },
        {
            condition: project.gallery.length === 0 || !project.gallery.some((g) => g.featured === true),
            id: "feature-gallery-image",
            title: pubChecklist.featureGalleryImg,
            description: pubChecklist.featureGalleryImgDesc,
            status: "suggestion",
            link: {
                path: "gallery",
                title: pubChecklist.visit.galleryPage,
            },
        },
        {
            hide: ctx.allProjectVersions.length === 0,
            condition: project.categories.length < 1,
            id: "select-tags",
            title: pubChecklist.selectTags,
            description: pubChecklist.selectTagsDesc,
            status: "suggestion",
            link: {
                path: "settings/tags",
                title: pubChecklist.visit.tagSettings,
            },
        },
        {
            condition: !(project.issueTrackerUrl || project.projectSourceUrl || project.projectWikiUrl || project.discordInviteUrl),
            id: "add-links",
            title: pubChecklist.addExtLinks,
            description: pubChecklist.addExtLinksDesc,
            status: "suggestion",
            link: {
                path: "settings/links",
                title: pubChecklist.visit.linksSettings,
            },
        },
        {
            hide: hideEnvSettingsCard,
            condition:
                project.clientSide === EnvironmentSupport.UNKNOWN ||
                project.serverSide === EnvironmentSupport.UNKNOWN ||
                (project.clientSide === EnvironmentSupport.UNSUPPORTED && project.serverSide === EnvironmentSupport.UNSUPPORTED),
            id: "select-environments",
            title: pubChecklist.selectEnv,
            description: pubChecklist.selectEnvDesc(t.navbar[project.type[0]]),
            status: "required",
            link: {
                path: "settings",
                title: pubChecklist.visit.generalSettings,
            },
        },
        {
            condition: !project.licenseName && !project.licenseId,
            id: "select-license",
            title: pubChecklist.selectLicense,
            description: pubChecklist.selectLicenseDesc(t.navbar[project.type[0]]),
            status: "required",
            link: {
                path: "settings/license",
                title: pubChecklist.visit.licenseSettings,
            },
        },
        {
            condition: project.status === ProjectPublishingStatus.DRAFT,
            id: "submit-for-review",
            title: pubChecklist.submitForReview,
            description: pubChecklist.submitForReviewDesc,
            status: "review",
            link: null,
            action: {
                onClick: submitForReview,
                title: pubChecklist.submitForReview,
                disabled: readyToSubmit === false,
            },
        },
        {
            hide: project.status === ProjectPublishingStatus.DRAFT,
            condition: RejectedStatuses.includes(project.status),
            id: "resubmit-for-review",
            title: pubChecklist.resubmitForReview,
            description:
                project.status === ProjectPublishingStatus.REJECTED
                    ? pubChecklist.resubmit_ApprovalRejected
                    : pubChecklist.resubmit_ProjectWithheld,
            status: "review",
            link: {
                path: "moderation",
                title: pubChecklist.visit.moderationPage,
            },
        },
    ];

    useEffect(() => {
        // setReadyToSubmit()
    }, [pathname]);

    return (
        <Card>
            <CardHeader className="flex flex-row gap-x-4 items-center justify-between">
                <div className="grow flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                    <CardTitle className="text-muted-foreground/85">{pubChecklist.title}</CardTitle>

                    <div className="flex items-center gap-x-1">
                        <TooltipProvider delayDuration={200}>
                            <span className="font-bold text-muted-foreground/85 mr-2">{pubChecklist.progress}</span>

                            {steps.map((step) => {
                                if (step.hide) return;

                                return (
                                    <TooltipTemplate key={step.id} content={step.title}>
                                        <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-background">
                                            {step.condition === true ? <StatusIcon status={step.status} /> : TickIcon}
                                        </span>
                                    </TooltipTemplate>
                                );
                            })}
                        </TooltipProvider>
                    </div>
                </div>

                <Button variant="secondary" size="icon" onClick={() => setDropdownOpen((prev) => !prev)}>
                    <ChevronDownIcon className={cn("transition-all", dropdownOpen && "rotate-180")} />
                </Button>
            </CardHeader>
            {dropdownOpen && (
                <CardContent className="grid gap-panel-cards grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))]">
                    <TooltipProvider delayDuration={200}>
                        {steps.map((step) => {
                            if (!step.condition || step.hide === true) return;

                            let link = undefined;
                            if (step.link) {
                                const href = ProjectPagePath(project.type[0], project.slug, step.link.path);
                                link = {
                                    label: step.link.title,
                                    hidden: isCurrLinkActive(href, pathname),
                                    href: href,
                                };
                            }

                            return (
                                <ChecklistCard
                                    key={step.id}
                                    icon={<StatusIcon status={step.status} />}
                                    label={step.title}
                                    desc={step.description}
                                    link={link}
                                >
                                    {step.action ? (
                                        <Button
                                            disabled={step.action.disabled}
                                            onClick={step.action.onClick}
                                            className="w-fit bg-[#e08325] dark:bg-[#ffa347]"
                                            size="sm"
                                        >
                                            <SendIcon className="w-iconh-btn-icon h-btn-icon" /> {step.action.title}
                                        </Button>
                                    ) : null}
                                </ChecklistCard>
                            );
                        })}
                    </TooltipProvider>
                </CardContent>
            )}
        </Card>
    );
}

interface ChecklistCardProps {
    icon: ReactNode;
    label: string;
    desc: string;
    link?: {
        hidden: boolean;
        label: string;
        href: string;
    };
    children?: ReactNode;
}

function ChecklistCard(props: ChecklistCardProps) {
    return (
        <div className="p-card-surround rounded-lg bg-background grid grid-cols-1 gap-3 self-stretch grid-rows-[auto_1fr_auto]">
            <span className="flex items-center justify-start gap-1 font-semibold text-muted-foreground">
                {props.icon}
                {props.label}
            </span>
            <span className="text-pretty text-muted-foreground/85">{props.desc}</span>
            {props.children}

            {!props.children && props.link && (
                <Link
                    className={cn("mt-auto w-fit link_blue hover:underline brightness-100", props.link.hidden && "invisible")}
                    to={props.link.href}
                >
                    {props.link.label} <ChevronRightIcon className="inline w-4 h-4" />
                </Link>
            )}
        </div>
    );
}