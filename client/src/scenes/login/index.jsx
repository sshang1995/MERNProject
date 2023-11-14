import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login, reset } from "../../state/auth/authSlice";
import Spinner from "../../components/Spinner";
import {
  Grid,
  Button,
  FormControl,
  InputAdornment,
  Input,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <section className="form" style={{ fontSize: "25px" }}>
            <h1 style={{ fontSize: "35px" }}>
              <FaSignInAlt /> Login
            </h1>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <FormControl variant="standard">
                  <Input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={onChange}
                    style={{ fontSize: "25px" }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="form-group">
                <FormControl variant="standard">
                  <Input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={onChange}
                    style={{ fontSize: "25px" }}
                    startAdornment={
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <br />
              <div className="form-group">
                <Button
                  type="submit"
                  variant="contained"
                  style={{ fontSize: "20px" }}
                >
                  Submit
                </Button>
              </div>
            </form>
            <div className="forgot-password">
              <Link to="/forgotPassword">
                <span style={{ color: "white" }}>Forgot Password?</span>
              </Link>
            </div>
            <div className="register">
              <Link to="/register">
                <span style={{ color: "white" }}>Create a new account</span>
              </Link>
            </div>
          </section>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
