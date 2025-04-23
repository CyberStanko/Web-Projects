import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Logo */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/stanko.png"
          alt="STANKO background"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <main className="flex flex-col items-center gap-12 text-white">
          {/* Main Logo */}
          <Image
            src="/stanko.png"
            alt="STANKO logo"
            width={400}
            height={100}
            priority
            className="w-[200px] sm:w-[400px]"
          />
          
          {/* Welcome Text */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-wider animate-fade-in">
              Welcome
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Building digital experiences with passion and precision
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="mt-8 px-8 py-3 bg-white text-black rounded-full 
                     font-semibold transition-all duration-300 
                     hover:bg-gray-200 hover:scale-105 
                     animate-fade-in-up"
          >
            Get Started
          </a>
        </main>
      </div>
    </div>
  );
}
