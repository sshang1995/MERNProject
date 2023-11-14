import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { register, reset } from "../../state/auth/authSlice";
import Spinner from "../../components/Spinner";
import {
  Grid,
  Button,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const checkPassword = () => {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasLowerCaseLetter = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasCapitalLetter && hasLowerCaseLetter && hasNumber;
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      console.log(isSuccess);
      console.log(user);
      navigate("/login");
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

    if (!name || !email || !password || !password2) {
      toast.error("Please enter all fields");
      console.log("enter all fields");
    } else if (password.length < 6) {
      toast.error("The password needs to have at least 6 characters");
    } else if (password !== password2) {
      toast.error("Passwords do not match");
    } else if (!checkPassword()) {
      toast.error(
        "Password must has one capital letter, one lower case letter and one number"
      );
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
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
        <section className="heading" style={{ fontSize: "25px" }}>
          <h1 style={{ fontSize: "35px" }}>
            <FaUser /> Register
          </h1>
          <p>Please create an account</p>
        </section>

        <section className="form" style={{ fontSize: "25px" }}>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <FormControl variant="standard">
                <Input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  placeholder="Enter your name"
                  style={{ fontSize: "25px" }}
                  onChange={onChange}
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
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  style={{ fontSize: "25px" }}
                  onChange={onChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailRoundedIcon />
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
                  style={{ fontSize: "25px" }}
                  onChange={onChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyIcon />
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
                  id="password2"
                  name="password2"
                  value={password2}
                  placeholder="Confirm password"
                  style={{ fontSize: "25px" }}
                  onChange={onChange}
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
        </section>
      </Grid>
    </>
  );
}

export default Register;
