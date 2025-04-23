interface logoSizes {
  size: "small" | "medium" | "big";
}

function Logo(size: logoSizes) {
  switch (size.size) {
    case "small":
      return (
        <div className="flex justify-center items-center gap-2">
          <img
            src="/logo/logo.svg"
            alt="qrbites logo"
            className="w-10 aspect-square"
          />
          <h1 className="text-xl font-medium">Qrbites</h1>
        </div>
      );
    case "medium":
      return (
        <div className="flex justify-center items-center gap-2">
          <img
            src="/logo/logo.svg"
            alt="qrbites logo"
            className="w-12 aspect-square"
          />
          <h1 className="text-3xl font-medium">Qrbites</h1>
        </div>
      );
    case "big":
      return (
        <div className="flex justify-center items-center gap-2">
          <img
            src="/logo/logo.svg"
            alt="qrbites logo"
            className="w-18 aspect-square"
          />
          <h1 className="text-4xl font-medium">Qrbites</h1>
        </div>
      );
  }
}

export default Logo;
