import { useFormik } from "formik";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UseAppContext from "../AppContext";

const Login = () => {
  const { setLoggedin } = UseAppContext();
  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      console.log(values);

      const res = await fetch("http://localhost:5000/user/authenticate", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res.status);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
        });

        const data = await res.json();

        console.log(data);

        sessionStorage.setItem("user", JSON.stringify(data));

        setLoggedin(true);
        navigate("/");
      } else if (res.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Email or password is incorrect",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong",
        });
      }
    },
  });

  // useEffect(() => {
  //   if (loggedin) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div className="background " style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
        className="py-5 my-3 container-fluid"
      >
        <div className="col-md-3 mx-auto  ">
          <div className="card shadow bg-transparent">
            <div className="card-body">
              <form onSubmit={loginForm.handleSubmit}>
                <h2 className="text-center text-white">Login Here</h2>

                <label className="text-white">Email</label>
                <input
                  id="email"
                  onChange={loginForm.handleChange}
                  value={loginForm.values.email}
                  type="email"
                  className="form-control mb-4 bg-transparent text-white"
                />
                <label className="text-white">Password</label>
                <input
                  id="password"
                  onChange={loginForm.handleChange}
                  value={loginForm.values.password}
                  type="password"
                  className="form-control mb-4 bg-transparent text-white"
                />
                <p className="text-center  text-white">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary">
                    signup Here
                  </a>
                </p>

                <button
                  type="submit"
                  className="btn text-white mx-auto w-100 mt-4"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
