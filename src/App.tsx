import { useState } from 'react'

const PRESET_MULTIPLIERS = [50, 60, 70] as const

function App() {
  const [assets, setAssets] = useState<number | ''>('')
  const [retentionDays, setRetentionDays] = useState<number | ''>('')
  const [multiplierMode, setMultiplierMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<number>(60)
  const [customMultiplier, setCustomMultiplier] = useState<number | ''>('')

  const multiplier = multiplierMode === 'preset' ? selectedPreset : (typeof customMultiplier === 'number' ? customMultiplier : 0)

  // Calculations
  const volume = typeof assets === 'number' ? assets * multiplier : 0 // in MB
  const volumeGB = volume / 1024 // convert to GB for display

  const hasValidInputs = typeof assets === 'number' && typeof retentionDays === 'number' && assets > 0 && retentionDays > 0 && multiplier > 0

  // VM Requirements
  const dataAnalyzerWorkers = hasValidInputs ? Math.ceil(volumeGB / 300) : 0
  const dataLakeWorkers = hasValidInputs ? Math.ceil(((volumeGB * retentionDays) / 12700) * 1.05) : 0
  const mdsDisabled = dataLakeWorkers >= 3 ? 'Yes' : 'No'
  const coordinateNode = dataLakeWorkers >= 5 ? 'Yes' : 'No'

  // Appliance Requirements
  const m6000Appliances = hasValidInputs ? Math.ceil(((volumeGB * retentionDays) / 11500) * 1.05) : 0

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          VM & Appliance Requirements Calculator
        </h1>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Number of Assets
              </label>
              <input
                type="number"
                min="0"
                value={assets}
                onChange={(e) => setAssets(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of assets"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Days of Retention
              </label>
              <input
                type="number"
                min="0"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter days of retention"
              />
            </div>
          </div>

          {/* Multiplier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Volume per Asset (MB)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_MULTIPLIERS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setMultiplierMode('preset')
                    setSelectedPreset(preset)
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    multiplierMode === 'preset' && selectedPreset === preset
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset} MB{preset === 60 && ' (Default)'}
                </button>
              ))}
              <button
                onClick={() => setMultiplierMode('custom')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  multiplierMode === 'custom'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
              {multiplierMode === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={customMultiplier}
                    onChange={(e) => setCustomMultiplier(e.target.value ? Number(e.target.value) : '')}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Value"
                    autoFocus
                  />
                  <span className="text-gray-500 text-sm">MB</span>
                </div>
              )}
            </div>
          </div>
          {hasValidInputs && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Calculated Volume:</span> {assets.toLocaleString()} assets × {multiplier} MB = {volume.toLocaleString()} MB ({volumeGB.toFixed(2)} GB)
              </p>
            </div>
          )}
        </div>

        {/* VM Requirements Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">VM Requirements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Component</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Specs</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800 font-medium">Data Analyzer Worker</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">64GB RAM, 16 CPU, 500GB system disk</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded">
                      {hasValidInputs ? dataAnalyzerWorkers : '-'}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800 font-medium">Data Lake Worker</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">128GB RAM, 16 CPU, 500GB system disk, 16TB data disk</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded">
                      {hasValidInputs ? dataLakeWorkers : '-'}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800 font-medium">MDS Disabled?</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">Data Lake master has no data storage, +1 node for master</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block font-semibold px-3 py-1 rounded ${
                      hasValidInputs
                        ? mdsDisabled === 'Yes'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hasValidInputs ? mdsDisabled : '-'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-800 font-medium">Coordinate Node?</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">Recommended after 5 data nodes, increases search performance</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block font-semibold px-3 py-1 rounded ${
                      hasValidInputs
                        ? coordinateNode === 'Yes'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hasValidInputs ? coordinateNode : '-'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Appliance Requirements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Appliance Requirements (Base)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Component</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 text-gray-800 font-medium">M6000 Appliance (equivalent)</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded">
                      {hasValidInputs ? m6000Appliances : '-'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
