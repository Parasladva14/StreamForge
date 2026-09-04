import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        color: "#9CA3AF",
        fontSize: "14px",
      }}
    >
      Last Update:
      {" "}
      {time.toLocaleTimeString()}
    </div>
  );
}