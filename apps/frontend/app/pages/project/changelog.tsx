import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { Button, buttonVariants } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { ChipButton } from "@app/components/ui/chip";
import { CommandSeparator } from "@app/components/ui/command";
import { MultiSelect } from "@app/components/ui/multi-select";
import { releaseChannelTextColor } from "@app/components/ui/release-channel-pill";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { getGameVersionsFromValues, isExperimentalGameVersion } from "@app/utils/src/constants/game-versions";
import { getLoaderFromString } from "@app/utils/convertors";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { ChevronDownIcon, DownloadIcon, FilterIcon, FlaskConicalIcon, XCircleIcon } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import MarkdownRenderBox from "~/components/md-renderer";
import Link from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import useTheme from "~/hooks/theme";
import { useTranslation } from "~/locales/provider";
import { UserProfilePath, VersionPagePath } from "~/utils/urls";
import { FormatDate_ToLocaleString } from "@app/utils/date";
import { formatLocaleCode } from "~/locales";
import { VersionAuthor_Header } from "~/locales/shared-enums";

export default function VersionChangelogs() {
    const ctx = useProjectData();

    if (!ctx.projectData || !ctx.allProjectVersions?.length) return null;
    return <ChangelogsList projectType={ctx.projectType} projectData={ctx.projectData} versionsList={ctx.allProjectVersions} />;
}

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

interface ListProps {
    projectData: ProjectDetailsData;
    versionsList: ProjectVersionData[];
    projectType: string;
}

