import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import MatchList from "./pages/MatchList";
import Rankings from "./pages/Rankings";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import NotStartedMatch from "./pages/NotStartedMatch";
import { useTheme } from "./pages/ThemeContext";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/Terms";
import ContactUs from "./pages/ContactUs";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import NewsList from "./pages/newsAdminPannel/NewsList";
import { ToastContainer } from "react-toastify";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "#171717" : "";

  return (
    <div className="min-h-screen text-white " style={{ backgroundColor }}>
      <Navbar />
      <main className="pb-1">{children}</main>
       {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
};

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <MatchList />
      </MainLayout>
    ),
  },
  {
    path: "/rankings",
    element: (
      <MainLayout>
        <Rankings />
      </MainLayout>
    ),
  },
  {
    path: "/match-preview/:id",
    element: (
      <MainLayout>
        <MatchDetails />
      </MainLayout>
    ),
  },
   {
    path: "/match-preview/:slug/:id",
    element: (
      <MainLayout>
        <MatchDetails />
      </MainLayout>
    ),
  },
  {
    path: "/about",
    element: (
      <MainLayout>
        <About />
      </MainLayout>
    ),
  },
  {
    path: "/notstarted/:id",
    element: (
      <MainLayout>
        <NotStartedMatch />
      </MainLayout>
    ),
  },
  {
    path: "/privacy",
    element: (
      <MainLayout>
        <PrivacyPolicy />
      </MainLayout>
    ),
  },
  {
    path: "/terms",
    element: (
      <MainLayout>
        <TermsOfUse />
      </MainLayout>
    ),
  },
  {
    path: "/contactus",
    element: (
      <MainLayout>
        <ContactUs />
      </MainLayout>
    ),
  },
  {
    path: "/news",
    element: (
      <MainLayout>
        <News />
      </MainLayout>
    ),
  },
  {
    path: "/news/:slug",
    element: (
      <MainLayout>
        <NewsDetails />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },

//   {
//   path: "/admin/pannel/news",
//   element: (
//     <MainLayout>
//       <NewsList />
//     </MainLayout>
//   ),
// }

{
  path: "/admin/pannel/news",
  element: <NewsList />, // No MainLayout here
}


]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={routes} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
