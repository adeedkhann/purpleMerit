import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import {
	changeMyPassword,
	clearUserMessage,
	fetchMyProfile,
	updateMyProfile,
} from "../features/users/userSlice";
import { setUser } from "../features/auth/authSlice";

const formatDate = (value) => {
	if (!value) return "N/A";
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "N/A";

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
};

const Profile = () => {
	const dispatch = useDispatch();

	const {
		myProfile,
		isProfileLoading,
		isUpdatingProfile,
		isChangingPassword,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.users);

	const { user: authUser } = useSelector((state) => state.auth);

	const [profileForm, setProfileForm] = useState({
		name: "",
		email: "",
		role: "",
		status: "",
	});

	const [passwordForm, setPasswordForm] = useState({
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	useEffect(() => {
		dispatch(fetchMyProfile());
	}, [dispatch]);

	useEffect(() => {
		if (!myProfile) return;

		setProfileForm({
			name: myProfile.name || "",
			email: myProfile.email || "",
			role: myProfile.role || "",
			status: myProfile.status || "",
		});
	}, [myProfile]);

	useEffect(() => {
		return () => {
			dispatch(clearUserMessage());
		};
	}, [dispatch]);

	const initials = useMemo(() => {
		const source = profileForm.name || authUser?.name || "U";
		return source
			.split(" ")
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join("");
	}, [authUser?.name, profileForm.name]);

	const handleProfileInput = (event) => {
		const { name, value } = event.target;
		setProfileForm((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordInput = (event) => {
		const { name, value } = event.target;
		setPasswordForm((prev) => ({ ...prev, [name]: value }));
	};

	const submitProfileUpdate = async (event) => {
		event.preventDefault();

		const payload = {
			name: profileForm.name.trim(),
			email: profileForm.email.trim(),
		};

		try {
			const updatedUser = await dispatch(updateMyProfile(payload)).unwrap();
			dispatch(setUser(updatedUser));
		} catch (error) {
			// Error state is already handled by the users slice.
			console.error("Profile update failed", error);
		}
	};

	const submitPasswordUpdate = async (event) => {
		event.preventDefault();

		if (!passwordForm.oldPassword || !passwordForm.newPassword) return;

		if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
			return;
		}

		try {
			await dispatch(
				changeMyPassword({
					oldPassword: passwordForm.oldPassword,
					newPassword: passwordForm.newPassword,
				})
			).unwrap();

			setPasswordForm({
				oldPassword: "",
				newPassword: "",
				confirmNewPassword: "",
			});
		} catch (error) {
			// Error state is already handled by the users slice.
			console.error("Password update failed", error);
		}
	};

	if (isProfileLoading && !myProfile) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white text-xs font-black uppercase tracking-[0.2em] text-black">
				Loading profile dossier...
			</div>
		);
	}

	return (
		<section className="min-h-screen bg-white px-4 py-6 text-black md:px-8">
			<div className="mx-auto max-w-7xl border-2 border-black p-4 md:p-6">
				<header className="mb-6 flex flex-col justify-between gap-4 border-b-2 border-black pb-4 md:flex-row md:items-end">
					<div>
						<p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
							Account Identity
						</p>
						<h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">
							User Profile
						</h1>
					</div>
					<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
						Last Sync: {formatDate(myProfile?.updatedAt)}
					</p>
				</header>

				{(isError || isSuccess) && (
					<div
						className={`mb-6 border-2 border-black px-4 py-3 text-xs font-black uppercase tracking-[0.13em] ${
							isError ? "bg-black text-white" : "bg-white text-black"
						}`}
					>
						{message || (isError ? "Request failed" : "Request completed")}
					</div>
				)}

				<div className="grid border-2 border-black md:grid-cols-[280px_1fr]">
					<aside className="border-b-2 border-black p-5 md:border-b-0 md:border-r-2">
						<div className="flex h-48 w-full items-center justify-center border-2 border-black bg-zinc-100 text-5xl font-black uppercase tracking-tight">
							{initials || "U"}
						</div>

						<div className="mt-4 space-y-3 border-t-2 border-black pt-3 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-700">
							<p className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4" />
								Joined: {formatDate(myProfile?.createdAt)}
							</p>
							<p className="flex items-center gap-2">
								<ShieldCheck className="h-4 w-4" />
								Role: {profileForm.role || "N/A"}
							</p>
							<p className="flex items-center gap-2">
								<UserRound className="h-4 w-4" />
								Status: {profileForm.status || "N/A"}
							</p>
						</div>
					</aside>

					<div className="p-5">
						<form onSubmit={submitProfileUpdate} className="space-y-6">
							<div>
								<h2 className="text-lg font-black uppercase tracking-[0.06em]">
									Personal Info
								</h2>

								<div className="mt-3 grid gap-3 md:grid-cols-2">
									<label className="block">
										<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
											Full Name
										</span>
										<input
											name="name"
											value={profileForm.name}
											onChange={handleProfileInput}
											className="w-full border-2 border-black px-3 py-2 text-sm font-black uppercase tracking-[0.05em] outline-none"
										/>
									</label>

									<label className="block">
										<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
											Email Address
										</span>
										<div className="relative">
											<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
											<input
												name="email"
												type="email"
												value={profileForm.email}
												onChange={handleProfileInput}
												className="w-full border-2 border-black py-2 pl-9 pr-3 text-sm font-semibold outline-none"
											/>
										</div>
									</label>
								</div>
							</div>

							<div className="grid gap-3 md:grid-cols-2">
								<label className="block">
									<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
										Role (Locked)
									</span>
									<input
										value={profileForm.role}
										disabled
										className="w-full cursor-not-allowed border-2 border-black bg-zinc-100 px-3 py-2 text-sm font-black uppercase tracking-[0.08em] text-zinc-600 outline-none"
									/>
								</label>

								<label className="block">
									<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
										Status (Locked)
									</span>
									<input
										value={profileForm.status}
										disabled
										className="w-full cursor-not-allowed border-2 border-black bg-zinc-100 px-3 py-2 text-sm font-black uppercase tracking-[0.08em] text-zinc-600 outline-none"
									/>
								</label>
							</div>

							<p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-600">
								<LockKeyhole className="h-4 w-4" />
								RBAC policy: Role and status are managed by admin controls only.
							</p>

							<button
								type="submit"
								disabled={isUpdatingProfile}
								className="border-2 border-black bg-black px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isUpdatingProfile ? "Updating..." : "Update Records"}
							</button>
						</form>

						<form
							onSubmit={submitPasswordUpdate}
							className="mt-8 border-t-2 border-black pt-6"
						>
							<h2 className="text-lg font-black uppercase tracking-[0.06em]">
								Security Access
							</h2>

							<div className="mt-3 grid gap-3 md:grid-cols-3">
								<label className="block">
									<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
										Current Password
									</span>
									<input
										type="password"
										name="oldPassword"
										value={passwordForm.oldPassword}
										onChange={handlePasswordInput}
										className="w-full border-2 border-black px-3 py-2 text-sm font-semibold outline-none"
									/>
								</label>

								<label className="block">
									<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
										New Password
									</span>
									<input
										type="password"
										name="newPassword"
										value={passwordForm.newPassword}
										onChange={handlePasswordInput}
										className="w-full border-2 border-black px-3 py-2 text-sm font-semibold outline-none"
									/>
								</label>

								<label className="block">
									<span className="mb-1 block text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
										Confirm New
									</span>
									<input
										type="password"
										name="confirmNewPassword"
										value={passwordForm.confirmNewPassword}
										onChange={handlePasswordInput}
										className="w-full border-2 border-black px-3 py-2 text-sm font-semibold outline-none"
									/>
								</label>
							</div>

							{passwordForm.newPassword &&
								passwordForm.confirmNewPassword &&
								passwordForm.newPassword !== passwordForm.confirmNewPassword && (
									<p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-black">
										Password confirmation does not match
									</p>
								)}

							<button
								type="submit"
								disabled={
									isChangingPassword ||
									!passwordForm.oldPassword ||
									!passwordForm.newPassword ||
									passwordForm.newPassword !==
										passwordForm.confirmNewPassword
								}
								className="mt-4 border-2 border-black bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isChangingPassword ? "Updating..." : "Change Password"}
							</button>
						</form>
					</div>
				</div>

				<div className="mt-6 grid gap-3 md:grid-cols-3">
					<div className="border-2 border-black p-4">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
							Profile Sync
						</p>
						<p className="mt-2 text-2xl font-black uppercase tracking-tight">LIVE</p>
					</div>
					<div className="border-2 border-black bg-black p-4 text-white">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">
							Access Level
						</p>
						<p className="mt-2 text-2xl font-black uppercase tracking-tight">
							{(profileForm.role || "user").toUpperCase()}
						</p>
					</div>
					<div className="border-2 border-black p-4">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
							Account State
						</p>
						<p className="mt-2 text-2xl font-black uppercase tracking-tight">
							{(profileForm.status || "active").toUpperCase()}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;
