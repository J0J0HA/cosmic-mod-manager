import { ProjectStatusIcon, fallbackProjectIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyBtn from "@/components/ui/copy-btn";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatProjectTypes, getProjectPagePathname, imageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import type { ProjectPublishingStatus } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { SettingsIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import CreateNewProjectDialog from "./new-project";

const getAllUserProjects = async () => {
    try {
        const response = await useFetch("/api/project");
        const result = await response.json();
        return (result?.projects as ProjectListItem[]) || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const ProjectsPage = () => {
    const projectsList = useQuery({ queryKey: ["all-user-projects"], queryFn: () => getAllUserProjects() });
    const navigate = useNavigate();

    const refetchProjectsList = async () => {
        await projectsList.refetch();
    };

    return (
        <>
            <Helmet>
                <title>Projects | {SITE_NAME_SHORT}</title>
                <meta name="description" content={`Your ${SITE_NAME_SHORT} projects`} />
            </Helmet>

            <Card className="w-full overflow-hidden">
                <CardHeader className="w-full flex flex-row flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <CardTitle>Projects</CardTitle>
                    <CreateNewProjectDialog refetchProjectsList={refetchProjectsList} />
                </CardHeader>
                <CardContent className="p-0">
                    {projectsList.data?.length === 0 ? (
                        <div className="w-full flex items-center justify-start p-6">
                            <p>You don't have any projects. Click the button above to create one.</p>
                        </div>
                    ) : (projectsList.data?.length || 0) > 0 ? (
                        <div className="w-full mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                                        {/* ICON: VISIBLE ON sm+ width */}
                                        <TableHead className="invisible md:visible w-[5.5rem] sm:w-[6.5rem] pl-table-side-pad-sm sm:pl-table-side-pad">
                                            Icon
                                        </TableHead>
                                        {/* DETAILS: MOBILE ONLY */}
                                        <TableHead className="invisible md:hidden">Details</TableHead>

                                        {/* NAME: VISIBLE ON sm+ width */}
                                        <TableHead className="hidden md:table-cell min-w-16 lg:min-w-36">Name</TableHead>
                                        {/* ID: VISIBLE ON sm+ width */}
                                        <TableHead className="hidden md:table-cell">ID</TableHead>
                                        {/* TYPE: VISIBLE ON sm+ width */}
                                        <TableHead className="hidden md:table-cell">Type</TableHead>
                                        {/* STATUS: VISIBLE ON sm+ width */}
                                        <TableHead className="hidden md:table-cell">Status</TableHead>

                                        {/* SETTINGS LINK: VISIBLE ON sm+ width */}
                                        <TableHead className="invisible md:visible w-10 pr-table-side-pad-sm sm:pr-table-side-pad">
                                            {" "}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(projectsList.data || []).map((project) => {
                                        return (
                                            <TableRow
                                                key={project.id}
                                                className="cursor-pointer text-muted-foreground"
                                                onClick={(e) => {
                                                    //@ts-expect-error
                                                    if (!e.target.closest(".noClickRedirect")) {
                                                        navigate(getProjectPagePathname(project.type[0], project.slug));
                                                    }
                                                }}
                                            >
                                                {/* ICON */}
                                                <TableCell className="pl-table-side-pad-sm sm:pl-table-side-pad">
                                                    <Link
                                                        tabIndex={-1}
                                                        to={getProjectPagePathname(project.type[0], project.slug)}
                                                        className="noClickRedirect flex"
                                                        aria-label={`view ${project.name}`}
                                                    >
                                                        <ImgWrapper
                                                            src={imageUrl(project.icon)}
                                                            alt={project.name}
                                                            fallback={fallbackProjectIcon}
                                                            className="h-12 rounded"
                                                        />
                                                    </Link>
                                                </TableCell>

                                                {/* AGGREGATED PROJECT DETAILS: VISIBLE ON MOBILE WIDTH ONLY */}
                                                <TableCell className="md:hidden !pl-0 sm:pl-2">
                                                    <div className="flex flex-col items-start justify-center gap-1">
                                                        <Link
                                                            to={getProjectPagePathname(project.type[0], project.slug)}
                                                            className="noClickRedirect leading-none text-lg font-bold text-foreground hover:underline"
                                                        >
                                                            {project.name}
                                                        </Link>
                                                        <span className="leading-none font-medium">
                                                            {CapitalizeAndFormatString(project.status)}
                                                        </span>
                                                        <span className="leading-none">{FormatProjectTypes(project.type)}</span>
                                                        <CopyBtn
                                                            id={`${project.slug}-${project.id}`}
                                                            text={project.id}
                                                            label={project.id}
                                                            // maxLabelChars={12}
                                                            className="noClickRedirect px-2 py-1 bg-shallow-background/50 neumorphic_shadow"
                                                            iconClassName="w-3 h-3"
                                                        />
                                                    </div>
                                                </TableCell>

                                                {/* NAME */}
                                                <TableCell className="hidden md:table-cell">
                                                    <Link
                                                        to={getProjectPagePathname(project.type[0], project.slug)}
                                                        className="noClickRedirect text-base leading-none font-medium hover:underline"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                </TableCell>
                                                {/* ID */}
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="w-fit flex items-center justify-start font-mono text-sm noClickRedirect">
                                                        <CopyBtn
                                                            id={`${project.slug}-${project.id}`}
                                                            text={project.id}
                                                            label={project.id}
                                                            maxLabelChars={10}
                                                            iconClassName="w-3 h-3"
                                                        />
                                                    </div>
                                                </TableCell>
                                                {/* TYPE */}
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="leading-none">{FormatProjectTypes(project.type)}</span>
                                                </TableCell>
                                                {/* STATUS */}
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="flex items-center gap-1 leading-none font-medium">
                                                        <ProjectStatusIcon status={project.status || ("" as ProjectPublishingStatus)} />
                                                        {CapitalizeAndFormatString(project.status)}
                                                    </span>
                                                </TableCell>

                                                {/* SETTINGS PAGE LINK */}
                                                <TableCell className="pr-table-side-pad-sm sm:pr-table-side-pad">
                                                    <Link
                                                        to={`${getProjectPagePathname(project.type[0], project.slug)}/settings`}
                                                        className="noClickRedirect rounded flex items-center justify-center h-full w-fit p-2 hover:bg-shallow-background hover:neumorphic_shadow"
                                                        aria-label="project settings"
                                                    >
                                                        <SettingsIcon className="w-btn-icon-md h-btn-icon-md" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : projectsList?.isLoading ? (
                        <FullWidthSpinner />
                    ) : null}
                </CardContent>
            </Card>
        </>
    );
};

export default ProjectsPage;
