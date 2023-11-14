import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUnlockAlt } from "react-icons/fa";
import { logout, forgotPassword, reset } from "../../state/auth/authSlice";
import Spinner from "../../components/Spinner";
import { Grid, Button, FormControl, Input } from "@mui/material";

function ForgotPassword() {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success("Email sent sucessfully. Please follow the instructions");
      dispatch(logout());
      dispatch(reset());
      navigate("/");
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
    };

    dispatch(forgotPassword(userData));
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
          <section className="heading" style={{ fontSize: "25px" }}>
            <h1 style={{ fontSize: "35px" }}>
              <FaUnlockAlt /> Forgot Password
            </h1>
            <p>Please enter your email address</p>
          </section>

          <section className="form" style={{ fontSize: "25px" }}>
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
      </Grid>
    </>
  );
}

export default ForgotPassword;
