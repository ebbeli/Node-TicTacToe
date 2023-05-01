import { Container } from "@mui/material";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />

      <Container sx={{ p: 10 }}>{children}</Container>
    </>
  );
};
export default Layout;
