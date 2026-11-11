import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import TaskDetailsPage from "./pages/TaskDetailsPage.jsx";
import HabitsPage from "./pages/HabitsPage.jsx";
import HabitDetailsPage from "./pages/HabitDetailsPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailsPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="habits/:habitId" element={<HabitDetailsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
