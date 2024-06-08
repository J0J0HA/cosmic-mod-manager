import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { LeftArrowIcon, RightArrowIcon } from "./icons";
import { Button } from "./ui/button";

const generateLinkHref = (page: number) => {
	const currUrl = new URL(window.location.href);
	if (page === 1) currUrl.searchParams.delete("page");
	else currUrl.searchParams.set("page", page.toString());

	return currUrl.toString().replace(window.location.origin, "");
};

export default function PaginatedNavigation({ pagesCount, activePage }: { pagesCount: number; activePage: number }) {
	const pages = (() => {
		const list: number[] = new Array(pagesCount);
		for (let i = 0; i < pagesCount; i++) {
			list.push(i + 1);
		}
		return list;
	})();

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					{activePage === 1 ? (
						<Button variant={"ghost"} disabled>
							<LeftArrowIcon className="w-4 h-4" />
						</Button>
					) : (
						<PaginationPrevious to={generateLinkHref(activePage - 1)} />
					)}
				</PaginationItem>

				{pagesCount < 8 ? (
					pages.map((page) => {
						return (
							<PaginationItem key={page}>
								<PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
									{page.toString()}
								</PaginationLink>
							</PaginationItem>
						);
					})
				) : activePage < 5 ? (
					<>
						{pages.slice(0, 5).map((page) => {
							return (
								<PaginationItem key={page}>
									<PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
										{page.toString()}
									</PaginationLink>
								</PaginationItem>
							);
						})}

						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>

						<PaginationItem>
							<PaginationLink to={generateLinkHref(pages[pagesCount - 1])} isActive={activePage === pages.at(-1)}>
								{pages.at(-1)?.toString()}
							</PaginationLink>
						</PaginationItem>
					</>
				) : activePage >= 5 && activePage <= pagesCount - 4 ? (
					<>
						<PaginationItem>
							<PaginationLink to={generateLinkHref(1)} isActive={activePage === 1}>
								1
							</PaginationLink>
						</PaginationItem>

						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>

						{pages.slice(activePage - 2, activePage + 1).map((page) => {
							return (
								<PaginationItem key={page}>
									<PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
										{page.toString()}
									</PaginationLink>
								</PaginationItem>
							);
						})}

						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>

						<PaginationItem>
							<PaginationLink to={generateLinkHref(pages[pagesCount - 1])} isActive={activePage === pages.at(-1)}>
								{pages.at(-1)?.toString()}
							</PaginationLink>
						</PaginationItem>
					</>
				) : (
					<>
						<PaginationItem>
							<PaginationLink to={generateLinkHref(1)} isActive={activePage === 1}>
								1
							</PaginationLink>
						</PaginationItem>

						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>

						{pages.slice(-5).map((item) => {
							return (
								<PaginationItem key={item}>
									<PaginationLink to={generateLinkHref(item)} isActive={activePage === item}>
										{item.toString()}
									</PaginationLink>
								</PaginationItem>
							);
						})}
					</>
				)}

				<PaginationItem>
					{activePage > pagesCount - 1 ? (
						<Button variant={"ghost"} disabled>
							<RightArrowIcon className="w-4 h-4" />
						</Button>
					) : (
						<PaginationNext to={generateLinkHref(activePage + 1)} />
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
