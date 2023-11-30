import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "assets/Logo.svg";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Saving the backend error
  const [isEmailError, setIsEmailError] = useState("");
  const [isPasswordError, setIsPasswordError] = useState("");
  const [isFormError, setIsFormError] = useState("");

  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (isRegistering) {
      // Registration
      try {
        const response = await fetch("http://localhost:3001/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
          }),
        });

        if (response.ok) {
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");

          setIsFormError("Registration Successfull, Please Login");

          setIsRegistering(false);

          setTimeout(() => {
            setIsFormError("");
          }, 3000);
        } else {
          const data = await response.json();
          if (data.message === "User does not exist") {
            setIsEmailError("User does not exist");
          } else if (data.message === "Invalid Password") {
            setIsPasswordError("Invalid Password");
          }
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    } else {
      // Login
      try {
        const response = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (response.ok) {
          const { token } = await response.json();
          localStorage.setItem("token", token);
          navigate("/home");
        } else {
          if (response.error) {
          }
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center  h-screen">
      <div className="flex items-center justify-center mb-8">
        <img alt="Logo" src={Logo} />
      </div>
      <p className="text-center text-blue-600">{isFormError}</p>
      {/* <h1
        className={`text-2xl font-black text-center ${
          isRegistering ? "mb-4" : "mb-2"
        }`}
      >
        {isRegistering ? "Sign Up" : "Login"}
      </h1> */}
      <form onSubmit={handleFormSubmit}>
        {isRegistering && (
          <>
            <div className="flex items-center justify-center">
              <input
                className="rounded-xl w-3/6 py-4 px-3 leading-tight focus:outline-none text-Tertiary"
                type="text"
                value={firstName}
                placeholder="First name"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center mt-6">
              <input
                className="rounded-xl w-3/6 py-4 px-3 leading-tight focus:outline-none text-Tertiary"
                type="text"
                value={lastName}
                placeholder="Last name"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </>
        )}

        <div
          className={`flex items-center justify-center ${
            isRegistering ? "mt-6" : "mt-2"
          }`}
        >
          <input
            className="rounded-xl w-3/6 py-4 px-3 leading-tight focus:outline-none text-Tertiary"
            type="email"
            value={email}
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {isEmailError && (
          <p className="text-red-500 text-center">User does not exist</p>
        )}

        <div className="flex items-center justify-center mt-6">
          <input
            className="rounded-xl w-3/6 py-4 px-3 leading-tight focus:outline-none text-Tertiary"
            type="password"
            value={password}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isPasswordError && (
          <p className="text-red-500 text-center">User does not exist</p>
        )}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="w-3/6 rounded-xl py-4 bg-Secondary mt-6 text-Quaternary hover:bg-hoverBg "
          >
            {isRegistering ? "REGISTER" : "LOGIN"}{" "}
          </button>
        </div>
      </form>
      <p className="flex justify-center items-center mt-2 text-Tertiary">
        {isRegistering
          ? "Already have an account?\u00A0"
          : "Don't have an account?\u00A0"}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default Form;
