import { Clock4 } from "lucide-react";
import { Text } from "lucide-react";
import { Languages } from "lucide-react";

export const Feature = () => {
  return (
    <main className="flex-1" id="features">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center text-gray-100  bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
            Key Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="text-center">
              <Clock4 size={56} className="mx-auto" />
              <h3 className="text-xl font-bold text-gray-200 mt-2">
                Real-Time Transcription
              </h3>
              <p className="text-gray-400">
                Enjoy seamless and real-time transcription with your team.
              </p>
            </div>
            <div className="text-center">
              <Text size={56} className="mx-auto" />
              <h3 className="text-xl font-bold text-gray-200 mt-2">
                Text Transcription
              </h3>
              <p className="text-gray-400">
                Get real-time transcription on screen.
              </p>
            </div>
            <div className="text-center">
              <Languages size={56} className="mx-auto" />
              <h3 className="text-xl font-bold text-gray-200 mt-2">
                Language Support
              </h3>
              <p className="text-gray-400">
                Choose transcript language of your choice
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
