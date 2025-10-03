export default function HomePage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Role-Based App 🚀</h1>
        <p className="mt-4">Login to continue</p>
        <a
          href="/login"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
