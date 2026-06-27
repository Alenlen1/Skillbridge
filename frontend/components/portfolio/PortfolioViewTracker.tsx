"use client";

import { useEffect } from "react";

export default function PortfolioViewTracker({
  username,
}: {
  username: string;
}) {
  useEffect(() => {
    const cookieName = `portfolio_viewed_${username}`;

    if (document.cookie.includes(cookieName)) return;

    const API =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
fetch(`${API}/portfolio/${username}/view`, {
  method: "POST",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to record portfolio view");
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    document.cookie = `${cookieName}=true; expires=${expires.toUTCString()}; path=/`;
  })
  .catch(console.error);
  }, [username]);

  return null;
}
