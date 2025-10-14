"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function AboutPage() {
	const [activeTab, setActiveTab] = useState('mission')

	const tabs = [
		{ id: 'mission', title: 'Mission', icon: '🎯' },
		{ id: 'features', title: 'Features', icon: '✨' },
		{ id: 'philosophy', title: 'Philosophy', icon: '💡' },
		{ id: 'opensource', title: 'Open Source', icon: '🌐' },
		{ id: 'community', title: 'Community', icon: '👥' }
	]

	return (
		<div className="w-full p-6">
			<header className="mb-8">
				<div className="flex items-center gap-4 mb-4">
					<Image
						src="/graphics/simplelogodark.png"
						alt="Concord Logo"
						width={48}
						height={48}
						className="hidden dark:block"
					/>
					<Image
						src="/graphics/simplelogolight.png"
						alt="Concord Logo"
						width={48}
						height={48}
						className="block dark:hidden"
					/>
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About Concord</h1>
						<p className="text-lg text-gray-600 dark:text-gray-400">Open Source Docker Container Versioning</p>
					</div>
				</div>
			</header>

			<div className="flex gap-8">
				{/* Tab Navigation */}
				<div className="w-64 flex-shrink-0">
					<nav className="sticky top-6 space-y-2">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
									activeTab === tab.id
										? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-l-4 border-blue-500'
										: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
							>
								<span className="mr-3">{tab.icon}</span>
								{tab.title}
							</button>
						))}
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 min-w-0">
					{activeTab === 'mission' && <MissionSection />}
					{activeTab === 'features' && <FeaturesSection />}
					{activeTab === 'philosophy' && <PhilosophySection />}
					{activeTab === 'opensource' && <OpenSourceSection />}
					{activeTab === 'community' && <CommunitySection />}
				</div>
			</div>
		</div>
	)
}

