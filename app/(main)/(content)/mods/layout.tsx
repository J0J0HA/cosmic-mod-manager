import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mods",
	description: "Mods on CRMM",
};

const ModsPageLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="w-full flex items-center justify-center">
			{children}
		</section>
	);
};

export default ModsPageLayout;
