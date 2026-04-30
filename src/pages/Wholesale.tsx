import { Truck, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function Wholesale() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Wholesale Supply
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Partner with Karochebama for reliable, bulk supply of premium agricultural and fish products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Request a Quote</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="first-name" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="last-name" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" id="company" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50" />
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product of Interest</label>
                <select id="product" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50">
                  <option>Fresh Tilapia</option>
                  <option>Smoked Catfish</option>
                  <option>Organic Maize</option>
                  <option>Fish Feed</option>
                  <option>Other (Specify in message)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Estimated Quantity</label>
                  <input type="text" id="quantity" placeholder="e.g., 500 kg" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50" />
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select id="frequency" className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50">
                    <option>One-time</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Details</label>
                <textarea id="message" rows={4} className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 bg-gray-50"></textarea>
              </div>

              <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                Submit Request
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Why buy wholesale from us?</h2>
            
            <div className="space-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-100 text-emerald-600">
                    <Truck className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Direct Farm-to-Business Logistics</h3>
                  <p className="mt-2 text-base text-gray-500 leading-relaxed">
                    We handle the logistics. Our dedicated cold-chain transport ensures your products arrive fresh, exactly when you need them.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 text-blue-600">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Guaranteed Quality & Traceability</h3>
                  <p className="mt-2 text-base text-gray-500 leading-relaxed">
                    Every batch is tracked from our farm to your facility. We adhere to strict international quality and hygiene standards.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-amber-100 text-amber-600">
                    <Clock className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Consistent Supply</h3>
                  <p className="mt-2 text-base text-gray-500 leading-relaxed">
                    Our large-scale production capacity means you never have to worry about stockouts. We guarantee consistent supply year-round.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-900 mb-4">Typical Wholesale Clients:</h4>
              <ul className="space-y-3">
                {['Supermarket Chains', 'Restaurants & Hotels', 'Food Processing Companies', 'Site Distributors'].map((item, i) => (
                  <li key={i} className="flex items-center text-emerald-800">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
