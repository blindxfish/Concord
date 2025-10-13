export default function HomePage() {
	return (
		<div className="mx-auto max-w-6xl p-6">
			<header className="mb-8">
				<h1 className="text-2xl font-semibold">Welcome to Concord</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">Docker container versioning and management tool</p>
			</header>
			<section className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-6 shadow-sm">
				<h2 className="mb-2 text-lg font-medium">Features</h2>
				<div className="grid md:grid-cols-2 gap-4 mt-4">
					<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h3 className="font-medium text-gray-900 dark:text-gray-100">Container Management</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Start, stop, and manage running containers. One version per service.</p>
					</div>
					<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h3 className="font-medium text-gray-900 dark:text-gray-100">Docker Images</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">View images and create containers from them</p>
					</div>
					<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h3 className="font-medium text-gray-900 dark:text-gray-100">Naming Guide</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Best practices for Docker naming and tagging</p>
					</div>
					<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h3 className="font-medium text-gray-900 dark:text-gray-100">Examples</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Docker commands and configuration examples</p>
					</div>
				</div>
			</section>
		</div>
	)
}


