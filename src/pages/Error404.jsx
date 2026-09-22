import { Link } from "react-router-dom";
import { NotFound } from "react-zt-404";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
const Error404 = () => {
    const navigate = useNavigate();
    return (
        <div>
            <NotFound
                onButtonClick={() => navigate("/")}
            />
            <Footer/>
        </div>
    )
}
export default Error404;