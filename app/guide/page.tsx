export default function GuidePage() {
	return (
		<div className="mx-auto max-w-6xl p-6">
			<header className="mb-8">
				<h1 className="text-2xl font-semibold">Concord Naming & Versioning Guide</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">Complete guide for Docker naming conventions and examples that work with Concord</p>
			</header>
			
			<div className="space-y-8">
				{/* Core Naming Rules */}
				<section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Core Naming Rules</h2>
					
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Service Name Format</h3>
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<code className="text-sm font-mono text-blue-600 dark:text-blue-400">
									{`<project>-<component>`}
								</code>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								Examples: <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">mydevplace-frontend</code>, 
								<code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">mydevplace-backend</code>, 
								<code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">concord-web</code>
							</p>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Version Tagging Strategy</h3>
							<div className="space-y-3">
								<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
									<h4 className="font-medium text-green-800 dark:text-green-200">Semantic Versioning (Required)</h4>
									<code className="text-sm font-mono text-green-600 dark:text-green-400">
										v1.0.0, v1.2.3, v2.0.0
									</code>
									<p className="text-sm text-green-700 dark:text-green-300 mt-1">
										Use semantic versioning for all releases. Concord requires this format.
									</p>
								</div>
								
								<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
									<h4 className="font-medium text-blue-800 dark:text-blue-200">Always Tag as Latest</h4>
									<code className="text-sm font-mono text-blue-600 dark:text-blue-400">
										service:v1.0.0, service:latest
									</code>
									<p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
										Tag your image with both version and latest for easy reference.
									</p>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Container Naming Rules</h3>
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Pattern: <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">&lt;service&gt;-vX.Y.Z-&lt;timestamp&gt;</code></li>
									<li>• Example: <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">concord-web-v1.0.12-1760386836</code></li>
									<li>• Concord extracts: service=concord-web, version=v1.0.12, build=1760386836</li>
									<li>• Use hyphens (-), keep lowercase, no spaces/special characters</li>
								</ul>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Required Labels</h3>
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">concord.service</code> - Service name (e.g., concord-web)</li>
									<li>• <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">concord.version</code> - Version tag (e.g., v1.0.12)</li>
									<li>• <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">concord.build</code> - Build timestamp (e.g., 1760386836)</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* Examples Section */}
				<section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Examples</h2>
					
					<div className="space-y-6">
						{/* Concord Scripts */}
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Using Concord Scripts (Recommended)</h3>
							<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
								<code># Bump version in package.json</code><br/>
								<code>./bump-version.sh patch</code><br/>
								<code># Build and start new container, keep older ones stopped</code><br/>
								<code>./build.sh</code>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								This automatically handles versioning, container naming, and labeling.
							</p>
						</div>

						{/* Manual Docker Commands */}
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Manual Docker Commands</h3>
							<div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
								<code># Build image with version tag</code><br/>
								<code>docker build -t mydevplace-frontend:v1.2.3 .</code><br/>
								<code>docker tag mydevplace-frontend:v1.2.3 mydevplace-frontend:latest</code><br/>
								<code># Create container with Concord labels</code><br/>
								<code>docker create --name mydevplace-frontend-v1.2.3-1760386836 \</code><br/>
								<code>  --label concord.service=mydevplace-frontend \</code><br/>
								<code>  --label concord.version=v1.2.3 \</code><br/>
								<code>  --label concord.build=1760386836 \</code><br/>
								<code>  -p 3000:3000 -e NODE_ENV=production \</code><br/>
								<code>  mydevplace-frontend:v1.2.3</code><br/>
								<code>docker start mydevplace-frontend-v1.2.3-1760386836</code>
							</div>
						</div>

						{/* Docker Compose Example */}
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Docker Compose Example</h3>
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

						{/* Jenkinsfile Example */}
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Jenkins Pipeline Example</h3>
							<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`pipeline {
  agent any
  environment {
    SERVICE = 'mydevplace-frontend'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build & Run') {
      steps {
        script {
          def VERSION = sh(returnStdout: true, script: "node -p \\"require('./package.json').version\\"").trim()
          def VERSION_V = "v\${VERSION}"
          def TIMESTAMP = sh(returnStdout: true, script: 'date +%s').trim()
          def IMAGE = "\${SERVICE}:\${VERSION_V}"
          def CONTAINER = "\${SERVICE}-\${VERSION_V}-\${TIMESTAMP}"
          sh "docker build -t \${IMAGE} ."
          sh "docker tag \${IMAGE} \${SERVICE}:latest"
          sh "docker ps --format '{{.Names}}' | grep -E '^\${SERVICE}-' | xargs -r -I{} docker stop {} || true"
          sh '''docker create \\
            --name \${CONTAINER} \\
            --label concord.service=\${SERVICE} \\
            --label concord.version=\${VERSION_V} \\
            --label concord.build=\${TIMESTAMP} \\
            -p 3000:3000 -e NODE_ENV=production \\
            \${IMAGE}'''
          sh "docker start \${CONTAINER}"
          echo "Started \${CONTAINER} (version \${VERSION_V})"
        }
      }
    }
  }
}`}
							</pre>
						</div>
					</div>
				</section>

				{/* Best Practices */}
				<section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Best Practices</h2>
					
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">✅ Do</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>• Use semantic versioning (v1.0.0, v1.2.3)</li>
								<li>• Always tag images with both version and latest</li>
								<li>• Use descriptive service names (mydevplace-frontend)</li>
								<li>• Include all required Concord labels</li>
								<li>• Create containers for each version (don't leave as images)</li>
								<li>• Use consistent naming across environments</li>
								<li>• Keep container names under 64 characters</li>
							</ul>
						</div>
						
						<div>
							<h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">❌ Don't</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>• Use generic names like "app" or "web"</li>
								<li>• Create untagged images (&lt;none&gt;)</li>
								<li>• Use incomplete versioning (v1, v2)</li>
								<li>• Mix naming conventions in the same project</li>
								<li>• Use special characters in names</li>
								<li>• Skip the required Concord labels</li>
								<li>• Use "latest" as the only tag</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Concord Workflow */}
				<section className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">How Concord Works</h2>
					
					<div className="space-y-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
							</div>
							<div>
								<h4 className="font-medium text-blue-800 dark:text-blue-200">Container-First Approach</h4>
								<p className="text-sm text-blue-700 dark:text-blue-300">Every build creates a new container, older versions remain stopped but available for rollback.</p>
							</div>
						</div>
						
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
							</div>
							<div>
								<h4 className="font-medium text-blue-800 dark:text-blue-200">One Service, One Running Container</h4>
								<p className="text-sm text-blue-700 dark:text-blue-300">Starting a new version automatically stops the previous running version of the same service.</p>
							</div>
						</div>
						
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
							</div>
							<div>
								<h4 className="font-medium text-blue-800 dark:text-blue-200">Version Management</h4>
								<p className="text-sm text-blue-700 dark:text-blue-300">Concord groups containers by service name and shows all versions with their status (running, stopped, previous).</p>
							</div>
						</div>
						
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
							</div>
							<div>
								<h4 className="font-medium text-blue-800 dark:text-blue-200">Easy Rollback</h4>
								<p className="text-sm text-blue-700 dark:text-blue-300">Click "Start" on any previous version to instantly rollback. No need to rebuild or redeploy.</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}