import ImagesTable from '../../components/ImagesTable'

export default function ImagesPage() {
	return (
		<div className="w-full p-6">
			<header className="mb-6">
				<h1 className="text-xl font-semibold">Docker Images</h1>
				<p className="text-gray-600 dark:text-gray-400">
					View and manage Docker images. Create containers from images to use them in the Services page.
				</p>
				<div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
					<p className="text-sm text-amber-800 dark:text-amber-200">
						⚠️ <strong>Note:</strong> Images are templates. To run them, create containers first.
					</p>
				</div>
			</header>
			<section className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
				<ImagesTable />
			</section>
		</div>
	)
}



