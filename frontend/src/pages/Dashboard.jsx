import { useSelector } from "react-redux";

const Dashboard = () => {
	const { user } = useSelector((state) => state.auth);

	return (
		<section className="min-h-screen bg-white px-4 py-6 text-black md:px-8">
			<div className="mx-auto max-w-7xl border-2 border-black p-4 md:p-6">
				<p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
					Control Center
				</p>
				<h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">
					Dashboard
				</h1>

				<div className="mt-6 grid gap-3 md:grid-cols-3">
					<article className="border-2 border-black p-4">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
							Signed In User
						</p>
						<p className="mt-2 text-lg font-black uppercase">{user?.name || "N/A"}</p>
					</article>

					<article className="border-2 border-black p-4">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
							Current Role
						</p>
						<p className="mt-2 text-lg font-black uppercase">{user?.role || "N/A"}</p>
					</article>

					<article className="border-2 border-black p-4">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
							Account Status
						</p>
						<p className="mt-2 text-lg font-black uppercase">{user?.status || "N/A"}</p>
					</article>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