function MissionSection() {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
				<h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Our Mission</h2>
				<p className="text-lg text-blue-800 dark:text-blue-200 mb-4">
					Concord is an open source project with a simple yet powerful mission: <strong>simplify Docker container versioning, rollbacks, and deployment tracking</strong> for developers and DevOps teams.
				</p>
				<p className="text-blue-700 dark:text-blue-300">
					We believe that managing container versions shouldn't be complex. Concord provides a container-first approach that makes it easy to deploy, track, and rollback your applications with confidence.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">🎯 Core Goals</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• Simplify container versioning and rollbacks</li>
						<li>• Provide intuitive deployment tracking</li>
						<li>• Enable one-click rollback capabilities</li>
						<li>• Reduce deployment complexity</li>
						<li>• Improve developer productivity</li>
					</ul>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">🚀 Target Users</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• DevOps engineers managing container deployments</li>
						<li>• Development teams needing easy rollbacks</li>
						<li>• Organizations with complex container workflows</li>
						<li>• Teams transitioning to containerized applications</li>
						<li>• Anyone frustrated with current container management tools</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

function FeaturesSection() {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Key Features</h2>
				
				<div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-sm">🔄</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Container-First Versioning</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Every build creates a new versioned container with unique identifiers</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-400 text-sm">⚡</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">One-Click Rollbacks</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Switch between versions instantly without rebuilding or redeploying</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
								<span className="text-purple-600 dark:text-purple-400 text-sm">📊</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Deployment Tracking</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Complete audit trail of all deployments with timestamps and versions</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
								<span className="text-yellow-600 dark:text-yellow-400 text-sm">🏷️</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Labeling</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Uses Docker labels for reliable service organization and versioning</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
								<span className="text-red-600 dark:text-red-400 text-sm">🎨</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Modern UI</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Clean, intuitive interface with dark/light mode support</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
								<span className="text-indigo-600 dark:text-indigo-400 text-sm">🔧</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">CI/CD Integration</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">Ready-to-use Jenkins pipelines and automated deployment scripts</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function PhilosophySection() {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
				<h2 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">Our Philosophy</h2>
				<p className="text-lg text-green-800 dark:text-green-200 mb-4">
					Concord is built on the principle that <strong>container management should be simple, reliable, and developer-friendly</strong>.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Container-First Approach</h3>
					<div className="space-y-3">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">Every Build = New Container</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">No more storing builds as images - every deployment creates a versioned container</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">Preserve History</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Older versions remain available (stopped) for instant rollback</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">One Service, One Running</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Only one version per service runs at any time</p>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Developer Experience</h3>
					<div className="space-y-3">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-400 text-xs font-bold">1</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">Zero Learning Curve</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Intuitive interface that works the way developers think</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-400 text-xs font-bold">2</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">Fast Operations</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Start, stop, and rollback operations complete in seconds</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-400 text-xs font-bold">3</span>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100">Clear Status</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Always know which version is running and what's available</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function OpenSourceSection() {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
				<h2 className="text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-4">Open Source & Community</h2>
				<p className="text-lg text-purple-800 dark:text-purple-200 mb-4">
					Concord is <strong>100% open source</strong> and built by the community, for the community. We believe in transparency, collaboration, and making container management accessible to everyone.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">🌐 Open Source Benefits</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• <strong>Free to use</strong> - No licensing fees or restrictions</li>
						<li>• <strong>Transparent</strong> - All code is publicly available</li>
						<li>• <strong>Customizable</strong> - Modify and extend to fit your needs</li>
						<li>• <strong>Community-driven</strong> - Features and improvements from users</li>
						<li>• <strong>Secure</strong> - Open source means security through transparency</li>
					</ul>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">📈 Project Status</h3>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">License</span>
							<span className="font-medium text-gray-900 dark:text-gray-100">MIT</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">Repository</span>
							<a 
								href="https://github.com/blindxfish/Concord" 
								target="_blank" 
								rel="noopener noreferrer"
								className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
							>
								GitHub
							</a>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">Language</span>
							<span className="font-medium text-gray-900 dark:text-gray-100">TypeScript</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">Framework</span>
							<span className="font-medium text-gray-900 dark:text-gray-100">Next.js</span>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
				<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">🔗 Get Involved</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Contribute</h4>
						<p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
							Help improve Concord by contributing code, documentation, or bug reports.
						</p>
						<a 
							href="https://github.com/blindxfish/Concord" 
							target="_blank" 
							rel="noopener noreferrer"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
						>
							View on GitHub
						</a>
					</div>
					<div>
						<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Report Issues</h4>
						<p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
							Found a bug or have a feature request? Let us know!
						</p>
						<a 
							href="https://github.com/blindxfish/Concord/issues" 
							target="_blank" 
							rel="noopener noreferrer"
							className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
						>
							Report Issue
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

function CommunitySection() {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
				<h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-100 mb-4">Join Our Community</h2>
				<p className="text-lg text-orange-800 dark:text-orange-200">
					Concord is built by developers, for developers. Join our growing community of container management enthusiasts!
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-blue-600 dark:text-blue-400 text-xl">⭐</span>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Star the Project</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
						Show your support by starring Concord on GitHub
					</p>
					<a 
						href="https://github.com/blindxfish/Concord" 
						target="_blank" 
						rel="noopener noreferrer"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
					>
						Star on GitHub
					</a>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-green-600 dark:text-green-400 text-xl">🐛</span>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Report Bugs</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
						Help us improve by reporting issues and bugs
					</p>
					<a 
						href="https://github.com/blindxfish/Concord/issues/new" 
						target="_blank" 
						rel="noopener noreferrer"
						className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
					>
						Report Bug
					</a>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-purple-600 dark:text-purple-400 text-xl">💡</span>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Suggest Features</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
						Have ideas for new features? We'd love to hear them!
					</p>
					<a 
						href="https://github.com/blindxfish/Concord/issues/new" 
						target="_blank" 
						rel="noopener noreferrer"
						className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
					>
						Suggest Feature
					</a>
				</div>
			</div>

			<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Why Open Source Matters</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">For Users</h4>
						<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
							<li>• No vendor lock-in</li>
							<li>• Full control over your data</li>
							<li>• Customize to your needs</li>
							<li>• No hidden costs or limitations</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">For Contributors</h4>
						<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
							<li>• Learn from real-world code</li>
							<li>• Build your portfolio</li>
							<li>• Make a difference</li>
							<li>• Join a supportive community</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
