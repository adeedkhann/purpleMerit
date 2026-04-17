import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Save, Search, Shield, Trash2, UserRound } from "lucide-react";
import { fetchUsers, removeUser, updateUserAccess } from "../features/users/userSlice";

const formatDate = (value) => {
	if (!value) return "N/A";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "N/A";
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

const formatCreatedBy = (createdBy) => {
	if (!createdBy) return "SYSTEM";
	if (typeof createdBy === "object") {
		return createdBy.name || createdBy.email || createdBy._id || "SYSTEM";
	}

	if (typeof createdBy === "string" && createdBy.length > 10) {
		return `${createdBy.slice(0, 6)}...${createdBy.slice(-4)}`;
	}

	return createdBy;
};

const getStatusClass = (status) => {
	return status === "active"
		? "bg-black text-white"
		: "bg-white text-black";
};

const UserManagement = () => {
	const dispatch = useDispatch();

	const {
		users,
		totalUsers,
		totalPages,
		currentPage,
		isLoading,
		isError,
		message,
	} = useSelector((state) => state.users);

	const { user: currentUser } = useSelector((state) => state.auth);

	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [editMap, setEditMap] = useState({});

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchTerm(searchInput.trim());
			setPage(1);
		}, 350);

		return () => clearTimeout(timer);
	}, [searchInput]);

	useEffect(() => {
		const params = {
			page,
			limit: 8,
			search: searchTerm,
			role: roleFilter === "all" ? undefined : roleFilter,
			status: statusFilter === "all" ? undefined : statusFilter,
		};

		dispatch(fetchUsers(params));
	}, [dispatch, page, roleFilter, searchTerm, statusFilter]);

	const canDeleteUser = useMemo(
		() => currentUser?.role === "admin",
		[currentUser?.role]
	);

	const canUpdateAccess = useMemo(
		() => currentUser?.role === "admin",
		[currentUser?.role]
	);

	useEffect(() => {
		const nextMap = {};
		users.forEach((user) => {
			nextMap[user._id] = {
				role: user.role,
				status: user.status,
			};
		});
		setEditMap(nextMap);
	}, [users]);

	const handleDelete = (userId) => {
		if (!canDeleteUser) return;

		dispatch(removeUser(userId));
	};

	const handleAccessDraftChange = (userId, field, value) => {
		setEditMap((prev) => ({
			...prev,
			[userId]: {
				...prev[userId],
				[field]: value,
			},
		}));
	};

	const handleAccessSave = async (userId) => {
		if (!canUpdateAccess) return;

		const draft = editMap[userId];
		if (!draft) return;

		await dispatch(
			updateUserAccess({
				targetUserId: userId,
				newStatus: draft.status,
				newRole: draft.role,
			})
		);
	};

	return (
		<section className="min-h-screen bg-white px-4 py-6 text-black md:px-8">
			<div className="mx-auto max-w-7xl border-2 border-black p-4 md:p-6">
				<header className="mb-6 border-b-2 border-black pb-4">
					<p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
						Directory Explorer
					</p>
					<div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
							User Management
						</h1>
						<p className="border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
							Total Records: {totalUsers}
						</p>
					</div>
				</header>

				<div className="mb-6 grid gap-3 border-2 border-black p-3 md:grid-cols-[2fr_1fr_1fr]">
					<label className="relative block">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
						<input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="SEARCH NAME OR EMAIL"
							className="w-full border-2 border-black bg-white py-2 pl-9 pr-3 text-xs font-black uppercase tracking-[0.14em] outline-none"
						/>
					</label>

					<select
						value={roleFilter}
						onChange={(e) => {
							setRoleFilter(e.target.value);
							setPage(1);
						}}
						className="w-full border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] outline-none"
					>
						<option value="all">Role: All</option>
						<option value="admin">Role: Admin</option>
						<option value="manager">Role: Manager</option>
						<option value="user">Role: User</option>
					</select>

					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
						className="w-full border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] outline-none"
					>
						<option value="all">Status: All</option>
						<option value="active">Status: Active</option>
						<option value="inActive">Status: Inactive</option>
					</select>
				</div>

				{isError && (
					<div className="mb-4 border-2 border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white">
						{message || "Failed to load users"}
					</div>
				)}

				<div className="space-y-2">
					{isLoading && (
						<div className="flex items-center justify-center border-2 border-black bg-white px-4 py-6 text-xs font-black uppercase tracking-[0.2em]">
							Loading user directory...
						</div>
					)}

					{!isLoading && users.length === 0 && (
						<div className="flex items-center justify-center border-2 border-black bg-white px-4 py-6 text-xs font-black uppercase tracking-[0.2em]">
							No users matched the current filters
						</div>
					)}

					{!isLoading &&
						users.map((user) => {
							const draft = editMap[user._id] || {
								role: user.role,
								status: user.status,
							};
							const hasAccessChanges =
								draft.role !== user.role || draft.status !== user.status;

							return (
								<article
									key={user._id}
									className="border-2 border-black bg-white px-3 py-3"
								>
									<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
										<div className="min-w-0 flex-1">
											<div className="mb-1 flex flex-wrap items-center gap-2">
												<p className="truncate text-lg font-black uppercase tracking-tight">
													{user.name}
												</p>
												<span
													className={`border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusClass(
														user.status
													)}`}
												>
													{user.status}
												</span>
												<span className="border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-widest">
													{user.role}
												</span>
											</div>

											<p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
												{user.email}
											</p>

											<div className="mt-2 grid gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-700 md:grid-cols-3">
												<div className="flex items-center gap-2">
													<Shield className="h-3.5 w-3.5" />
													<span>Created By: {formatCreatedBy(user.createdBy)}</span>
												</div>
												<div className="flex items-center gap-2">
													<CalendarDays className="h-3.5 w-3.5" />
													<span>{formatDate(user.createdAt)}</span>
												</div>
												<div className="flex items-center gap-2">
													<UserRound className="h-3.5 w-3.5" />
													<span>ID: {user._id}</span>
												</div>
											</div>
										</div>

										{canUpdateAccess && user._id !== currentUser?._id && (
											<div className="flex flex-col gap-2 border-t-2 border-black pt-2 md:w-85 md:border-l-2 md:border-t-0 md:pl-3">
												<div className="grid grid-cols-2 gap-2">
													<select
														value={draft.role}
														onChange={(e) => handleAccessDraftChange(user._id, "role", e.target.value)}
														className="w-full border-2 border-black bg-white px-2 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
													>
														<option value="admin">Role: Admin</option>
														<option value="manager">Role: Manager</option>
														<option value="user">Role: User</option>
													</select>

													<select
														value={draft.status}
														onChange={(e) => handleAccessDraftChange(user._id, "status", e.target.value)}
														className="w-full border-2 border-black bg-white px-2 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
													>
														<option value="active">Status: Active</option>
														<option value="inActive">Status: Inactive</option>
													</select>
												</div>

												<button
													type="button"
													onClick={() => handleAccessSave(user._id)}
													disabled={!hasAccessChanges || isLoading}
													className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
												>
													<Save className="h-3.5 w-3.5" />
													Save Access
												</button>

												{canDeleteUser && (
													<button
														type="button"
														onClick={() => handleDelete(user._id)}
														className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
													>
														<Trash2 className="h-3.5 w-3.5" />
														Delete
													</button>
												)}
											</div>
										)}
									</div>
								</article>
							);
						})}
				</div>

				<footer className="mt-6 flex items-center justify-between border-2 border-black p-3">
					<button
						type="button"
						disabled={page <= 1 || isLoading}
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						className="border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40"
					>
						Prev
					</button>

					<p className="text-[10px] font-black uppercase tracking-[0.16em]">
						Page {currentPage} / {Math.max(totalPages, 1)}
					</p>

					<button
						type="button"
						disabled={page >= totalPages || isLoading}
						onClick={() => setPage((prev) => Math.min(prev + 1, totalPages || 1))}
						className="border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40"
					>
						Next
					</button>
				</footer>
			</div>
		</section>
	);
};

export default UserManagement;
