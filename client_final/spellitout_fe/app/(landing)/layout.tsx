const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-black">
    {children}
  </main>
);

export default LandingLayout;
