import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useState } from "react";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 chracters required")
    .required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Signup = () => {
  const navigate = useNavigate();

  const [selFile, setSelFile] = useState("");

  // initialize the formik
  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      avatar: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      values.avatar = selFile;

      setTimeout(() => {
        console.log(values);
        setSubmitting(false);
      }, 3000);

      // send the data to the server

      const res = await fetch("http://localhost:5000/user/add", {
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
          title: "Nice",
          text: "You have signed up sucessfully",
        })
          .then((result) => {
            navigate("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!!",
          text: "Something went wrong",
        });
      }
    },
    validationSchema: SignupSchema,
  });

  const uploadFile = async (e) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    console.log(file.name);
    setSelFile(file.name);

    const fd = new FormData();
    fd.append("myfile", file);

    const res = await fetch("http://localhost:5000/util/uploadfile", {
      method: "POST",
      body: fd,
    });

    console.log(res.status);
  };

  return (
    <div className="background" style={{overflow:"hidden"}}>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, stiffness: 100 }}
        className="py-5 my-3 container-fluid"
      >
        <div className="col-md-3 mx-auto">
          <div className="card shadow bg-transparent">
            <div className="card-body">
              <form onSubmit={signupForm.handleSubmit}>
                <h3 className="text-center text-white">Signup Here</h3>
                <hr />

                <label className="text-white">Name</label>
                <span
                  style={{ fontSize: "0.7em", color: "red", margineLeft: 20 }}
                >
                  {signupForm.touched.name && signupForm.errors.name}
                </span>
                <input
                  type="text"
                  className="form-control mb-4 bg-transparent text-white"
                  name="name"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.name}
                />

                <label className="text-white">Email</label>
                <span
                  style={{ fontSize: "0.7em", color: "red", margineLeft: 20 }}
                >
                  {signupForm.touched.email && signupForm.errors.email}
                </span>
                <input
                  className="form-control mb-4 bg-transparent text-white"
                  name="email"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.email}
                />

                <label className="text-white">Password</label>
                <span
                  style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}
                >
                  {signupForm.errors.password}
                </span>
                <input
                  type="password"
                  className="form-control mb-4 bg-transparent text-white"
                  name="password"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.password}
                />

                {/* <input className="text-white" type="file" onChange={uploadFile} /> */}

                <button
                  disabled={signupForm.isSubmitting}
                  type="submit"
                  className="mx-auto btn mt-1 w-100 text-white"
                >
                  {signupForm.isSubmitting ? (
                    <>
                      <span
                        class="spinner-border spinner-border-sm "
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span > Loading ...</span>
                    </>
                  ) : (
                    "Sumbit"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
