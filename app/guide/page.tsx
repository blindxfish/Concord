"use client"

import { useState } from 'react'

const sections = [
	{ id: 'overview', title: 'Overview', icon: '📋' },
	{ id: 'labels', title: 'Concord Labels', icon: '🏷️' },
	{ id: 'examples', title: 'Examples', icon: '💡' },
	{ id: 'ai-guide', title: 'AI Assistant Guide', icon: '🤖' },
	{ id: 'best-practices', title: 'Best Practices', icon: '⭐' },
	{ id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' }
]

export default function GuidePage() {
	const [activeSection, setActiveSection] = useState('overview')

	return (
		<div className="w-full p-6">
			<header className="mb-8">
				<h1 className="text-2xl font-semibold">Concord Documentation</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">Complete guide for using concord.labels to organize and manage your Docker containers</p>
			</header>

			<div className="flex gap-8">
				{/* Sidebar Navigation */}
				<div className="w-64 flex-shrink-0">
					<nav className="sticky top-6 space-y-2">
						{sections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
									activeSection === section.id
										? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-l-4 border-blue-500'
										: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
							>
								<span className="mr-3">{section.icon}</span>
								{section.title}
							</button>
						))}
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 min-w-0">
					{activeSection === 'overview' && <OverviewSection />}
					{activeSection === 'labels' && <LabelsSection />}
					{activeSection === 'examples' && <ExamplesSection />}
					{activeSection === 'ai-guide' && <AIGuideSection />}
					{activeSection === 'best-practices' && <BestPracticesSection />}
					{activeSection === 'troubleshooting' && <TroubleshootingSection />}
				</div>
			</div>
		</div>
	)
}

// Section Components
function OverviewSection() {
	return (
		<div className="space-y-6">
			<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">What is Concord?</h2>
				<p className="text-blue-800 dark:text-blue-200">
					Concord is an open source Docker container versioning and management tool that helps you organize, track, and manage multiple versions of your applications. 
					It uses Docker labels to group containers by service and version, making it easy to deploy, rollback, and manage your containerized applications.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Features</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• Container versioning and management</li>
						<li>• Service-based organization</li>
						<li>• Easy rollback capabilities</li>
						<li>• Docker image management</li>
						<li>• Volume and port configuration</li>
						<li>• Real-time system monitoring</li>
					</ul>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">How It Works</h3>
					<ol className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>1. Build images with unique tags</li>
						<li>2. Create containers with concord labels</li>
						<li>3. Concord groups containers by service</li>
						<li>4. Manage versions through the UI</li>
						<li>5. Easy start/stop/rollback operations</li>
					</ol>
				</div>
			</div>
		</div>
	)
}

function LabelsSection() {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Required Concord Labels</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Concord uses Docker labels to organize containers. These labels are required for proper service grouping and versioning.
				</p>

				<div className="space-y-4">
					<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
						<h4 className="font-medium text-blue-900 dark:text-blue-100">concord.service</h4>
						<code className="text-sm font-mono text-blue-600 dark:text-blue-400">
							concord.service=mydevplace-frontend
						</code>
						<p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
							Identifies the service name. Used for grouping containers by service.
						</p>
					</div>
					
					<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
						<h4 className="font-medium text-green-900 dark:text-green-100">concord.version</h4>
						<code className="text-sm font-mono text-green-600 dark:text-green-400">
							concord.version=v1.2.3
						</code>
						<p className="text-sm text-green-700 dark:text-green-300 mt-1">
							Semantic version of the service. Used for sorting and version management.
						</p>
					</div>
					
					<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
						<h4 className="font-medium text-purple-900 dark:text-purple-100">concord.build</h4>
						<code className="text-sm font-mono text-purple-600 dark:text-purple-400">
							concord.build=1760386836
						</code>
						<p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
							Unique build timestamp. Used for build identification and sorting.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Why Use Concord Labels?</h3>
				<div className="space-y-2 text-yellow-800 dark:text-yellow-200">
					<p>• <strong>Reliable:</strong> Labels are explicit and don't depend on naming conventions</p>
					<p>• <strong>Flexible:</strong> Container names can be anything, labels handle organization</p>
					<p>• <strong>Standard:</strong> Uses Docker's native labeling system</p>
					<p>• <strong>Future-proof:</strong> Easy to extend with additional metadata</p>
				</div>
			</div>
		</div>
	)
}

