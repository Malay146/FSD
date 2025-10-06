import React from "react";

const TestComponent = () => {
	return (
		<div className="min-h-screen bg-blue-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-6">
					Tailwind CSS Test - Working!
				</h1>

				{/* Basic styling test */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<h2 className="text-2xl font-semibold text-blue-600 mb-4">
						Basic Styles Test
					</h2>
					<p className="text-gray-600 mb-4">
						This text should be styled with Tailwind CSS. If you can see proper
						styling, Tailwind is working correctly.
					</p>
					<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
						Test Button
					</button>
				</div>

				{/* Grid test */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-red-100 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-red-800">Red Card</h3>
						<p className="text-red-600">Responsive grid test</p>
					</div>
					<div className="bg-green-100 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-green-800">Green Card</h3>
						<p className="text-green-600">Responsive grid test</p>
					</div>
					<div className="bg-purple-100 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-purple-800">
							Purple Card
						</h3>
						<p className="text-purple-600">Responsive grid test</p>
					</div>
				</div>

				{/* Success message */}
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-green-800">
								Tailwind CSS is working!
							</h3>
							<div className="mt-2 text-sm text-green-700">
								<p>
									All styles are being applied correctly. You can now proceed
									with the full application.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestComponent;