function ChangelogsList({ projectType, projectData, versionsList }: ListProps) {
    const { t, locale } = useTranslation();
    const { theme } = useTheme();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const ITEMS_PER_PAGE = 15;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((versionsList?.length || 0) / ITEMS_PER_PAGE);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;

    const [filters, setFilters] = useState<FilterItems>({ loaders: [], gameVersions: [], releaseChannels: [] });
    const [showAllVersions, setShowAllVersions] = useState(false);

    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const versionsDisplayList = useMemo(() => {
        const filteredItems: ProjectVersionData[] = [];

        for (const version of versionsList) {
            if (filters.loaders.length) {
                let loaderMatch = false;
                for (const loaderFilter of filters.loaders) {
                    if (version.loaders.includes(loaderFilter)) {
                        loaderMatch = true;
                        break;
                    }
                }

                if (!loaderMatch) continue;
            }

            if (filters.gameVersions.length) {
                let versionMatch = false;
                for (const versionFilter of filters.gameVersions) {
                    if (version.gameVersions.includes(versionFilter)) {
                        versionMatch = true;
                        break;
                    }
                }

                if (!versionMatch) continue;
            }

            if (filters.releaseChannels.length) {
                if (!filters.releaseChannels.includes(version.releaseChannel)) continue;
            }

            filteredItems.push(version);
        }

        return filteredItems;
    }, [activePage, filters, versionsList]);

    const Pagination =
        (versionsDisplayList.length || 0) > ITEMS_PER_PAGE ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    const visibleVersionItems = versionsDisplayList.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

    const availableReleaseChannels: string[] = [];
    for (const version of versionsList) {
        if (!availableReleaseChannels.includes(version.releaseChannel)) {
            availableReleaseChannels.push(version.releaseChannel);
        }
    }

    function resetFilters() {
        setFilters({ loaders: [], gameVersions: [], releaseChannels: [] });
    }

    const loadersFilterVisible = projectData.loaders.length > 1;
    const gameVersionsFilterVisible = projectData.gameVersions.length > 1;
    const releaseChannelsFilterVisible = availableReleaseChannels.length > 1;

    const hasSnapshotVersion = getGameVersionsFromValues(projectData.gameVersions).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );
    const gameVersionOptions = getGameVersionsFromValues(projectData.gameVersions)
        .filter((ver) => showAllVersions || !isExperimentalGameVersion(ver.releaseType))
        .map((ver) => ({ label: ver.label, value: ver.value }));

    return (
        <>
            {loadersFilterVisible || gameVersionsFilterVisible || releaseChannelsFilterVisible ? (
                <div className="w-full flex flex-wrap items-center justify-start gap-2">
                    {loadersFilterVisible ? (
                        <MultiSelect
                            selectedValues={filters.loaders}
                            options={projectData.loaders.map((loader) => ({
                                label: CapitalizeAndFormatString(loader) || "",
                                value: loader,
                            }))}
                            onValueChange={(values: string[]) => {
                                setFilters((prev) => ({ ...prev, loaders: values }));
                            }}
                            searchBox={false}
                            defaultMinWidth={false}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.search.loaders}
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}

                    {gameVersionsFilterVisible ? (
                        <MultiSelect
                            searchBox={projectData.gameVersions.length > 5}
                            defaultMinWidth={false}
                            selectedValues={filters.gameVersions}
                            options={gameVersionOptions}
                            onValueChange={(values: string[]) => {
                                setFilters((prev) => ({ ...prev, gameVersions: values }));
                            }}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.search.gameVersions}
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            fixedFooter={
                                hasSnapshotVersion ? (
                                    <>
                                        <CommandSeparator />
                                        <LabelledCheckbox
                                            checked={showAllVersions}
                                            onCheckedChange={(checked) => setShowAllVersions(checked === true)}
                                            className="text-extra-muted-foreground pe-2 ps-3.5 my-1"
                                        >
                                            {t.form.showAllVersions}
                                        </LabelledCheckbox>
                                    </>
                                ) : null
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}

                    {releaseChannelsFilterVisible ? (
                        <MultiSelect
                            searchBox={false}
                            defaultMinWidth={false}
                            selectedValues={[...filters.releaseChannels]}
                            options={availableReleaseChannels.map((channel) => ({
                                label: CapitalizeAndFormatString(channel) || "",
                                value: channel,
                            }))}
                            onValueChange={(values: string[]) => {
                                setFilters((prev) => ({ ...prev, releaseChannels: values }));
                            }}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.search.channels}
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}
                </div>
            ) : null}

            {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0 ? (
                <div className="w-full flex items-center justify-start flex-wrap gap-x-2 gap-y-1">
                    {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 1 ? (
                        <ChipButton onClick={resetFilters}>
                            {t.search.clearFilters}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ) : null}

                    {filters.releaseChannels.map((channel) => (
                        <ChipButton
                            key={channel}
                            className={releaseChannelTextColor(channel as VersionReleaseChannel)}
                            onClick={() => {
                                setFilters((prev) => ({
                                    ...prev,
                                    releaseChannels: prev.releaseChannels.filter((c) => c !== channel),
                                }));
                            }}
                        >
                            {CapitalizeAndFormatString(channel)}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ))}

                    {getGameVersionsFromValues(filters.gameVersions).map((version) => (
                        <ChipButton
                            key={version.value}
                            onClick={() => {
                                setFilters((prev) => ({
                                    ...prev,
                                    gameVersions: prev.gameVersions.filter((v) => v !== version.value),
                                }));
                            }}
                        >
                            {version.label}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ))}

                    {filters.loaders.map((loader) => {
                        const loaderData = getLoaderFromString(loader);
                        if (!loaderData) return null;
                        const accentForeground = loaderData.metadata?.foreground;

                        return (
                            <ChipButton
                                key={loader}
                                onClick={() => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        loaders: prev.loaders.filter((l) => l !== loader),
                                    }));
                                }}
                                style={{
                                    color: accentForeground
                                        ? theme === "dark"
                                            ? accentForeground?.dark
                                            : accentForeground?.light
                                        : "hsla(var(--muted-foreground))",
                                }}
                            >
                                {CapitalizeAndFormatString(loader)}
                                <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                            </ChipButton>
                        );
                    })}
                </div>
            ) : null}

            <Card className="p-5 w-full flex flex-col items-start justify-start">
                {visibleVersionItems.map((version, index) => {
                    const nextVersion = visibleVersionItems[index + 1];
                    const isDuplicate =
                        nextVersion?.changelog &&
                        nextVersion.changelog.length > 0 &&
                        nextVersion?.changelog === version.changelog &&
                        version.releaseChannel === nextVersion.releaseChannel;

                    const header = t.version.authoredBy(
                        version.title,
                        version.author.userName,
                        FormatDate_ToLocaleString(version.datePublished, {
                            includeTime: false,
                            shortMonthNames: true,
                            locale: formatLocaleCode(locale),
                        }),
                    );

                    return (
                        <div key={version.id} className="w-full ps-7 mb-4 relative dark:text-muted-foreground">
                            <div className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="flex flex-wrap gap-x-1.5 items-baseline justify-start">
                                    <ChangelogBar releaseChannel={version.releaseChannel} isDuplicate={isDuplicate === true} />
                                    {version.releaseChannel === VersionReleaseChannel.DEV ? (
                                        <TooltipProvider>
                                            <TooltipTemplate content="Dev release!" className="font-normal">
                                                <FlaskConicalIcon
                                                    aria-hidden
                                                    className="w-btn-icon-md h-btn-icon-md text-danger-foreground cursor-help"
                                                />
                                            </TooltipTemplate>
                                        </TooltipProvider>
                                    ) : null}

                                    {header.map((item, index) => {
                                        const key = `${version.id}-${index}-${item[0]}`;
                                        if (item[0] === VersionAuthor_Header.VERSION) {
                                            return (
                                                <h2 className="leading-tight" key={key}>
                                                    <Link
                                                        to={VersionPagePath(projectType, projectData.slug, version.slug)}
                                                        className="text-[1.25rem] font-bold flex items-baseline gap-2"
                                                    >
                                                        {item[1]}
                                                    </Link>
                                                </h2>
                                            );
                                        }

                                        if (item[0] === VersionAuthor_Header.AUTHOR) {
                                            return (
                                                <Link
                                                    key={key}
                                                    to={UserProfilePath(version.author.userName)}
                                                    className="link_blue hover:underline"
                                                >
                                                    {version.author.userName}
                                                </Link>
                                            );
                                        }

                                        if (item[0] === VersionAuthor_Header.PUBLISH_DATE) {
                                            return <span key={key}> {item[1]} </span>;
                                        }

                                        return <span key={key}>{item[1]}</span>;
                                    })}
                                </div>

                                {version.primaryFile?.url ? (
                                    <a
                                        href={version.primaryFile.url}
                                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                                        onClick={showDownloadAnimation}
                                        rel="nofollow noindex"
                                    >
                                        <DownloadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        {t.common.download}
                                    </a>
                                ) : null}
                            </div>
                            {version.changelog && !isDuplicate ? (
                                <MarkdownRenderBox addIdToHeadings={false} text={version.changelog} className="me-2" />
                            ) : null}
                        </div>
                    );
                })}
            </Card>

            {Pagination}
        </>
    );
}

function ChangelogBar({ releaseChannel, isDuplicate }: { releaseChannel: VersionReleaseChannel; isDuplicate: boolean }) {
    return (
        <>
            <div
                className={cn(
                    "changelog-bar absolute w-1 h-full top-2.5 start-2 rounded-full",
                    releaseChannel === VersionReleaseChannel.RELEASE
                        ? "text-blue-500 dark:text-blue-400"
                        : releaseChannel === VersionReleaseChannel.BETA
                          ? "text-orange-500 dark:text-orange-400"
                          : releaseChannel === VersionReleaseChannel.ALPHA || releaseChannel === VersionReleaseChannel.DEV
                            ? "text-danger-background"
                            : "",

                    isDuplicate && "duplicate",
                )}
            >
                <span className="absolute top-0 left-[-0.5rem] w-4 h-4 rounded-full translate-x-[0.125rem] bg-current" />
            </div>
        </>
    );
}
