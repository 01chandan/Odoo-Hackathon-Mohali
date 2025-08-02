import "../index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="text-center py-10 px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-6">
          Trade Skills,
          <br />
          <span className="text-blue-400">Transform Lives</span>
        </h1>
        <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto">
          Join thousands of learners exchanging knowledge and skills. Teach what
          you know, learn what you need - all without spending a dime.
        </p>
        <div className="flex justify-center space-x-6">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 flex items-center">
            Start Swapping Skills
            <span className="ml-2">→</span>
          </button>
          <button className="text-gray-700 px-8 py-3 hover:text-gray-900">
            Explore Skills
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
