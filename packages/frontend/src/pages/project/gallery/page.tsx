import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn, formatDate, imageUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { LoadingStatus } from "@/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SITE_NAME_SHORT } from "@shared/config";
import { ProjectPermissions } from "@shared/types";
import type { GalleryItem, TeamMember } from "@shared/types/api";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarIcon,
    ExpandIcon,
    ExternalLinkIcon,
    InfoIcon,
    ShrinkIcon,
    StarIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const RemoveGalleryImage = lazy(() => import("./remove-image"));
const EditGalleryImage = lazy(() => import("./edit-image"));
const UploadGalleryImageForm = lazy(() => import("@/src/pages/project/gallery/upload-image"));

const ProjectGallery = () => {
    const { projectData, currUsersMembership } = useContext(projectContext);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [dialogOpen, setdialogOpen] = useState(false);

    if (!projectData || currUsersMembership.status === LoadingStatus.LOADING) return null;
    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Gallery | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            {currUsersMembership.data?.id && currUsersMembership.data.permissions.includes(ProjectPermissions.EDIT_DETAILS) ? (
                <Card className="p-card-surround w-full flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2">
                    <Suspense>
                        <UploadGalleryImageForm />
                    </Suspense>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <InfoIcon className="h-btn-icon w-btn-icon" />
                        Upload a new gallery image
                    </div>
                </Card>
            ) : null}

            {projectData.gallery?.length ? (
                <div className="w-full grid gap-panel-cards grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                    {projectData.gallery.map((galleryItem, index) => (
                        <GalleryItemCard
                            key={galleryItem.id}
                            galleryItem={galleryItem}
                            index={index}
                            setActiveIndex={setActiveGalleryIndex}
                            setdialogOpen={setdialogOpen}
                            currUsersMembership={currUsersMembership.data}
                        />
                    ))}

                    {projectData.gallery?.[activeGalleryIndex] ? (
                        <ImageDialog
                            galleryItem={projectData.gallery[activeGalleryIndex]}
                            totalItems={projectData.gallery.length}
                            activeIndex={activeGalleryIndex}
                            setActiveIndex={setActiveGalleryIndex}
                            dialogOpen={dialogOpen}
                            setDialogOpen={setdialogOpen}
                        />
                    ) : null}
                </div>
            ) : null}
        </>
    );
};

export default ProjectGallery;

