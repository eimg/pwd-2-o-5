import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ViewPost from "./pages/ViewPost";
import Notifications from "./pages/Notifications";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/view/:id",
				element: <ViewPost />,
			},
			{
				path: "/notifications",
				element: <Notifications />,
			},
		],
	},
]);

export default function AppRouter() {
    return <RouterProvider router={router} />
}
