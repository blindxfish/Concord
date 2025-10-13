import ServicesList from '../../components/ServicesList'

export default function ServicesPage() {
	return (
		<div className="mx-auto max-w-7xl p-6">
			<header className="mb-6">
				<h1 className="text-xl font-semibold">Container Management</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Manage running and stopped containers. Only one version per service can run at a time.
				</p>
				<div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
					<p className="text-sm text-blue-800 dark:text-blue-200">
						💡 <strong>Tip:</strong> To create containers from images, use the 
						<a href="/images" className="underline hover:no-underline"> Images page</a>.
					</p>
				</div>
			</header>
			<section className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
				<ServicesList />
			</section>
		</div>
	)
}
