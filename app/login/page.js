export default function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222E43]">
        <div className="w-full max-w-sm p-8 space-y-6 bg-[#1B2B3C] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white">WELCOME</h2>
          <p className="text-center text-white">Login to your account</p>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-black bg-white rounded-full hover:bg-gray-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  