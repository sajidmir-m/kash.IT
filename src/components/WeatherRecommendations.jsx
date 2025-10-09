export default function WeatherRecommendations() {
  return (
    <section className="py-12 px-6 lg:px-12 bg-white">
      {/* Removed max-w constraint → section is full-width with padding */}

      <div className="bg-gray-50 rounded-xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between">
          
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Weather-Based Recommendations
            </h2>
            <p className="text-gray-600 mb-5 max-w-2xl text-sm">
              We adjust our recommendations based on Srinagar's current weather conditions. 
              From hot kahwa during snowfall to refreshing drinks in summer, we've got you covered.
            </p>
            <button className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              See Today's Recommendations
            </button>
          </div>

          {/* Right Content (Image / Placeholder) */}
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="w-40 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs text-center">
                Weather-based products
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