function ExamplesSection() {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Using Concord Scripts (Recommended)</h2>
				<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
					<code># Bump version in package.json</code><br/>
					<code>./bump-version.sh patch</code><br/>
					<code># Build and start new container with concord labels</code><br/>
					<code>./build.sh</code>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
					This automatically handles versioning, container creation, and concord labeling.
				</p>
			</div>

			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Manual Docker Commands</h2>
				<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
					<code># Build image with version tag</code><br/>
					<code>docker build -t mydevplace-frontend:v1.2.3 .</code><br/>
					<code>docker tag mydevplace-frontend:v1.2.3 mydevplace-frontend:latest</code><br/>
					<code># Create container with REQUIRED concord labels</code><br/>
					<code>docker create --name mydevplace-frontend-v1.2.3-1760386836 \</code><br/>
					<code>  --label concord.service=mydevplace-frontend \</code><br/>
					<code>  --label concord.version=v1.2.3 \</code><br/>
					<code>  --label concord.build=1760386836 \</code><br/>
					<code>  -p 3000:3000 -e NODE_ENV=production \</code><br/>
					<code>  mydevplace-frontend:v1.2.3</code><br/>
					<code>docker start mydevplace-frontend-v1.2.3-1760386836</code>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
					<strong>Note:</strong> Container names can be anything - Concord uses the labels for organization!
				</p>
			</div>

			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Docker Compose Example</h2>
				<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
					<code>version: '3.8'</code><br/>
					<code>name: mydevplace</code><br/>
					<code>services:</code><br/>
					<code>  frontend:</code><br/>
					<code>    image: mydevplace-frontend:v1.2.3</code><br/>
					<code>    container_name: mydevplace-frontend-v1.2.3-1760386836</code><br/>
					<code>    ports:</code><br/>
					<code>      - "3000:3000"</code><br/>
					<code>    labels:</code><br/>
					<code>      - concord.service=mydevplace-frontend</code><br/>
					<code>      - concord.version=v1.2.3</code><br/>
					<code>      - concord.build=1760386836</code>
				</div>
			</div>
		</div>
	)
}

function AIGuideSection() {
	const aiPrompt = `You are helping me create Docker containers that work with Concord, a container versioning management system. 

Concord uses specific Docker labels to organize containers:
- concord.service: The service name (e.g., "myapp-frontend", "api-server")
- concord.version: Semantic version (e.g., "v1.2.3")
- concord.build: Unix timestamp (e.g., "1760386836")

When creating containers for Concord, always include these labels:
--label concord.service=<service-name>
--label concord.version=<version>
--label concord.build=<timestamp>

Example container creation:
docker create --name myapp-frontend-v1.2.3-1760386836 \\
  --label concord.service=myapp-frontend \\
  --label concord.version=v1.2.3 \\
  --label concord.build=1760386836 \\
  -p 3000:3000 \\
  -e NODE_ENV=production \\
  myapp-frontend:v1.2.3

Please help me create a container for: [describe your application here]`

	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">🤖 AI Assistant Guide</h2>
				<p className="text-purple-800 dark:text-purple-200 mb-4">
					Use this prompt with any AI assistant (ChatGPT, Claude, etc.) to get help creating Concord-compatible containers.
				</p>
			</div>

			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Copy this prompt:</h3>
				<div className="relative">
					<textarea
						value={aiPrompt}
						readOnly
						className="w-full h-64 p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg border border-gray-600 resize-none"
					/>
					<button
						onClick={() => navigator.clipboard.writeText(aiPrompt)}
						className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
					>
						Copy
					</button>
				</div>
			</div>

			<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">How to use:</h3>
				<ol className="space-y-2 text-green-800 dark:text-green-200">
					<li>1. Copy the prompt above</li>
					<li>2. Paste it into your AI assistant</li>
					<li>3. Replace "[describe your application here]" with your specific needs</li>
					<li>4. The AI will generate Concord-compatible Docker commands</li>
					<li>5. Run the generated commands in your terminal</li>
				</ol>
			</div>

			<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Example AI Response:</h3>
				<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
					<code># For a React frontend app</code><br/>
					<code>docker build -t myapp-frontend:v1.0.0 .</code><br/>
					<code>docker create --name myapp-frontend-v1.0.0-1760386836 \</code><br/>
					<code>  --label concord.service=myapp-frontend \</code><br/>
					<code>  --label concord.version=v1.0.0 \</code><br/>
					<code>  --label concord.build=1760386836 \</code><br/>
					<code>  -p 3000:3000 \</code><br/>
					<code>  -e NODE_ENV=production \</code><br/>
					<code>  myapp-frontend:v1.0.0</code><br/>
					<code>docker start myapp-frontend-v1.0.0-1760386836</code>
				</div>
			</div>
		</div>
	)
}

