const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Floating food emojis with varied animations */}
      <div
        className="absolute top-20 left-10 text-2xl"
        style={{ animationDelay: "0s" }}
      >
        🍕
      </div>
      <div
        className="absolute top-40 right-20 text-2xl animate-spin"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      >
        🍔
      </div>
      <div
        className="absolute top-60 left-1/4 text-2xl"
        style={{ animationDelay: "2s" }}
      >
        🌮
      </div>
      <div
        className="absolute bottom-40 right-10 text-2xl"
        style={{ animationDelay: "3s" }}
      >
        🍜
      </div>
      <div
        className="absolute bottom-60 left-20 text-2xl animate-bounce"
        style={{ animationDelay: "4s" }}
      >
        🍱
      </div>
      <div
        className="absolute top-32 right-1/3 text-2xl animate-bounce"
        style={{ animationDelay: "1.5s", animationDuration: "4s" }}
      >
        🍰
      </div>
      <div
        className="absolute bottom-32 left-1/3 text-2xl animate-bounce"
        style={{ animationDelay: "1.5s" }}
      >
        🥗
      </div>
      <div
        className="absolute top-80 left-1/2 text-2xl animate-spin"
        style={{ animationDelay: "3.5s" }}
      >
        🍪
      </div>
    </div>
  );
};

export default FloatingParticles;
