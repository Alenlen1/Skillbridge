import { create } from "zustand";

interface PortfolioRefreshState {
  // Bumped whenever something changes portfolio data from outside its own
  // section (e.g. importing a GitHub repo creates a Project, but that
  // happens inside GithubSection, not ProjectsSection). Other sections
  // watch this value and refetch their own data when it changes, instead
  // of requiring a full page refresh to see the update.
  version: number;
  bump: () => void;
}

export const usePortfolioRefreshStore = create<PortfolioRefreshState>(
  (set) => ({
    version: 0,
    bump: () => set((state) => ({ version: state.version + 1 })),
  }),
);
