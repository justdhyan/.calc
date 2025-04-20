
import Calculator from "@/components/Calculator/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-gradient p-4 md:p-8">
      <div className="mt-4 mb-8 text-center animate-fade-in">
        <h1 className="text-6xl md:text-5xl font-bold bg-gradient-to-r from-[#B9ABF5] to-[#6A2BFC] bg-clip-text text-transparent animate-glow">
          .calc
        </h1>
        <p className=" text-[16px] mt-0 text-white/70 max-w-2xl mx-auto hover:text-white/90 transition-colors duration-300">
          Quietly powerful.
        </p>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full animate-scale-fade">
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
