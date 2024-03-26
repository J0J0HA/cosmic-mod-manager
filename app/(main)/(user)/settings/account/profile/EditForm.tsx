"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { DialogClose } from "@/components/ui/dialog";
import { updateUserProfile } from "@/app/api/actions/user";
import { useSession } from "next-auth/react";
import { maxNameLength, maxUsernameLength } from "@/config";
import { isValidName, isValidUsername } from "@/lib/user";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const formSchema = z.object({
	username: z
		.string()
		.min(1, {
			message: "Enter your username",
		})
		.max(maxUsernameLength, {
			message: `You username can only have maximum of ${maxUsernameLength} character`,
		}),
	name: z
		.string()
		.min(2, {
			message: "Enter your name",
		})
		.max(maxNameLength, {
			message: `You name can only have maximum of ${maxNameLength} character`,
		}),
});

type Props = {
	name: string;
	username: string;
	dialogOpen: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProfileInfoForm = ({
	name,
	username,
	dialogOpen,
	setDialogOpen,
}: Props) => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);
	const session = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: username || "",
			name: name || "",
		},
	});

	const checkFormError = (
		event?: React.KeyboardEvent<HTMLInputElement>,
		inputName?: "name" | "username",
	) => {
		let name = form.getValues("name");
		let username = form.getValues("username");

		console.log({
			name,
			username,
		});

		if (event && inputName && inputName === "name") {
			// @ts-expect-error
			name = event.target.value;
		}
		if (event && inputName && inputName === "username") {
			// @ts-expect-error
			username = event.target.value;
		}

		if (isValidUsername(username) !== true) {
			const error = isValidUsername(username);
			setFormError(error.toString());
			return;
		}

		if (isValidName(name) !== true) {
			const error = isValidName(name);
			setFormError(error.toString());
			return;
		}

		setFormError(null);
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		// TODO: Check form data validity
		if (loading) return;

		checkFormError();
		if (formError) {
			return;
		}

		setLoading(true);

		const result = await updateUserProfile({
			id: session.data.user.id,
			data: {
				username: values.username,
				name: values.name,
			},
		});

		if (result?.success === true) {
			toast({
				title: "Profile successfully updated",
			});

			setDialogOpen(false);
		} else if (result?.success === false) {
			toast({
				title: result.error || "Couldn't update your profile info!",
			});
		}

		setLoading(false);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full flex flex-col items-center justify-center gap-5"
			>
				<div className="w-full flex flex-col items-center justify-center">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<>
								<FormItem className="w-full flex flex-col items-center justify-center">
									<FormLabel className="w-full flex items-center justify-between text-left gap-12">
										<span>Username</span>
										<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
									</FormLabel>
									<FormControl>
										<Input
											placeholder="john_doe"
											className="w-full flex items-center justify-center"
											onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
												checkFormError(e, "username");
											}}
											{...field}
										/>
									</FormControl>
								</FormItem>
							</>
						)}
					/>
				</div>

				<div className="w-full flex flex-col items-center justify-center">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<>
								<FormItem className="w-full flex flex-col items-center justify-center">
									<FormLabel className="w-full flex items-center justify-between text-left gap-12">
										<span>Full name</span>
										<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
									</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											className="w-full flex items-center justify-center"
											onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
												checkFormError(e, "name");
											}}
											{...field}
										/>
									</FormControl>
								</FormItem>
							</>
						)}
					/>
				</div>

				{formError && (
					<div className="w-full flex items-center justify-start gap-4 text-rose-600 dark:text-rose-">
						<ExclamationTriangleIcon className="w-6 h-500" />
						<p>{formError}</p>
					</div>
				)}

				<div className="w-full flex items-center justify-end gap-2">
					<DialogClose className="w-fit hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-lg">
						<p className="px-4 h-9 flex items-center justify-center">Discard</p>
					</DialogClose>

					<Button
						type="submit"
						aria-label="Log in"
						className=""
						disabled={
							form.getValues().name === name &&
							form.getValues().username === username
						}
					>
						<p className="px-4">Save</p>
					</Button>
				</div>
			</form>
			{loading === true && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center relative rounded-xl">
						<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
						<Spinner size="2.4rem" />
					</div>
				</div>
			)}
		</Form>
	);
};

export default EditProfileInfoForm;
