import { Container } from "@mui/material";
import AppDrawer from "./components/AppDrawer";
import Header from "./components/Header";

import ViewPost from "./pages/ViewPost";

export default function App() {
    return <div>
        <Header />
        <AppDrawer />

        <Container sx={{ mt: 4 }} maxWidth="sm">
            <ViewPost />
        </Container>
    </div>
}