function BestPracticesSection() {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Best Practices</h2>
				
				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">🏷️ Label Management</h3>
						<ul className="space-y-2 text-gray-600 dark:text-gray-400">
							<li>• Always use semantic versioning (v1.2.3)</li>
							<li>• Use descriptive service names (myapp-frontend, not just frontend)</li>
							<li>• Generate unique build timestamps for each deployment</li>
							<li>• Keep service names consistent across environments</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">🐳 Container Management</h3>
						<ul className="space-y-2 text-gray-600 dark:text-gray-400">
							<li>• Stop old versions before starting new ones</li>
							<li>• Keep at least one previous version for rollback</li>
							<li>• Use meaningful container names for debugging</li>
							<li>• Clean up unused containers regularly</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">📦 Image Management</h3>
						<ul className="space-y-2 text-gray-600 dark:text-gray-400">
							<li>• Tag images with both version and latest</li>
							<li>• Use multi-stage builds to reduce image size</li>
							<li>• Remove unused images to save space</li>
							<li>• Use specific base image versions</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">🔄 CI/CD Integration</h3>
						<ul className="space-y-2 text-gray-600 dark:text-gray-400">
							<li>• Automate version bumping in your pipeline</li>
							<li>• Generate build timestamps automatically</li>
							<li>• Test containers before promoting to production</li>
							<li>• Use environment-specific service names</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

function TroubleshootingSection() {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Common Issues</h2>
				
				<div className="space-y-6">
					<div className="border-l-4 border-red-500 pl-4">
						<h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Containers not showing in Concord</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-2">This usually means missing or incorrect labels.</p>
						<div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
							<code># Check if labels are correct</code><br/>
							<code>docker inspect &lt;container-name&gt; | grep concord</code>
						</div>
					</div>

					<div className="border-l-4 border-yellow-500 pl-4">
						<h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">Can't delete images</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-2">Images are still referenced by containers.</p>
						<div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
							<code># Stop and remove containers first</code><br/>
							<code>docker stop &lt;container-name&gt;</code><br/>
							<code>docker rm &lt;container-name&gt;</code><br/>
							<code>docker rmi &lt;image-name&gt;</code>
						</div>
					</div>

					<div className="border-l-4 border-blue-500 pl-4">
						<h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Port conflicts</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-2">Multiple containers trying to use the same port.</p>
						<div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
							<code># Check what's using the port</code><br/>
							<code>docker ps | grep :3000</code><br/>
							<code># Use a different port</code><br/>
							<code>docker run -p 3001:3000 ...</code>
						</div>
					</div>

					<div className="border-l-4 border-green-500 pl-4">
						<h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">Performance issues</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-2">Too many containers or images consuming resources.</p>
						<div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
							<code># Clean up unused resources</code><br/>
							<code>docker system prune -a</code><br/>
							<code># Check resource usage</code><br/>
							<code>docker system df</code>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Need Help?</h3>
				<p className="text-yellow-800 dark:text-yellow-200">
					If you're still having issues, check the Docker logs and ensure all required labels are present. 
					The Concord system requires all three labels (service, version, build) to properly organize containers.
				</p>
			</div>
		</div>
	)
}