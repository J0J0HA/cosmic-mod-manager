import { TagIcon } from "@app/components/icons/tag-icons";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { Input } from "@app/components/ui/input";
import { cn } from "@app/components/utils";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@app/utils/src/constants/game-versions";
import {
    categoryFilterParamNamespace,
    environmentFilterParamNamespace,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
} from "@app/utils/config/search";
import { getALlLoaderFilters, getValidProjectCategories } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectType, TagHeaderType } from "@app/utils/types";
import { ChevronDownIcon, ChevronUpIcon, FilterXIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { VariantButtonLink } from "~/components/ui/link";
import { SkipNav } from "~/components/ui/skip-nav";
import { useTranslation } from "~/locales/provider";
import { deletePageOffsetParam, getCurrUrl, updateSearchParam } from "./provider";
import { useSearchParams } from "react-router";

const SHOW_ENV_FILTER_FOR_TYPES = [ProjectType.MOD, ProjectType.MODPACK /*, ProjectType.DATAMOD */];

interface Props {
    type: ProjectType[];
    showFilters: boolean;
    searchParams: URLSearchParams;
}

function matchesSearch(strings: string[], query: string) {
    const queryLower = query.toLowerCase();
    for (const str of strings) {
        const strLower = str.toLowerCase();

        if (strLower.includes(queryLower) || queryLower.includes(strLower)) {
            return true;
        }
    }
    return false;
}

const filtersKeyList = [
    loaderFilterParamNamespace,
    gameVersionFilterParamNamespace,
    environmentFilterParamNamespace,
    categoryFilterParamNamespace,
    licenseFilterParamNamespace,
];

function clearFilters() {
    const currUrl = getCurrUrl();
    for (const key of filtersKeyList) {
        currUrl.searchParams.delete(key);
    }

    return currUrl.href.replace(currUrl.origin, "");
}

function FilterSidebar({ type, showFilters, searchParams }: Props) {
    const { t } = useTranslation();
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [query, setQuery] = useState("");

    // Labels
    const loadersFilterLabel = t.search.loaders;
    const gameVersionsFilterLabel = t.search.gameVersions;
    const environmentFilterLabel = t.search.environment;
    const categoryFilterLabel = t.search.category;
    const featureFilterLabel = t.search.feature;
    const resolutionFilterLabel = t.search.resolution;
    const performanceFilterLabel = t.search.performance_impact;
    const licenseFilterLabel = t.search.license;

    // Filters list
    const loaderFilters = getALlLoaderFilters(type);
    // Project Loader filters
    const loaderFilterOptions = loaderFilters
        .map((loader) => loader.name)
        .filter((loader) => matchesSearch([loader, loadersFilterLabel], query));

    // Game version filters
    const gameVersionFilterOptions = GAME_VERSIONS.filter((version) => {
        if (!showAllVersions && isExperimentalGameVersion(version.releaseType)) return false;
        return true;
    })
        .map((version) => ({ value: version.value, label: version.label }))
        .filter((version) => {
            if (!version) return false;
            return matchesSearch([version.label, version.value, gameVersionsFilterLabel], query);
        });

    // Environment filters
    const environmentFilterOptions = ["client", "server"].filter((env) => matchesSearch([env, environmentFilterLabel], query));

    // Category filters
    const categoryFilterOptions = getValidProjectCategories(type, TagHeaderType.CATEGORY)
        .map((c) => c.name)
        .filter((category) => matchesSearch([category, categoryFilterLabel], query));

    // Feature filters
    const featureFilterOptions = getValidProjectCategories(type, TagHeaderType.FEATURE)
        .map((f) => f.name)
        .filter((feature) => matchesSearch([feature, featureFilterLabel], query));

    // Resolution filters
    const resolutionFilterOptions = getValidProjectCategories(type, TagHeaderType.RESOLUTION)
        .map((r) => r.name)
        .filter((resolution) => matchesSearch([resolution, resolutionFilterLabel], query));

    // Performance impact filters
    const performanceFilterOptions = getValidProjectCategories(type, TagHeaderType.PERFORMANCE_IMPACT)
        .map((p) => p.name)
        .filter((performance) => matchesSearch([performance, performanceFilterLabel], query));

    // License filters
    const licenseFilterOptions = [{ value: "oss", label: t.search.openSourceOnly }].filter((license) =>
        matchesSearch([license.label, license.value, licenseFilterLabel], query),
    );

    const isUniversalSearchPage = type.length > 1;
    const defaultOpenAdditionalFilters = !isUniversalSearchPage;

    return (
        <aside
            className={cn(
                "relative h-fit flex flex-col gap-3 p-card-surround bg-card-background rounded-lg",
                !showFilters && "hidden lg:flex",
            )}
            style={{ gridArea: "sidebar" }}
        >
            <SkipNav />

            <div className="flex items-center justify-center gap-2">
                <Input
                    placeholder={t.search.searchFilters}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                />

                <VariantButtonLink
                    url={clearFilters()}
                    variant="secondary"
                    className="shrink-0 !w-10 !h-10"
                    title={t.search.clearFilters}
                    size="icon"
                >
                    <FilterXIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                </VariantButtonLink>
            </div>

            <FilterCategory
                items={loaderFilterOptions}
                selectedItems={searchParams.getAll(loaderFilterParamNamespace)}
                label={loadersFilterLabel}
                filterToggledUrl={(loaderName) => {
                    return updateSearchParam({
                        key: loaderFilterParamNamespace,
                        value: loaderName,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
            />

            <FilterCategory
                items={gameVersionFilterOptions}
                selectedItems={searchParams.getAll(gameVersionFilterParamNamespace)}
                label={gameVersionsFilterLabel}
                listWrapperClassName="max-h-[15rem] overflow-y-auto px-0.5"
                formatLabel={false}
                filterToggledUrl={(version) => {
                    return updateSearchParam({
                        key: gameVersionFilterParamNamespace,
                        value: version,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                footerItem={
                    <LabelledCheckbox
                        checked={showAllVersions}
                        onCheckedChange={(checked) => {
                            setShowAllVersions(checked === true);
                        }}
                        className="mt-3 ms-0.5 text-extra-muted-foreground"
                    >
                        {t.form.showAllVersions}
                    </LabelledCheckbox>
                }
            />

            {SHOW_ENV_FILTER_FOR_TYPES.some((t) => type.includes(t)) && (
                <FilterCategory
                    items={environmentFilterOptions}
                    selectedItems={searchParams.getAll(environmentFilterParamNamespace)}
                    label={environmentFilterLabel}
                    filterToggledUrl={(env) => {
                        return updateSearchParam({
                            key: environmentFilterParamNamespace,
                            value: env,
                            deleteIfExists: true,
                            deleteParamsWithMatchingValueOnly: true,
                            customURLModifier: deletePageOffsetParam,
                        });
                    }}
                    defaultOpen={defaultOpenAdditionalFilters}
                />
            )}

            <FilterCategory
                items={categoryFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={categoryFilterLabel}
                filterToggledUrl={(category) => {
                    return updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: category,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={featureFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={featureFilterLabel}
                filterToggledUrl={(feature) => {
                    return updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={resolutionFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={resolutionFilterLabel}
                filterToggledUrl={(feature) => {
                    return updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={performanceFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={performanceFilterLabel}
                filterToggledUrl={(feature) => {
                    return updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={licenseFilterOptions}
                selectedItems={searchParams.getAll(licenseFilterParamNamespace)}
                label={licenseFilterLabel}
                filterToggledUrl={(license) => {
                    return updateSearchParam({
                        key: licenseFilterParamNamespace,
                        value: license,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />
        </aside>
    );
}

export default FilterSidebar;

interface FilterItem {
    value: string;
    label: string;
}

interface FilterCategoryProps {
    items: FilterItem[] | string[];
    selectedItems: string[];
    label: string;
    // The function is expected to return the pathname after toggling the filter
    filterToggledUrl: (prevVal: string) => URLSearchParams;
    listWrapperClassName?: string;
    className?: string;
    formatLabel?: boolean;
    footerItem?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

function FilterCategory({
    items,
    selectedItems,
    label,
    filterToggledUrl,
    className,
    listWrapperClassName,
    formatLabel = true,
    footerItem,
    collapsible = true,
    defaultOpen = true,
}: FilterCategoryProps) {
    const { t } = useTranslation();
    const [_, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    if (!items.length) return null;

    function toggleVisibility(e?: React.MouseEvent) {
        e?.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    return (
        <section className={cn("filterCategory grid grid-cols-1", className)}>
            <div
                className={cn("flex items-center justify-between gap-x-2 p-0.5", collapsible && "cursor-pointer")}
                onClick={toggleVisibility}
                onKeyDown={(e) => {
                    if (e.key === "Enter") toggleVisibility();
                }}
            >
                <h3 className="font-bold text-base">{label}</h3>
                {collapsible && (
                    <button type="button" onClick={toggleVisibility} className="text-extra-muted-foreground" aria-label="Toggle visibility">
                        {isOpen ? <ChevronUpIcon aria-hidden className="w-5 h-5" /> : <ChevronDownIcon aria-hidden className="w-5 h-5" />}
                    </button>
                )}
            </div>
            <div className={cn("w-full flex flex-col", !isOpen && collapsible && "hidden", listWrapperClassName)}>
                {items.map((item) => {
                    const itemValue = typeof item === "string" ? item : item.value;
                    let _itemLabel = typeof item === "string" ? item : item.label;

                    // @ts-ignore
                    const tagTranslation = t.search.tags[itemValue];
                    if (tagTranslation) {
                        _itemLabel = tagTranslation;
                    }

                    const itemLabel = formatLabel ? CapitalizeAndFormatString(_itemLabel) || "" : _itemLabel;

                    return (
                        <LabelledCheckbox
                            checked={selectedItems.includes(itemValue)}
                            onCheckedChange={() => {
                                const newUrl = filterToggledUrl(itemValue);
                                setSearchParams(newUrl, { preventScrollReset: true });
                            }}
                            key={itemValue}
                            name={itemLabel}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <TagIcon name={itemValue} />
                                {itemLabel}
                            </span>
                        </LabelledCheckbox>
                    );
                })}
            </div>
            {!isOpen && collapsible ? null : footerItem}
        </section>
    );
}