const GalleryItemCard = ({
    galleryItem,
    index,
    setActiveIndex,
    setdialogOpen,
    currUsersMembership,
}: {
    galleryItem: GalleryItem;
    index: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    setdialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currUsersMembership: TeamMember | null;
}) => {
    return (
        <div className="grid grid-cols-1 grid-rows-[min-content,_1fr] bg-card-background rounded-lg p-2">
            <button
                type="button"
                className="flex items-center justify-center aspect-video bg-[hsla(var(--background-dark))] rounded-lg overflow-hidden"
                onClick={(e) => {
                    setActiveIndex(index);
                    setdialogOpen(true);
                }}
            >
                <img
                    src={imageUrl(galleryItem.image)}
                    alt={galleryItem.name}
                    className="w-full h-full object-contain cursor-pointer hover:brightness-75 transition-all duration-300"
                />
            </button>

            <div className="w-full grid grid-cols-1 place-content-between gap-2 p-2 pb-1 ">
                <div className="w-full flex flex-col items-start justify-start ">
                    <span className="flex items-center justify-start gap-2 text-lg font-bold">
                        {galleryItem.name}
                        {galleryItem.featured === true ? (
                            <StarIcon className="w-btn-icon h-btn-icon fill-current text-extra-muted-foreground" />
                        ) : null}
                    </span>
                    <span className="text-muted-foreground leading-tight">{galleryItem.description}</span>
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-1.5 mt-1">
                    <p className="flex gap-1.5 items-center justify-center text-muted-foreground">
                        <CalendarIcon className="w-btn-icon h-btn-icon" />
                        {formatDate(new Date(galleryItem.dateCreated), "${month} ${day}, ${year}")}
                    </p>
                    {currUsersMembership?.id && currUsersMembership?.permissions.includes(ProjectPermissions.EDIT_DETAILS) ? (
                        <div className="w-full flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                            <Suspense>
                                <EditGalleryImage galleryItem={galleryItem} />

                                <RemoveGalleryImage id={galleryItem.id}>
                                    <Button variant={"secondary"} size={"sm"}>
                                        <Trash2Icon className="w-btn-icon-sm h-btn-icon-sm" />
                                        Remove
                                    </Button>
                                </RemoveGalleryImage>
                            </Suspense>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const ImageDialog = ({
    galleryItem,
    setActiveIndex,
    totalItems,
    dialogOpen,
    setDialogOpen,
}: {
    galleryItem: GalleryItem;
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [isFullWidth, setIsFullWidth] = useState(false);

    const toggleFullWidth = () => {
        setIsFullWidth((prev) => !prev);
    };

    const next = () => {
        setActiveIndex((current) => {
            if (current < totalItems - 1) {
                return current + 1;
            }
            return 0;
        });
    };

    const previous = () => {
        setActiveIndex((current) => {
            if (current > 0) {
                return current - 1;
            }
            return totalItems - 1;
        });
    };

    const handleKeyboardInputs = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            previous();
        } else if (e.key === "ArrowRight") {
            next();
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        document.body.addEventListener("keydown", handleKeyboardInputs);
        return () => {
            document.body.removeEventListener("keydown", handleKeyboardInputs);
        };
    }, []);

    useEffect(() => {
        if (dialogOpen === false) setIsFullWidth(false);
    }, [dialogOpen]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
                id="gallery_dialog_content"
                className="w-full flex items-center justify-center max-w-full bg-transparent border-none ring-0 p-0 pt-0 pb-0"
            >
                <VisuallyHidden>
                    <DialogTitle>{galleryItem.name}</DialogTitle>
                    <DialogDescription>{galleryItem.description}</DialogDescription>
                </VisuallyHidden>
                <div id="image_popup_content" className="w-full h-[100dvh] flex flex-col items-center justify-center relative">
                    <DialogClose asChild>
                        <div className="absolute top-0 left-0 w-full h-full z-0" />
                    </DialogClose>

                    <img
                        src={imageUrl(galleryItem.image)}
                        alt={galleryItem.name}
                        className={cn(
                            "border-none ring-0 rounded-lg object-contain z-10",
                            "max-w-[calc(100vw_-_2rem)] sm:max-w-[calc(100vw_-_6rem)] max-h-[calc(100vh_-_4rem)]",
                            isFullWidth && "w-full h-full",
                        )}
                    />

                    <div className="max-w-full flex flex-col items-center justify-center group p-16 pt-24 pb-4 rounded w-fit absolute left-[50%] bottom-[0.5rem] translate-x-[-50%] z-20">
                        <div className="max-w-full w-max flex flex-col items-center justify-center transition-all duration-300 opacity-0 scale-75 translate-y-[1rem] group-hover:translate-y-[-1rem] group-hover:scale-100 group-hover:opacity-100 text-[hsla(var(--foreground-dark))]">
                            <span className="drop-shadow-[1px_1px_5px_hsla(var(--background-dark))] font-bold text-lg">
                                {galleryItem.name}
                            </span>
                            <span className="drop-shadow-[1px_1px_5px_hsla(var(--background-dark))] text-pretty">
                                {galleryItem.description}
                            </span>
                        </div>

                        <div className="flex items-center justify-start gap-2 p-2.5 px-3 rounded-xl bg-card-background opacity-45 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 origin-bottom">
                            <DialogClose asChild>
                                <Button className="rounded-full" size={"icon"} variant={"secondary"}>
                                    <XIcon className="w-btn-icon-md h-btn-icon-md" />
                                </Button>
                            </DialogClose>

                            <a
                                href={imageUrl(galleryItem.image)}
                                aria-label={galleryItem.name}
                                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full")}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <VisuallyHidden>{galleryItem.name}</VisuallyHidden>
                                <ExternalLinkIcon className="w-btn-icon h-btn-icon" />
                            </a>

                            <Button variant={"secondary"} size={"icon"} className="rounded-full" onClick={toggleFullWidth}>
                                {isFullWidth ? (
                                    <ShrinkIcon className="w-btn-icon h-btn-icon" />
                                ) : (
                                    <ExpandIcon className="w-btn-icon h-btn-icon" />
                                )}
                            </Button>

                            <Button variant={"secondary"} size={"icon"} className="rounded-full" onClick={previous}>
                                <ArrowLeftIcon className="w-btn-icon h-btn-icon" />
                            </Button>

                            <Button variant={"secondary"} size={"icon"} className="rounded-full" onClick={next}>
                                <ArrowRightIcon className="w-btn-icon h-btn-icon" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};