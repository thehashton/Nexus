export function AccountCreated() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="nexus-success-mark">
        <svg
          viewBox="0 0 56 56"
          className="size-16"
          aria-hidden="true"
        >
          <circle
            className="nexus-success-circle"
            cx="28"
            cy="28"
            r="26"
            fill="none"
            stroke="url(#nexus-success-gradient)"
            strokeWidth="3"
          />
          <path
            className="nexus-success-check"
            fill="none"
            stroke="url(#nexus-success-gradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 29.5 24 37l15.5-18"
          />
          <defs>
            <linearGradient
              id="nexus-success-gradient"
              x1="8"
              y1="48"
              x2="48"
              y2="8"
            >
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="nexus-success-copy grid gap-1">
        <p className="text-lg font-medium">Account created</p>
        <p className="text-sm text-muted-foreground">
          Taking you into Nexus…
        </p>
      </div>
    </div>
  );
}
